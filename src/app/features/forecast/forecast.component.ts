// forecast.component.ts
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { StormglassService } from 'src/app/core/services/stormglass.service';
import appContent from 'src/assets/content/surfcond-content.json';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})

export class ForecastComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  forecastDiaria: any[] = [];
  forecastSemanal: any[] = [];
  textos = appContent.forecast;
  infoCards = appContent.forecast.infoCards;
  infoCarouselItems = [...this.infoCards, ...this.infoCards, ...this.infoCards];
  tipoPrevisao: 'diaria' | 'semanaria' = 'diaria';
  paginaAtual = 0;
  itensPorPagina = 3;
  isMobile: boolean = false;
  animarEntrada = false;
  isLoading = false;
  private forecastRequestId = 0;
  private carouselTimer?: ReturnType<typeof setInterval>;
  private carouselResumeTimer?: ReturnType<typeof setTimeout>;
  private isDraggingCarousel = false;
  private carouselStartX = 0;
  private carouselStartScroll = 0;

  @Input() cidade: string = '';
  @ViewChild('infoCarousel') infoCarousel?: ElementRef<HTMLElement>;

  constructor(private stormglassService: StormglassService) {}

  ngOnInit(): void {
    this.onResize(); // inicializa com base na tela atual
    if (this.cidade) {
      this.carregarPrevisoes(this.cidade);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.centerCarousel();
      this.startCarouselAutoPlay();
    });
  }

  ngOnDestroy(): void {
    this.stopCarouselAutoPlay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cidade'] && changes['cidade'].currentValue !== changes['cidade'].previousValue) {
      if (!changes['cidade'].currentValue) {
        this.limparPrevisoes();
        return;
      }

      this.paginaAtual = 0;
      this.animarEntrada = true;
      this.carregarPrevisoes(changes['cidade'].currentValue);
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth <= 550 ;
    this.keepCarouselInLoop();
  }

  moveInfoCarousel(direction: 1 | -1) {
    const carousel = this.infoCarousel?.nativeElement;
    if (!carousel) return;
    this.stopCarouselAutoPlay();
    const card = carousel.querySelector<HTMLElement>('.info-card');
    const step = card ? card.offsetWidth + 12 : carousel.clientWidth * 0.72;
    carousel.scrollTo({
      left: carousel.scrollLeft + direction * step,
      behavior: 'smooth',
    });
    this.resumeCarouselAutoPlay();
  }

  onCarouselPointerDown(event: PointerEvent) {
    const carousel = this.infoCarousel?.nativeElement;
    if (!carousel) return;
    this.stopCarouselAutoPlay();
    this.isDraggingCarousel = true;
    this.carouselStartX = event.clientX;
    this.carouselStartScroll = carousel.scrollLeft;
    carousel.setPointerCapture(event.pointerId);
  }

  onCarouselPointerMove(event: PointerEvent) {
    const carousel = this.infoCarousel?.nativeElement;
    if (!carousel || !this.isDraggingCarousel) return;
    carousel.scrollLeft = this.carouselStartScroll - (event.clientX - this.carouselStartX);
  }

  onCarouselPointerUp(event: PointerEvent) {
    const carousel = this.infoCarousel?.nativeElement;
    if (!carousel || !this.isDraggingCarousel) return;
    this.isDraggingCarousel = false;
    carousel.releasePointerCapture(event.pointerId);
    this.keepCarouselInLoop();
    this.resumeCarouselAutoPlay();
  }

  selecionarTipoPrevisao(tipo: 'diaria' | 'semanaria') {
    if (this.tipoPrevisao === tipo) return;
    this.animarEntrada = false;
    this.tipoPrevisao = tipo;
    this.paginaAtual = 0;
  }

  carregarPrevisoes(cidade: string) {
    const requestId = ++this.forecastRequestId;
    this.isLoading = true;
    const cidadeFormatada = this.normalizeText(cidade);

    const praias = appContent.locations;
    const coords = praias[cidadeFormatada as keyof typeof praias];
    if (!coords) {
      this.isLoading = false;
      return;
    }

    const { lat, lng } = coords;

    forkJoin({
      ondas: this.stormglassService.getForecastLive(lat, lng),
      vento: this.stormglassService.getForecastWind(lat, lng),
    }).subscribe({
      next: ({ ondas, vento }) => {
      if (requestId !== this.forecastRequestId) return;
      const horas = ondas.hourly.time;
      const hoje = new Date();
      const diaHoje = hoje.toISOString().split('T')[0];

      const previsaoCompleta = horas.map((hora: string, index: number) => ({
        time: hora,
        waveHeight: ondas.hourly.wave_height[index],
        waveDirection: ondas.hourly.wave_direction[index],
        wavePeriod: ondas.hourly.wave_period[index],
        seaLevel: ondas.hourly.sea_level_height_msl[index],
        windSpeed: vento.hourly.wind_speed_10m?.[index],
        windDirection: vento.hourly.wind_direction_10m?.[index],
      }));

      // diária
      this.forecastDiaria = previsaoCompleta.filter((h: any) =>
        h.time.startsWith(diaHoje)
      );

      // semanal
      const inicio = new Date(hoje);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(inicio);
      fim.setDate(fim.getDate() + 6);
      fim.setHours(23, 59, 59, 999);

      const agrupadoPorDia: { [data: string]: any[] } = {};
      previsaoCompleta.forEach((h: any) => {
        const data = h.time.split('T')[0];
        const dataObj = new Date(h.time);
        if (dataObj >= inicio && dataObj <= fim) {
          if (!agrupadoPorDia[data]) agrupadoPorDia[data] = [];
          agrupadoPorDia[data].push(h);
        }
      });

      this.forecastSemanal = Object.entries(agrupadoPorDia)
        .map(([data, horarios]) => {
          const periodos: {
            matutino: any[];
            vespertino: any[];
            noturno: any[];
          } = {
            matutino: [],
            vespertino: [],
            noturno: [],
          };

          horarios.forEach((h: any) => {
            const hora = new Date(h.time).getHours();
            if (hora >= 0 && hora < 12) periodos.matutino.push(h);
            else if (hora >= 12 && hora < 18) periodos.vespertino.push(h);
            else periodos.noturno.push(h);
          });

          const calcularMedia = (dados: any[]) => {
            const soma = (chave: string) =>
              dados.reduce((acc, cur) => acc + (cur[chave] || 0), 0);
            const media = (chave: string) =>
              dados.length ? soma(chave) / dados.length : null;
            return {
              waveHeight: media('waveHeight'),
              waveDirection: media('waveDirection'),
              wavePeriod: media('wavePeriod'),
              seaLevel: media('seaLevel'),
              tidePeakTime: this.getTidePeakTime(dados),
              windSpeed: media('windSpeed'),
              windDirection: media('windDirection'),
            };
          };

          return {
            data,
            matutino: calcularMedia(periodos.matutino),
            vespertino: calcularMedia(periodos.vespertino),
            noturno: calcularMedia(periodos.noturno),
          };
        })
        .filter(
          (dia: any) =>
            dia.matutino.waveHeight !== null ||
            dia.vespertino.waveHeight !== null ||
            dia.noturno.waveHeight !== null
        );

      this.paginaAtual = 0;
      this.isLoading = false;
      },
      error: () => {
        if (requestId !== this.forecastRequestId) return;
        this.forecastDiaria = [];
        this.forecastSemanal = [];
        this.isLoading = false;
      },
    });
  }

  private limparPrevisoes() {
    this.paginaAtual = 0;
    this.tipoPrevisao = 'diaria';
    this.forecastDiaria = [];
    this.forecastSemanal = [];
    this.isLoading = false;
    setTimeout(() => {
      this.centerCarousel();
      this.startCarouselAutoPlay();
    });
  }

  private centerCarousel() {
    const carousel = this.infoCarousel?.nativeElement;
    if (!carousel) return;
    carousel.scrollLeft = carousel.scrollWidth / 3;
  }

  private startCarouselAutoPlay() {
    this.stopCarouselAutoPlay();
    if (!this.infoCarousel?.nativeElement || this.cidade) return;
    this.carouselTimer = setInterval(() => {
      const carousel = this.infoCarousel?.nativeElement;
      if (!carousel || this.isDraggingCarousel) return;
      carousel.scrollBy({ left: 1.2, behavior: 'auto' });
      this.keepCarouselInLoop();
    }, 24);
  }

  private stopCarouselAutoPlay() {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = undefined;
    }
    if (this.carouselResumeTimer) {
      clearTimeout(this.carouselResumeTimer);
      this.carouselResumeTimer = undefined;
    }
  }

  private resumeCarouselAutoPlay() {
    if (this.carouselResumeTimer) {
      clearTimeout(this.carouselResumeTimer);
    }
    this.carouselResumeTimer = setTimeout(() => {
      this.keepCarouselInLoop();
      this.startCarouselAutoPlay();
    }, 900);
  }

  keepCarouselInLoop() {
    const carousel = this.infoCarousel?.nativeElement;
    if (!carousel) return;
    const sectionWidth = carousel.scrollWidth / 3;
    if (carousel.scrollLeft < sectionWidth * 0.45) {
      carousel.scrollLeft += sectionWidth;
    } else if (carousel.scrollLeft > sectionWidth * 1.55) {
      carousel.scrollLeft -= sectionWidth;
    }
  }

  get forecastDiariaPaginada() {
    const inicio = this.paginaAtual * this.itensPorPagina;
    return this.forecastDiaria.slice(inicio, inicio + this.itensPorPagina);
  }

  get forecastSemanalPaginado() {
    return this.forecastSemanal.slice(this.paginaAtual, this.paginaAtual + 1);
  }

  get currentDiariaDate(): string {
    const hora = this.forecastDiaria[0];
    return hora ? hora.time : '';
  }

  getMoonPhase(dateValue: string | Date | undefined): string {
    if (!dateValue) return this.textos.fallback;
    const phase = this.getMoonCyclePosition(dateValue);
    if (phase < 1.85 || phase >= 27.68) return this.textos.moonPhases.new;
    if (phase < 5.54) return this.textos.moonPhases.waxingCrescent;
    if (phase < 9.23) return this.textos.moonPhases.firstQuarter;
    if (phase < 12.92) return this.textos.moonPhases.waxingGibbous;
    if (phase < 16.61) return this.textos.moonPhases.full;
    if (phase < 20.30) return this.textos.moonPhases.waningGibbous;
    if (phase < 23.99) return this.textos.moonPhases.lastQuarter;
    return this.textos.moonPhases.waningCrescent;
  }

  getMoonPhaseClass(dateValue: string | Date | undefined): string {
    const phase = this.getMoonCyclePosition(dateValue);
    if (phase < 1.85 || phase >= 27.68) return 'moon-phase-icon--new';
    if (phase < 5.54) return 'moon-phase-icon--waxing-crescent';
    if (phase < 9.23) return 'moon-phase-icon--first-quarter';
    if (phase < 12.92) return 'moon-phase-icon--waxing-gibbous';
    if (phase < 16.61) return 'moon-phase-icon--full';
    if (phase < 20.30) return 'moon-phase-icon--waning-gibbous';
    if (phase < 23.99) return 'moon-phase-icon--last-quarter';
    return 'moon-phase-icon--waning-crescent';
  }

  private getMoonCyclePosition(dateValue: string | Date | undefined): number {
    if (!dateValue) return 0;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 0;

    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
    const lunarCycle = 29.530588853;
    const days = (date.getTime() - knownNewMoon) / 86400000;
    return ((days % lunarCycle) + lunarCycle) % lunarCycle;
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  getDailyTideTrend(index: number): string {
    const currentIndex = this.paginaAtual * this.itensPorPagina + index;
    return this.getTideTrend(
      this.forecastDiaria[currentIndex]?.seaLevel,
      this.forecastDiaria[currentIndex + 1]?.seaLevel,
      this.forecastDiaria[currentIndex - 1]?.seaLevel
    );
  }

  getWeeklyTideTrend(dia: any, periodo: string): string {
    const periodos = ['matutino', 'vespertino', 'noturno'];
    const index = periodos.indexOf(periodo);
    return this.getTideTrend(
      dia?.[periodo]?.seaLevel,
      dia?.[periodos[index + 1]]?.seaLevel,
      dia?.[periodos[index - 1]]?.seaLevel
    );
  }

  getDailyTidePeakTime(): string {
    return this.getTidePeakTime(this.forecastDiaria);
  }

  private getTidePeakTime(dados: any[]): string {
    const tidePeak = dados
      .filter((item) => item?.seaLevel !== null && item?.seaLevel !== undefined && item?.time)
      .reduce((peak, item) => !peak || item.seaLevel > peak.seaLevel ? item : peak, null);

    return tidePeak ? new Date(tidePeak.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : this.textos.fallback;
  }

  private getTideTrend(current: number | null | undefined, next: number | null | undefined, previous: number | null | undefined): string {
    if (current === null || current === undefined) return this.textos.fallback;
    const reference = next !== null && next !== undefined ? next : previous;
    if (reference === null || reference === undefined) return this.textos.fallback;
    if (reference > current) return 'Enchendo';
    if (reference < current) return 'Vazando';
    return 'Estavel';
  }

  getTideTrendIcon(trend: string): string {
    if (trend === 'Enchendo') return 'arrow_upward';
    if (trend === 'Vazando') return 'arrow_downward';
    return 'remove';
  }

  proximaPagina() {
    this.animarEntrada = false;
    const forecast =
      this.tipoPrevisao === 'diaria'
        ? this.forecastDiaria
        : this.forecastSemanal;
    const limite =
      this.tipoPrevisao === 'diaria'
        ? forecast.length / this.itensPorPagina
        : forecast.length;

    if (this.paginaAtual + 1 < limite) {
      this.paginaAtual++;
    }
  }

  isProximaPaginaDisabled(): boolean {
    return this.tipoPrevisao === 'diaria'
      ? (this.paginaAtual + 1) * this.itensPorPagina >= this.forecastDiaria.length
      : (this.paginaAtual + 1) >= this.forecastSemanal.length;
  }

  paginaAnterior() {
    this.animarEntrada = false;
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
    }
  }
}


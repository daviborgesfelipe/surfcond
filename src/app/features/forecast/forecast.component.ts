// forecast.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StormglassService } from 'src/app/core/services/stormglass.service';
import appContent from 'src/assets/content/surfcond-content.json';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})

export class ForecastComponent implements OnInit, OnChanges {
  forecastDiaria: any[] = [];
  forecastSemanal: any[] = [];
  textos = appContent.forecast;
  infoCards = appContent.forecast.infoCards;
  infoCarouselItems = [...this.infoCards, ...this.infoCards, ...this.infoCards];
  tipoPrevisao: 'diaria' | 'semanaria' = 'diaria';
  tipoPrevisaoChecked = false;
  paginaAtual = 0;
  itensPorPagina = 3;
  isMobile: boolean = false;

  @Input() cidade: string = '';

  constructor(private stormglassService: StormglassService) {}

  ngOnInit(): void {
    this.onResize(); // inicializa com base na tela atual
    if (this.cidade) {
      this.carregarPrevisoes(this.cidade);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['cidade'] &&
      changes['cidade'].currentValue &&
      changes['cidade'].currentValue !== changes['cidade'].previousValue
    ) {
      this.paginaAtual = 0;
      this.forecastDiaria = [];
      this.forecastSemanal = [];
      this.carregarPrevisoes(changes['cidade'].currentValue);
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth <= 425 ;
  }

  alternarTipoPrevisao() {
    this.tipoPrevisao = this.tipoPrevisaoChecked ? 'semanaria' : 'diaria';
    this.paginaAtual = 0;
    if (this.cidade) {
      this.carregarPrevisoes(this.cidade);
    }
  }

  carregarPrevisoes(cidade: string) {
    const cidadeFormatada = this.normalizeText(cidade);

    const praias = appContent.locations;
    const coords = praias[cidadeFormatada as keyof typeof praias];
    if (!coords) return;

    const { lat, lng } = coords;

    forkJoin({
      ondas: this.stormglassService.getForecastLive(lat, lng),
      vento: this.stormglassService.getForecastWind(lat, lng),
    }).subscribe(({ ondas, vento }) => {
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
      const fim = new Date(inicio);
      fim.setDate(fim.getDate() + 6);

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
    });
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

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
  }

  proximaPagina() {
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

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
    }
  }
}

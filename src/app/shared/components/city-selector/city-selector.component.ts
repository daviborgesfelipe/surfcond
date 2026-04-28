import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import appContent from 'src/assets/content/surfcond-content.json';

@Component({
  selector: 'app-city-selector',
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.scss'],
})
export class CitySelectorComponent implements OnChanges {
  textos = appContent.selectors;
  todasCidades: { [regiao: string]: string[] } = appContent.selectors.citiesByRegion;

  cidades: string[] = [];
  cidadeSelecionada = '';

  @Input() regiao: string = '';
  @Input() disabled = false;
  @Output() cidadeChange = new EventEmitter<string>();

  ngOnChanges(): void {
    if (this.regiao) {
      this.cidades = this.todasCidades[this.regiao] || [];
      this.cidadeSelecionada = '';
      this.cidadeChange.emit('');
    } else {
      this.cidades = [];
      this.cidadeSelecionada = '';
      this.cidadeChange.emit('');
    }
  }

  onChange() {
    this.cidadeChange.emit(this.cidadeSelecionada);
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-city-selector',
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.scss'],
})
export class CitySelectorComponent implements OnChanges {
  todasCidades: { [regiao: string]: string[] } = {
    'Santa Catarina': [
      'São Francisco',
      'Navegantes',
      'Itajaí',
      'Balneário Camboriú',
      'Florianópolis',
      'Palhoça',
      'Garopaba',
      'Imbituba',
    ],
  };

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
    }
  }

  onChange() {
    this.cidadeChange.emit(this.cidadeSelecionada);
  }
}

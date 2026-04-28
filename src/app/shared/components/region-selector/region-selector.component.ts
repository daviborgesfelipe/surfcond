import { Component, Output, EventEmitter } from '@angular/core';
import appContent from 'src/assets/content/surfcond-content.json';

@Component({
  selector: 'app-region-selector',
  templateUrl: './region-selector.component.html',
  styleUrls: ['./region-selector.component.scss'],
})
export class RegionSelectorComponent {
  textos = appContent.selectors;
  regioes = appContent.selectors.regions;
  regiaoSelecionada = '';

  @Output() regiaoChange = new EventEmitter<string>();

  onChange() {
    this.regiaoChange.emit(this.regiaoSelecionada);
  }
}

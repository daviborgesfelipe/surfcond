import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-region-selector',
  templateUrl: './region-selector.component.html',
  styleUrls: ['./region-selector.component.scss'],
})
export class RegionSelectorComponent {
  regioes = ['Santa Catarina'];
  regiaoSelecionada = '';

  @Output() regiaoChange = new EventEmitter<string>();

  onChange() {
    this.regiaoChange.emit(this.regiaoSelecionada);
  }
}

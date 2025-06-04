import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  cidadeSelecionada: string = '';
  regiaoSelecionada: string = '';

  onCidadeSelecionada(cidade: string) {
    this.cidadeSelecionada = cidade;
  }

  onRegiaoSelecionada(regiao: string) {
    this.regiaoSelecionada = regiao;
  }
}

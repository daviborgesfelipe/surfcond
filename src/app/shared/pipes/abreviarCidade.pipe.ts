import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abreviarCidade'
})
export class AbreviarCidadePipe implements PipeTransform {

  transform(cidade: string): string {
    if (!cidade) return '';

    const mapaAbreviacoes: { [key: string]: string } = {
      'Balneário Camboriú': 'Marambaia',
      'Florianópolis': 'Campeche',
      'Itajaí': 'Brava',
      'São Francisco': 'São Chico',
      'Garopaba': 'Silveira',
      'Imbituba': 'Vila',
      'Navegantes': 'Navega',
      'Palhoça': 'Guarda'
    };

    return mapaAbreviacoes[cidade] || cidade;
  }
}

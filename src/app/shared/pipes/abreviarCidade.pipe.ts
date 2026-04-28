import { Pipe, PipeTransform } from '@angular/core';
import appContent from 'src/assets/content/surfcond-content.json';

@Pipe({
  name: 'abreviarCidade'
})
export class AbreviarCidadePipe implements PipeTransform {

  transform(cidade: string): string {
    if (!cidade) return '';

    const nomes = appContent.selectors.displayNames;
    return nomes[cidade as keyof typeof nomes] || cidade;
  }
}

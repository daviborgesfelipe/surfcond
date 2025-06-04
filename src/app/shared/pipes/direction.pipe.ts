import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'direction'
})

export class DirectionPipe implements PipeTransform {
  transform(degrees: number): string {
    if (degrees === null || degrees === undefined) return 'n/a';

    const directions = [
      'Norte', 'Nordeste', 'Leste', 'Sudeste',
      'Sul', 'Sudoeste', 'Oeste', 'Noroeste', 'Norte'
    ];

    const index = Math.round(degrees / 45);
    return directions[index];
  }
}

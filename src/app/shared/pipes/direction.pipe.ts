import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'direction'
})

export class DirectionPipe implements PipeTransform {
  transform(degrees: number): string {
    if (degrees === null || degrees === undefined) return 'n/a';

    const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO', 'N'];

    const index = Math.round(degrees / 45);
    return directions[index];
  }
}

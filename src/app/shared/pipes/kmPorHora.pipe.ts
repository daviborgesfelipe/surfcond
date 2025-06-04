import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'kmh' })
export class KmhPipe implements PipeTransform {
  transform(value: number): number {
    return value ? value * 3.6 : 0;
  }
}

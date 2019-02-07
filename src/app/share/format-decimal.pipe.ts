import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDecimal'
})
export class FormatDecimalPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value % 1 === 0 ? value : (value as number).toFixed(2);
  }

}

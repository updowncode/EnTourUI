import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateFormat"
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value ? "Awesome " + value : "";
  }
}

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
// @Pipe({ name: "exponentialStrength", pure: true })
// export class ExponentialStrengthPipe implements PipeTransform {
//   transform(value: number, exponent: string): number {
//     const exp = parseFloat(exponent);
//     return Math.pow(value, isNaN(exp) ? 1 : exp);
//   }
// }

// @Pipe({ name: "greatthan" })
// export class GreatThanPipe implements PipeTransform {
//   transform(a: Number[]) {
//     return a.filter(c => c > 1);
//   }
// }

// @Pipe({ name: "greatthanV2", pure: false })
// export class GreatThanPipeV2 implements PipeTransform {
//   transform(a: Number[]) {
//     return a.filter(c => c > 1);
//   }
// }



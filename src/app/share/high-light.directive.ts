import { Directive, ElementRef, Input } from "@angular/core";
// <p myHighlight [highlightColor]="'orange'">Highlighted in orange</p>
// <p [myHighlight]="color">Highlight me!</p>
// <p [myHighlight]="color" defaultColor="violet"</p>
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[myHighlight]"
})
export class SimpleHighLightDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('myHighlight') highlightColor: string;
  @Input() defaultColor: string;
  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = this.highlightColor || this.defaultColor || 'red';
  }
}

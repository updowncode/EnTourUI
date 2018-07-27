/* tslint:disable:member-ordering */
import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appHighlight]"
})
export class HighlightDirective {
  _el: any;
  constructor(el: ElementRef) {
    this._el = el;
    this.setColor("#d47027");
  }
  @HostListener("mouseenter")
  onMouseEnter() {
    this.highlight("yellow");
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.highlight(null);
  }
  private setColor(color: string) {
    this._el.nativeElement.style.backgroundColor = color;
  }
  private highlight(color: string) {
    this._el.nativeElement.style.backgroundColor = color;
  }
}

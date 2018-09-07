import { Directive, OnInit, OnDestroy } from "@angular/core";
// Spy on any element to which it is applied.
// Usage: <div appMySpy>...</div>
@Directive({ selector: "[appMySpy]" })
export class MySpyDirective implements OnInit, OnDestroy {
  nextId = 0;
  constructor() {}

  ngOnInit() {
    this.logIt(`onInit`);
  }

  ngOnDestroy() {
    this.logIt(`onDestroy`);
  }

  private logIt(msg: string) {
    console.log(`Spy #${this.nextId++} ${msg}`);
  }
}

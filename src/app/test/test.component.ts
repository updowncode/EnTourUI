import { Component, OnInit, Injector } from "@angular/core";
import { interval, Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { createCustomElement } from "@angular/elements";
import { PopupService } from "src/app/popup.service";
import { PopupComponent } from "src/app/popup/popup.component";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.sass"]
})
export class TestComponent implements OnInit {
  message$: Observable<string>;
  private messages = ["test1", "test2", "test3"];

  ngOnInit() {}

  constructor(injector: Injector, public popup: PopupService) {
    // Convert `PopupComponent` to a custom element.
    const PopupElement = createCustomElement(PopupComponent, { injector });
    // Register the custom element with the browser.
    customElements.define("popup-element", PopupElement);

    // this.resend();
  }

  resend() {
    this.message$ = interval(500).pipe(
      map(i => this.messages[i]),
      take(this.messages.length)
    );
  }
}

import { Component, OnInit } from "@angular/core";
import { interval, Observable } from "rxjs";
import { map, take } from "rxjs/operators";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.sass"]
})
export class TestComponent implements OnInit {
  message$: Observable<string>;
  private messages = [
    "test1",
    "test2",
    "test3"
  ];

  ngOnInit() {}

  constructor() {
    this.resend();
  }

  resend() {
    this.message$ = interval(500).pipe(
      map(i => this.messages[i]),
      take(this.messages.length)
    );
  }
}

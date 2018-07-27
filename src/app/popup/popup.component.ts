import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostBinding,
  HostListener
} from "@angular/core";
import { AnimationEvent } from "@angular/animations";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
@Component({
  selector: "app-my-popup",
  template: "Popup: {{message}}",
  animations: [
    // trigger('shrinkOut', [
    //   state('in', style({height: '*'})),
    //   transition('* => void', [
    //     style({height: '*'}),
    //     animate(250, style({height: 0}))
    //   ])
    // ])
    trigger("state", [
      state("opened", style({ transform: "translateY(0%)" })),
      state(
        "void, closed",
        style({ transform: "translateY(100%)", opacity: 0 })
      ),
      transition("* => *", animate("100ms ease-in"))
      //   transition('inactive => active', animate('100ms ease-in')),
      // transition('active => inactive', animate('100ms ease-out')),
      // transition('void => inactive', [
      //   style({transform: 'translateX(-100%) scale(1)'}),
      //   animate(100)
      // ]),
      // transition('inactive => void', [
      //   animate(100, style({transform: 'translateX(100%) scale(1)'}))
      // ]),
      // transition('void => active', [
      //   style({transform: 'translateX(0) scale(0)'}),
      //   animate(200)
      // ]),
      // transition('active => void', [
      //   animate(200, style({transform: 'translateX(0) scale(0)'}))
      // ])
      // transition('inactive => active', [
      //   style({
      //     backgroundColor: '#cfd8dc',
      //     transform: 'scale(1.3)'
      //   }),
      //   animate('80ms ease-in', style({
      //     backgroundColor: '#eee',
      //     transform: 'scale(1)'
      //   }))
      // ]),
    ])
  ],
  styles: [
    `
      :host {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #009cff;
        height: 48px;
        padding: 16px;
        display: flex;
        align-items: center;
        border-top: 1px solid black;
        font-size: 24px;
      }
    `
  ]
})
export class PopupComponent {
  _message: string;
  @Input()
  set message(message: string) {
    this._message = message;
    this.state = "opened";

    setTimeout(() => (this.state = "closed"), 2000);
  }
  get message(): string {
    return this._message;
  }
  @Output() closed = new EventEmitter();
  @HostBinding("attr.state") state = "closed";
  @HostListener("state")
  onAnimationDone(e: AnimationEvent) {
    if (e.toState === "closed") {
      this.closed.next();
    }
  }
}

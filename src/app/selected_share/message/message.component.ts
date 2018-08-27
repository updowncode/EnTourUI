/* tslint:disable */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { MessageService } from "../../message.service";
@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.sass"]
})
export class MessageComponent implements OnInit, OnDestroy {
  message: any;
  subscription: Subscription;
  constructor(private messageService: MessageService) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.message = message;
    });
  }
  clearMessage(): void {
    this.messageService.clearMessage();
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

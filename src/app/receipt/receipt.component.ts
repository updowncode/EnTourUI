import { Component, OnInit, OnDestroy, Pipe } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import { MessageService } from "../message.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-receipt",
  templateUrl: "./receipt.component.html",
  styleUrls: ["./receipt.component.sass"]
})
export class ReceiptComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  receipt: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.subscription = this.activatedRoute.queryParams.subscribe(params =>
      this.onParams(params)
    );
  }
  onParams(params: Params) {
    this.tourService.getReceipt(params.orderNumber, params.hashcode).then(resp => {
      // console.log(JSON.parse(resp));
      this.receipt = JSON.parse(resp).data;
    });
  }
}

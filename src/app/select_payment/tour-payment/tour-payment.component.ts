import { Component, OnInit, HostBinding, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { Subscription } from "rxjs";
import { slideInDownAnimation } from "../../app.animations";
import { MessageService } from "../../message.service";
import { Location } from "@angular/common";
import { FrontEndCallbackModel } from "../../Models/front-end-callback-model";
import { OrderDetail } from "../../Models/order-detail";
import { Trip } from "../../Models/trip";
@Component({
  selector: "app-tour-payment",
  templateUrl: "./tour-payment.component.html",
  styleUrls: ["./tour-payment.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourPaymentComponent implements OnInit, OnDestroy {
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  err: string;
  orderTrip: Trip;
  orderNumber: string;
  invoiceNumber: string;
  subscription: Subscription;
  orderDetailSubscription: Subscription;
  emailSubscription: Subscription;
  approved: boolean;
  emailHasBeenSent: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.orderDetailSubscription.unsubscribe();
    this.emailSubscription.unsubscribe();
  }
  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    //  http://localhost:4200/ENTOUR/PAYMENT?trnApproved=1&trnId=10100577&messageId=1&messageText=Approved&authCode=TEST&responseType=T&trnAmount=110.00&trnDate=9%2F14%2F2018%201:38:33%20PM&trnOrderNumber=123456&trnLanguage=eng&trnCustomerName=qinag&trnEmailAddress=asad@sdf.com&trnPhoneNumber=4169290888&avsProcessed=1&avsId=Y&avsResult=1&avsAddrMatch=1&avsPostalMatch=1&avsMessage=Street%20address%20and%20Postal%2FZIP%20match.&cvdId=1&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=47b4e59f59ffda947079048cf0ab7f47
    // tslint:disable-next-line:max-line-length
    // this.err = `http://localhost:4200/ENTOUR/payment?trnApproved=0&trnId=10100579&messageId=22&messageText=Validation%20greater%20than%20maximum%20amount&authCode=&responseType=T&trnAmount=1449.50&trnDate=9%2F21%2F2018%208:47:55%20AM&trnOrderNumber=30009682&trnLanguage=eng&trnCustomerName=qiang&trnEmailAddress=david.li@toureast.com&trnPhoneNumber=4169290888&avsProcessed=0&avsId=0&avsResult=0&avsAddrMatch=0&avsPostalMatch=0&avsMessage=Address%20Verification%20not%20performed%20for%20this%20transaction.&cvdId=5&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=005f91ebea978304d623d13824c84a5f`;
    // tslint:disable-next-line:max-line-length
    this.err = `http://localhost:4200/ENTOUR/PAYMENT?trnApproved=0&trnId=10100571&messageId=16&messageText=Duplicate+Transaction+-+This+transaction+has+already+been+approved&authCode=&responseType=T&trnAmount=10.00&trnDate=8%2F16%2F2018+10%3A59%3A04+AM&trnOrderNumber=30000001&trnLanguage=eng&trnCustomerName=w334&trnEmailAddress=david%2Eli%40toureast%2Ecom&trnPhoneNumber=4169290888&avsProcessed=0&avsId=0&avsResult=0&avsAddrMatch=0&avsPostalMatch=0&avsMessage=Address+Verification+not+performed+for+this+transaction%2E&cvdId=5&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=9452272872de21e7df64e80add128a32`;
    // tslint:disable-next-line:max-line-length
    this.err = `http://localhost:4200/ENTOUR/PAYMENT?trnApproved=1&trnId=10100574&messageId=1&messageText=Approved&authCode=TEST&responseType=T&trnAmount=10.00&trnDate=8%2F16%2F2018+11%3A56%3A13+AM&trnOrderNumber=30000001&trnLanguage=eng&trnCustomerName=klkl&trnEmailAddress=david%2Eli%40toureast%2Ecom&trnPhoneNumber=4169290888&avsProcessed=1&avsId=Y&avsResult=1&avsAddrMatch=1&avsPostalMatch=1&avsMessage=Street+address+and+Postal%2FZIP+match%2E&cvdId=1&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=503089bc9ca34f953c4a2b62b904b574`;
    this.emailHasBeenSent = false;
    this.subscription = this.activatedRoute.queryParams.subscribe(params =>
      this.onParams(params)
    );
  }
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(["/"]);
    }
  }
  onEmailResult(order: OrderDetail) {
    this.emailHasBeenSent = true;
  }
  onVerifyUrlResult(resp: any) {
    this.orderTrip = resp.data.trip;
    this.invoiceNumber = resp.data.invoiceNumber;
    if (resp.data.status === "success") {
      const req = new FrontEndCallbackModel();
      req.callbackurl = location.href;
      req.orderNumber = resp.data.orderNumber;
      this.emailSubscription = this.tourService
        .sendInvoiceEmailAsync(req)
        .subscribe((order1: OrderDetail) => this.onEmailResult(order1));
    } else {
      this.messageService.add(resp.data.message);
    }
  }
  onParams(params: Params) {
    this.approved = params.trnApproved === "1";
    if (!this.approved) {
      this.messageService.add(params.messageText);
    } else {
      this.orderNumber = params.trnOrderNumber;
      this.messageService.add(`Order Number: ${params.trnOrderNumber}`);
      const req = new FrontEndCallbackModel();
      req.callbackurl = location.href;
      req.orderNumber = this.orderNumber;
      this.orderDetailSubscription = this.tourService
        .verifyFrontEndCallBackUrlAsync(req)
        .subscribe(
          (resp: any) => this.onVerifyUrlResult(resp),
          err => console.log(err || err.data.message)
        );
    }
  }
}
// http://localhost:4200/ENTOUR/payment?trnApproved=1&trnId=10100587&messageId=1&messageText=Approved&authCode=TEST&responseType=T&trnAmount=58.00&trnDate=11%2F13%2F2018%207:36:54%20AM&trnOrderNumber=30009868&trnLanguage=eng&trnCustomerName=qing%20li&trnEmailAddress=david@dfsdd.com&trnPhoneNumber=4169290888&avsProcessed=1&avsId=Y&avsResult=1&avsAddrMatch=1&avsPostalMatch=1&avsMessage=Street%20address%20and%20Postal%2FZIP%20match.&cvdId=1&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=e385a9453a3de7945fc0468cb357d536

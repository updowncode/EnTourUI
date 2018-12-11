import { Component, OnInit, HostBinding, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { Subscription, Observable } from "rxjs";
import { slideInDownAnimation } from "../../app.animations";
import { MessageService } from "../../message.service";
import { Location } from "@angular/common";
import { FrontEndCallbackModel } from "../../Models/front-end-callback-model";
import { OrderDetail } from "../../Models/order-detail";
import { Trip } from "../../Models/trip";
import { ReviewInfo } from "../../Models/review-info";
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
  sendingEmail: boolean;
  sendEmailDone: boolean;
  retrievingInfo: boolean;
  reviewInfo: ReviewInfo;
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
    this.sendingEmail = false;
    this.sendEmailDone = false;
    this.retrievingInfo = false;
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
  onEmailResult(resp: any) {
    this.sendingEmail = false;

    if (resp.data.status === "success") {
      this.sendEmailDone = true;
      localStorage.setItem("EmailHasBeenSent", "true");
    } else {
      localStorage.removeItem("EmailHasBeenSent");
      this.messageService.add(resp.errorMsg);
    }
  }
  ResendEmail() {
    const req = new FrontEndCallbackModel();
    req.callbackurl = location.href;
    req.orderNumber = this.orderNumber;
    this.sendingEmail = true;
    this.sendEmailDone = false;
    if (this.invoiceNumber.length > 0) {
      this.emailSubscription = this.tourService
        .sendInvoiceEmailAsync(req)
        .subscribe(
          (result: any) => this.onEmailResult(result),
          err => {
            this.sendingEmail = false;
            this.tourService.openNgxModelDlg(
              `Network issue, please try again to retrieve your order`
            );
          }
        );
    } else {
      this.emailSubscription = this.tourService
        .sendEmailWithoutInvoiceAsync(req)
        .subscribe(
          (result: any) => this.onEmailResult(result),
          err => {
            this.sendingEmail = false;
            this.tourService.openNgxModelDlg(
              `Network issue, please try again to retrieve your order`
            );
          }
        );
    }
  }
  onVerifyUrlResult(resp: any) {
    this.retrievingInfo = false;

    if (resp.data === "fail") {
      this.tourService.openNgxModelDlg(resp.errorMsg, "Retrieve Order");
    } else {
      this.orderTrip = Object.assign({}, resp.data.trip);
      this.invoiceNumber = resp.data.invoiceNumber;
      this.messageService.clearMessage();
      this.messageService.add(`Order Number: ${this.orderNumber}`);
      if (this.invoiceNumber.length > 0) {
        this.messageService.add(`Invoice Number: ${this.invoiceNumber}`);
      }
      if (resp.data.status === "success") {
        const req = new FrontEndCallbackModel();
        req.callbackurl = location.href;
        req.orderNumber = resp.data.orderNumber;

        if (localStorage.getItem("EmailHasBeenSent") == null) {
          this.sendingEmail = true;
          this.sendEmailDone = false;
          this.emailSubscription = this.tourService
            .sendEmailWithoutInvoiceAsync(req)
            .subscribe(
              (result: any) => this.onEmailResult(result),
              err => {
                this.sendingEmail = false;
                console.log(err);
                this.tourService.openNgxModelDlg(
                  `Network issue, please try again to retrieve your order`
                );
              }
            );
        } else {
          this.sendingEmail = false;
          this.sendEmailDone = true;
        }
      }
      // else {
      //   const req = new FrontEndCallbackModel();
      //   req.callbackurl = location.href;
      //   req.orderNumber = resp.data.orderNumber;
      //   if (localStorage.getItem("EmailHasBeenSent") == null) {
      //     this.sendingEmail = true;
      //     this.sendEmailDone = false;
      //     this.emailSubscription = this.tourService
      //       .sendEmailWithoutInvoiceAsync(req)
      //       .subscribe(
      //         (result: any) => this.onEmailResult(result),
      //         err => {
      //           this.sendingEmail = false;
      //           console.log(err);
      //         }
      //       );
      //   } else {
      //     this.sendEmailDone = true;
      //   }
      //   this.tourService.openNgxModelDlg(resp.data.message, "Order");
      // }
    }
    // this.orderTrip = Object.assign({}, resp.data.trip);
    // this.invoiceNumber = resp.data.invoiceNumber;
    // if (resp.data.status === "success") {
    //   const req = new FrontEndCallbackModel();
    //   req.callbackurl = location.href;
    //   req.orderNumber = resp.data.orderNumber;

    //   if (localStorage.getItem("EmailHasBeenSent") == null) {
    //     this.sendingEmail = true;
    //     this.emailSubscription = this.tourService
    //       .sendInvoiceEmailAsync(req)
    //       .subscribe(
    //         (result: any) => this.onEmailResult(result),
    //         err => {
    //           this.sendingEmail = false;
    //           console.log(err);
    //         }
    //       );
    //   }
    // } else {
    //   this.messageService.add(resp.data.errorMsg);
    //   this.tourService.openNgxModelDlg(resp.data.errorMsg, "'trip notes1'");
    // }
  }
  onParams(params: Params) {
    this.approved = params.trnApproved === "1";
    if (!this.approved) {
      this.messageService.add(`Payment fail: ${params.messageText}`);
    } else {
      this.retrievingInfo = true;
      this.orderNumber = params.trnOrderNumber;
      this.messageService.add(`Order Number: ${params.trnOrderNumber}`);
      const req = new FrontEndCallbackModel();
      req.callbackurl = location.href;
      req.orderNumber = this.orderNumber;
      this.orderDetailSubscription = this.tourService
        .verifyFrontEndCallBackUrlAsync(req)
        .subscribe(
          (resp: any) => this.onVerifyUrlResult(resp),
          err => {
            this.retrievingInfo = false;
            // this.messageService.add(`Network issue, please try again to retrieve your order: ${err}`);
            this.tourService.openNgxModelDlg(
              `Network issue, please try again to retrieve your order`
            );
          }
        );
    }
  }
}
// http://localhost:4200/ENTOUR/payment?trnApproved=1&trnId=10100587&messageId=1&messageText=Approved&authCode=TEST&responseType=T&trnAmount=58.00&trnDate=11%2F13%2F2018%207:36:54%20AM&trnOrderNumber=30009868&trnLanguage=eng&trnCustomerName=qing%20li&trnEmailAddress=david@dfsdd.com&trnPhoneNumber=4169290888&avsProcessed=1&avsId=Y&avsResult=1&avsAddrMatch=1&avsPostalMatch=1&avsMessage=Street%20address%20and%20Postal%2FZIP%20match.&cvdId=1&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=e385a9453a3de7945fc0468cb357d536

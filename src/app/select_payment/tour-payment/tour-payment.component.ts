import {
  Component,
  OnInit,
  HostBinding,
  OnDestroy,
  Inject
} from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import {
  Subscription,
  Observable,
  fromEvent,
  interval,
  empty,
  merge,
  from,
  of
} from "rxjs";
import { fromPromise } from "rxjs/observable/fromPromise";
import { slideInDownAnimation } from "../../app.animations";
import { MessageService } from "../../message.service";
import { Location, APP_BASE_HREF } from "@angular/common";
import { FrontEndCallbackModel } from "../../Models/front-end-callback-model";
import { OrderDetail } from "../../Models/order-detail";
import { Trip } from "../../Models/trip";
import { ReviewInfo } from "../../Models/review-info";
import {
  map,
  mapTo,
  startWith,
  switchMap,
  scan,
  takeWhile,
  mergeMap,
  catchError,
  withLatestFrom
} from "rxjs/operators";
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
  totalRoomPriceIncludeChild: number;
  totalVisaPrice: number;
  totalOptionPrice: number;
  extraHotelAmount: number;
  totalPaidAmount: number;
  hasOption: boolean;
  hashcode: string;
  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
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
    window.scrollTo(0, 0);
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

    if (resp.data.status === "Processed") {
      this.sendEmailDone = true;
      localStorage.setItem("EmailHasBeenSent", "true");
    } else {
      localStorage.removeItem("EmailHasBeenSent");
      this.messageService.add(resp.errorMsg);
    }
  }
  countdown() {
    const canbeclicked = document.querySelector("#id");
    const clickStream = fromEvent(canbeclicked, "click");

    const countdownSeconds = 10;
    const setHTML = id => val => (document.getElementById(id).innerHTML = val);
    const pauseButton = document.getElementById("pause");
    const resumeButton = document.getElementById("resume");
    const interval$ = interval(1000).pipe(mapTo(-1));

    const pause$ = fromEvent(pauseButton, "click").pipe(mapTo(false));
    const resume$ = fromEvent(resumeButton, "click").pipe(mapTo(true));
    const timer$ = merge(pause$, resume$)
      .pipe(
        startWith(true),
        // 如果定时器暂停，则返回空的 Observable
        switchMap(val => (val ? interval$ : empty())),
        scan((acc, curr) => (curr ? curr + acc : acc), countdownSeconds),

        takeWhile(v => v >= 0)
      )
      .subscribe(setHTML("remaining"));

    const promiseSource = from(new Promise(resolve => resolve("Hello World!")));

    const myPromise = willReject => {
      return new Promise((resolve, reject) => {
        if (willReject) {
          reject("Rejected!");
        }
        resolve("Resolved!");
      });
    };
    // 先发出 true，然后是 false
    const source = of(true, false);
    const example = source.pipe(
      mergeMap(val =>
        fromPromise(myPromise(val)).pipe(
          // 捕获并优雅地处理 reject 的结果
          catchError(error => of(`Error: ${error}`))
        )
      )
    );
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
      this.hasOption = this.orderTrip.rooms.some(c =>
        c.travellers.some(
          d => d.selectedOptions != null && d.selectedOptions.length > 0
        )
      );
      this.totalRoomPriceIncludeChild = resp.data.totalRoomPriceIncludeChild;
      this.totalOptionPrice = resp.data.totalOptionPrice;
      this.totalVisaPrice = resp.data.totalVisaPrice;
      this.extraHotelAmount = resp.data.extraHotelAmount;
      this.totalPaidAmount = resp.data.trip.paidAmounts.reduce(
        (a: number, b: number) => a + b,
        0
      );
      // this.messageService.clearMessage();
      // this.messageService.add(`Order Number: ${this.orderNumber}`);
      // if (this.invoiceNumber.length > 0) {
      //   this.messageService.add(`Invoice Number: ${this.invoiceNumber}`);
      // }
      if (resp.data.status === "Processed") {
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
      this.tourService
        .gethashcode(this.orderNumber)
        .then(v => (this.hashcode = v.data));
      // this.messageService.add(`Order Number: ${params.trnOrderNumber}`);
      const req = new FrontEndCallbackModel();
      req.callbackurl = location.href;
      req.orderNumber = this.orderNumber;
      this.orderDetailSubscription = this.tourService
        .verifyFrontEndCallBackUrlAsync(req)
        .subscribe({
          next: (resp: any) => this.onVerifyUrlResult(resp),
          complete: () => console.log("Complete!"),
          error: err => {
            this.retrievingInfo = false;
            // this.messageService.add(`Network issue, please try again to retrieve your order: ${err}`);
            this.tourService.openNgxModelDlg(
              `Network issue, please try again to retrieve your order`
            );
          }
        });
    }
  }
}
// http://localhost:4200/ENTOUR/payment?trnApproved=1&trnId=10100587&messageId=1&messageText=Approved&authCode=TEST&responseType=T&trnAmount=58.00&trnDate=11%2F13%2F2018%207:36:54%20AM&trnOrderNumber=30009868&trnLanguage=eng&trnCustomerName=qing%20li&trnEmailAddress=david@dfsdd.com&trnPhoneNumber=4169290888&avsProcessed=1&avsId=Y&avsResult=1&avsAddrMatch=1&avsPostalMatch=1&avsMessage=Street%20address%20and%20Postal%2FZIP%20match.&cvdId=1&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=e385a9453a3de7945fc0468cb357d536

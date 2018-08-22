import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EnTourService } from '../en-tour.service';
import { Subscription } from 'rxjs';
import { slideInDownAnimation } from "../animations";
@Component({
  selector: 'app-tour-payment',
  templateUrl: './tour-payment.component.html',
  styleUrls: ['./tour-payment.component.sass'],
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
  messageText: string;
  subscription: Subscription;
  trnApproved: string;
  constructor(private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router) { }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  ngOnInit() {
     // tslint:disable-next-line:max-line-length
    this.err = `http://localhost:4200/entourdetail/PAYMENT?trnApproved=0&trnId=10100571&messageId=16&messageText=Duplicate+Transaction+-+This+transaction+has+already+been+approved&authCode=&responseType=T&trnAmount=10.00&trnDate=8%2F16%2F2018+10%3A59%3A04+AM&trnOrderNumber=30000001&trnLanguage=eng&trnCustomerName=w334&trnEmailAddress=david%2Eli%40toureast%2Ecom&trnPhoneNumber=4169290888&avsProcessed=0&avsId=0&avsResult=0&avsAddrMatch=0&avsPostalMatch=0&avsMessage=Address+Verification+not+performed+for+this+transaction%2E&cvdId=5&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=9452272872de21e7df64e80add128a32`;
    // tslint:disable-next-line:max-line-length
    this.err = `http://localhost:4200/entourdetail/PAYMENT?trnApproved=1&trnId=10100574&messageId=1&messageText=Approved&authCode=TEST&responseType=T&trnAmount=10.00&trnDate=8%2F16%2F2018+11%3A56%3A13+AM&trnOrderNumber=30000001&trnLanguage=eng&trnCustomerName=klkl&trnEmailAddress=david%2Eli%40toureast%2Ecom&trnPhoneNumber=4169290888&avsProcessed=1&avsId=Y&avsResult=1&avsAddrMatch=1&avsPostalMatch=1&avsMessage=Street+address+and+Postal%2FZIP+match%2E&cvdId=1&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=503089bc9ca34f953c4a2b62b904b574`;
    this.subscription = this.activatedRoute.queryParams.subscribe(
      params => this.onParams(params));
  }
  onParams(params: Params) {
    this.trnApproved = params.trnapproved;
    this.messageText = params.messagetext;
  }
}

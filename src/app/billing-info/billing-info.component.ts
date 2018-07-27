import { Component, OnInit, Input } from '@angular/core';
import { BillingInfo } from '../Models/billing-info';

@Component({
  selector: 'app-billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.sass']
})
export class BillingInfoComponent implements OnInit {
  @Input() billingInfo: BillingInfo;
  constructor() { }

  ngOnInit() {
  }

}

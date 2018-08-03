import { Component, OnInit, Input } from '@angular/core';
import { BillingInfo } from '../Models/billing-info';
import { CountryOrArea } from '../Models/countryorarea';

@Component({
  selector: 'app-billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.sass']
})
export class BillingInfoComponent implements OnInit {
  @Input() billingInfo: BillingInfo;
  availabledCountryOrAreas: CountryOrArea[] = [
    { id: 1, name: "Canada", code: "CA" },
    { id: 2, name: "Unite States", code: "US" },
    { id: 3, name: "China", code: "CN" }
  ];
  constructor() { }

  ngOnInit() {
  }

}

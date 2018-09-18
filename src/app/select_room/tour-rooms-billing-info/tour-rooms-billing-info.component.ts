import { Component, OnInit, Input } from "@angular/core";
import { CountryOrArea } from "../../Models/countryorarea";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { NgForm, FormGroup } from "@angular/forms";

@Component({
  selector: "app-tour-rooms-billing-info",
  templateUrl: "./tour-rooms-billing-info.component.html",
  styleUrls: ["./tour-rooms-billing-info.component.sass"]
})
export class TourRoomsBillingInfoComponent implements OnInit {
  @Input()
  trip: Trip;
  @Input()
  tour: Tour;

  constructor() {}

  ngOnInit() {
    this.tour.availabledCountryOrAreas = [
      { id: -1, code: "", name: "" },
      ...this.tour.availabledCountryOrAreas
    ];
    this.trip.billingInfo.country = this.tour.availabledCountryOrAreas[0];

    this.initData();
  }
  compareFn(c1: CountryOrArea, c2: CountryOrArea): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  initData() {
    this.trip.billingInfo.firstName = "David";
    this.trip.billingInfo.lastName = "Li";
    this.trip.billingInfo.email = "david.li@toureast.com";
    this.trip.billingInfo.primaryPhone = "4169290888";
    this.trip.billingInfo.secondaryPhone = "123456789";
    this.trip.billingInfo.mailingAddress = "15 kern rd";
    this.trip.billingInfo.city = "Toronto";

    this.trip.billingInfo.country = new CountryOrArea();
    this.trip.billingInfo.country.id = 4;
    this.trip.billingInfo.country.name = "Canada";
    this.trip.billingInfo.country.code = "CA";

    this.trip.billingInfo.provinceStates = "Ontario";
    this.trip.billingInfo.postalCode = "1d1 4g4";
  }
}

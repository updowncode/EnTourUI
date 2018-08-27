import { Component, OnInit, Input } from "@angular/core";
import { CountryOrArea } from "../../Models/countryorarea";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";

@Component({  selector: 'app-tour-rooms-billing-info',
templateUrl: './tour-rooms-billing-info.component.html',
styleUrls: ['./tour-rooms-billing-info.component.sass']
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
  }
}

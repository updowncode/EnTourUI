import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { Traveller } from "../Models/traveller";
import { CountryOrArea } from "../Models/countryorarea";
import { Trip } from "../Models/trip";
import { Tour } from "../Models/tour";
import { slideInDownAnimation } from "../animations";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";

@Component({
  selector: "app-detail-for-traveller",
  templateUrl: "./detail-for-traveller.component.html",
  styleUrls: ["./detail-for-traveller.component.sass"],
  animations: [slideInDownAnimation]
})
export class DetailForTravellerComponent implements OnInit {
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  trip: Trip;
  tour: Tour;
  tourId: string;
  tripId: string;
  msg = "Loading options ...";
  availabledTitles: string[];
  @Input()
  traveller: Traveller;
  @Input()
  index: number;
  @Input()
  availabledCountryOrAreas: CountryOrArea[];
  @Input()
  availabledTitle: string[];
  constructor() {}

  ngOnInit() {}
}

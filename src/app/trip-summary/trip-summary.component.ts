import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";

@Component({
  selector: "app-trip-summary",
  templateUrl: "./trip-summary.component.html",
  styleUrls: ["./trip-summary.component.sass"]
})
export class TripSummaryComponent implements OnInit {
  tour: Tour;
  trip: Trip;
  tourId: number;
  tripId: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
  ) {}

  ngOnInit() {
    this.tourId = +this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = +this.activatedRoute.snapshot.queryParamMap.get("tripId");
    this.tour = this.tourService.getToursMockDataById(this.tourId);
    this.trip = this.tourService.retrieveTrip();
    if (this.trip === undefined) {
      if (localStorage.getItem(this.tripId.toString()) != null) {
        this.trip = JSON.parse(localStorage.getItem(this.tripId.toString()));
      }
    }
  }
}

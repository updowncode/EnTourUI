import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { Subscription } from "rxjs";

@Component({
  selector: "app-trip-summary",
  templateUrl: "./trip-summary.component.html",
  styleUrls: ["./trip-summary.component.sass"]
})
export class TripSummaryComponent implements OnInit, OnDestroy {
  tour: Tour;
  trip: Trip;
  tourId: number;
  tripId: number;
  totalPrice = 0;
  totalRoomPrice = 0;
  totalOptionPrice = 0;
  totalVisaPrice = 0;
  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService
  ) {
    this.subscription = tourService.updateRoomInfo$.subscribe(
      isRoomInfoUpdated => {
        if (isRoomInfoUpdated) {
          this.totalPrice = this.getTotalPrice();
        }
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
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
    this.totalPrice = this.getTotalPrice();
  }
  getTotalPrice(): number {
    this.totalPrice = 0;
    this.totalRoomPrice = 0;
    this.totalOptionPrice = 0;
    this.totalVisaPrice = 0;
    if (this.trip !== undefined) {
      for (let i = 0; i < this.trip.rooms.length; i++) {
        this.totalRoomPrice +=
          this.trip.rooms[i].roomPrice * this.trip.rooms[i].travellers.length;
      }
      for (let i = 0; i < this.trip.rooms.length; i++) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          if (this.trip.rooms[i].travellers[j].selectedOptions !== null) {
            for (
              let k = 0;
              k < this.trip.rooms[i].travellers[j].selectedOptions.length - 1;
              k++
            ) {
              this.totalOptionPrice += this.trip.rooms[i].travellers[
                j
              ].selectedOptions[k].price;
            }
          }
          if (this.trip.rooms[i].travellers[j].needVisa) {
            this.totalVisaPrice += this.trip.visaPrice;
          }
        }
      }
    }
    this.totalPrice =
      this.totalRoomPrice + this.totalOptionPrice + this.totalVisaPrice;
    return this.totalPrice;
  }
}

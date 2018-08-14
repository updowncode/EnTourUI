import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { Subscription, BehaviorSubject, of } from "rxjs";

@Component({
  selector: "app-trip-summary",
  templateUrl: "./trip-summary.component.html",
  styleUrls: ["./trip-summary.component.sass"]
})
export class TripSummaryComponent implements OnInit, OnDestroy {
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  totalPrice = 0;
  totalRoomPrice = 0;
  totalOptionPrice = 0;
  totalVisaPrice = 0;
  subscription: Subscription;
  totalPriceSubscription: Subscription;
  private eventTotalPrice = new BehaviorSubject<Boolean>(false);
  eventTotalPrice$ = this.eventTotalPrice.asObservable();

  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService
  ) {
    this.tourService.tour$.subscribe(tour => {
      this.tour = tour;
    });
    this.tourService.trip$.subscribe(trip => {
      this.trip = trip;
    });
    this.subscription = tourService.updateRoomInfo$.subscribe(
      isRoomInfoUpdated => {
        if (isRoomInfoUpdated) {
          this.totalPrice = this.getTotalPrice();
        }
      }
    );
    this.totalPriceSubscription = this.eventTotalPrice$.subscribe(
      isReadyToCalculateTotalPrice => {
        if (isReadyToCalculateTotalPrice) {
          this.totalPrice = this.getTotalPrice();
        }
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.totalPriceSubscription.unsubscribe();
  }
  ngOnInit() { }
  getTotalPrice(): number {
    this.totalPrice = 0;
    this.totalRoomPrice = 0;
    this.totalOptionPrice = 0;
    this.totalVisaPrice = 0;
    if (this.trip !== undefined) {
      for (let i = 0; i < this.trip.rooms.length; i++) {
        this.totalRoomPrice +=
          this.trip.rooms[i].roomPriceForPerTraveller *
          this.trip.rooms[i].travellers.length;
      }
      for (let i = 0; i < this.trip.rooms.length; i++) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          if (this.trip.rooms[i].travellers[j].selectedOptions !== null) {
            for (
              let k = 0;
              k < this.trip.rooms[i].travellers[j].selectedOptions.length;
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

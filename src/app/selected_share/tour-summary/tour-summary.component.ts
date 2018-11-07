import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { Subscription, BehaviorSubject, of } from "rxjs";

@Component({
  selector: "app-tour-summary",
  templateUrl: "./tour-summary.component.html",
  styleUrls: ["./tour-summary.component.sass"]
})
export class TourSummaryComponent implements OnInit, OnDestroy {
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  totalPrice = 0;
  totalRoomPrice = 0;
  totalOptionPrice = 0;
  totalVisaPrice = 0;
  totalChildDiscount = 0;
  totalChildPromo = 0;
  roomInfoSubscription: Subscription;
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
    this.roomInfoSubscription = tourService.updateRoomInfo$.subscribe(
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
    this.roomInfoSubscription.unsubscribe();
    this.totalPriceSubscription.unsubscribe();
  }
  ngOnInit() {}
  getTotalPrice(): number {
    this.totalPrice = 0;
    this.totalRoomPrice = 0;
    this.totalOptionPrice = 0;
    this.totalVisaPrice = 0;
    this.totalChildDiscount = 0;
    this.totalChildPromo = 0;
    if (this.trip !== undefined) {
      for (let i = 0; i < this.trip.rooms.length; i++) {
        this.totalRoomPrice +=
          this.trip.rooms[i].roomPriceForPerTraveller *
          this.trip.rooms[i].travellers.length;
      }
      for (let i = 0; i < this.trip.rooms.length; i++) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          if (this.trip.rooms[i].travellers[j].isChild) {
            this.totalChildDiscount += this.trip.rooms[i].childDiscount;
            this.totalChildPromo += this.trip.rooms[i].childPromoAmount;
          }
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
    let childTotalPromo = 0;
    if (this.totalChildPromo === 0 && this.totalChildDiscount > 0) {
      childTotalPromo = this.totalChildDiscount;
    } else {
      childTotalPromo = this.totalChildPromo;
    }
    this.totalPrice =
      this.totalRoomPrice +
      this.totalOptionPrice +
      this.totalVisaPrice -
      childTotalPromo;
    return this.totalPrice;
  }
}

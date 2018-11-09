import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { Subscription, BehaviorSubject, of } from "rxjs";
import { ReviewInfo } from "../../Models/review-info";

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
  reviewInfo: ReviewInfo;
  // totalPrice = 0;
  // totalRoomPrice = 0;
  // totalOptionPrice = 0;
  // totalVisaPrice = 0;
  // totalChildDiscount = 0;
  // totalChildPromo = 0;
  // extraHotelAmount = 0;
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
          this.reviewInfo = this.tourService.getTotalPrice();
        }
      }
    );
    this.totalPriceSubscription = this.eventTotalPrice$.subscribe(
      isReadyToCalculateTotalPrice => {
        if (isReadyToCalculateTotalPrice) {
          // this.totalPrice = this.getTotalPrice();
          this.reviewInfo = this.tourService.getTotalPrice();
        }
      }
    );
  }
  ngOnDestroy() {
    this.roomInfoSubscription.unsubscribe();
    this.totalPriceSubscription.unsubscribe();
  }
  ngOnInit() {}
  // getTotalPrice(): number {
    // const reviewInfo = this.tourService.getTotalPrice();
    // this.totalPrice = reviewInfo.totalPrice;
    // this.totalRoomPrice = reviewInfo.totalRoomPrice;
    // this.totalOptionPrice = reviewInfo.totalOptionPrice;
    // this.totalVisaPrice = reviewInfo.totalVisaPrice;
    // this.totalChildDiscount = reviewInfo.totalChildDiscount;
    // this.totalChildPromo = reviewInfo.totalChildPromo;
    // this.extraHotelAmount = reviewInfo.extraHotelAmount;
    // return this.totalPrice;
    // this.totalPrice = 0;
    // this.totalRoomPrice = 0;
    // this.totalOptionPrice = 0;
    // this.totalVisaPrice = 0;
    // this.totalChildDiscount = 0;
    // this.totalChildPromo = 0;
    // this.extraHotelAmount = 0;
    // if (this.trip !== undefined) {
    //   for (let i = 0; i < this.trip.rooms.length; i++) {
    //     this.totalRoomPrice +=
    //       this.trip.rooms[i].roomPriceForPerTraveller *
    //       this.trip.rooms[i].travellers.length;
    //   }
    //   for (let i = 0; i < this.trip.rooms.length; i++) {
    //     for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
    //       if (this.trip.rooms[i].travellers[j].isChild) {
    //         this.totalChildDiscount += this.trip.rooms[i].childDiscount;
    //         this.totalChildPromo += this.trip.rooms[i].childPromoAmount;
    //       }
    //       if (this.trip.rooms[i].travellers[j].selectedOptions !== null) {
    //         for (
    //           let k = 0;
    //           k < this.trip.rooms[i].travellers[j].selectedOptions.length;
    //           k++
    //         ) {
    //           this.totalOptionPrice += this.trip.rooms[i].travellers[
    //             j
    //           ].selectedOptions[k].price;
    //         }
    //       }
    //       if (this.trip.rooms[i].travellers[j].needVisa) {
    //         this.totalVisaPrice += this.trip.visaPrice;
    //       }
    //     }
    //   }
    // }
    // let childTotalPromo = 0;
    // if (this.totalChildPromo === 0 && this.totalChildDiscount > 0) {
    //   childTotalPromo = this.totalChildDiscount;
    // } else {
    //   childTotalPromo = this.totalChildPromo;
    // }
    // this.totalPrice =
    //   this.totalRoomPrice +
    //   this.totalOptionPrice +
    //   this.totalVisaPrice -
    //   childTotalPromo;

    // for (let i = 0; i < this.trip.rooms.length; i++) {
    //   if (this.trip.rooms[i].extraHotelQuantity > 0) {
    //     let _childDiscount = 0;
    //     let _childPromo = 0;
    //     for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
    //       if (this.trip.rooms[i].travellers[j].isChild) {
    //         _childDiscount += this.trip.rooms[i].childDiscount;
    //         _childPromo += this.trip.rooms[i].childPromoAmount;
    //       }
    //     }
    //     let _childTotalPromoForRoom = 0;
    //     if (_childPromo === 0 && _childDiscount > 0) {
    //       _childTotalPromoForRoom = _childDiscount;
    //     } else {
    //       _childTotalPromoForRoom = _childPromo;
    //     }

    //     this.extraHotelAmount +=
    //       (this.trip.rooms[i].roomPriceForPerTraveller *
    //         this.trip.rooms[i].travellers.length -
    //       _childTotalPromoForRoom) * this.trip.rooms[i].extraHotelQuantity;
    //     this.totalPrice += this.extraHotelAmount;
    //   }
    // }
    // return this.totalPrice;
  // }
}

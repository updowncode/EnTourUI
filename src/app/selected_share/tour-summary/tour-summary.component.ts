import { Component, OnInit, Input, OnDestroy, AfterViewChecked, AfterContentChecked } from "@angular/core";
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
export class TourSummaryComponent implements OnInit, AfterContentChecked, OnDestroy {
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  reviewInfo: ReviewInfo;
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
          this.reviewInfo = this.tourService.getTotalPrice();
        }
      }
    );
  }
  ngAfterContentChecked(): void {
    if (this.trip && this.trip.rooms !== null && this.trip.rooms.some(c => c.travellers.length === 1)) {
      this.reviewInfo.showSingleSupplment = true;
    } else {
      this.reviewInfo.showSingleSupplment = false;
    }
  }

  ngOnDestroy() {
    this.roomInfoSubscription.unsubscribe();
    this.totalPriceSubscription.unsubscribe();
  }
  ngOnInit() { this.reviewInfo = this.tourService.getTotalPrice(); }
}

import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewChecked,
  AfterContentChecked
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { Subscription, BehaviorSubject, of } from "rxjs";
import { ReviewInfo } from "../../Models/review-info";
import { Promotion } from "src/app/Models/promotion";
export interface RoomSpacePrice {
  cap: number;
  price: number;
}
@Component({
  selector: "app-tour-summary",
  templateUrl: "./tour-summary.component.html",
  styleUrls: ["./tour-summary.component.sass"]
})
export class TourSummaryComponent
  implements OnInit, AfterContentChecked, OnDestroy {
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  applyPromoCodeMsg: string;
  roomOriginalPriceForPerTravellerHtml: string;
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
    if (
      this.trip &&
      this.trip.rooms !== null &&
      this.trip.rooms.some(c => c.travellers.length === 1)
    ) {
      this.reviewInfo.showSingleSupplment = true;
    } else {
      this.reviewInfo.showSingleSupplment = false;
    }




    this.roomOriginalPriceForPerTravellerHtml =
      "<div>$" +
      this.trip.tripCostForDefaultPerTraveller.toString() +
      " Per Person</div>";
    if (
      this.trip.rooms.some(
        c =>
          c.roomOriginalPriceForPerTraveller !==
          this.trip.tripCostForDefaultPerTraveller
      )
    ) {
      this.roomOriginalPriceForPerTravellerHtml = "";
      // distinct
      const cp = Array.from(
        new Set(
          this.trip.rooms.map(
            (item: any) =>
              "<div>$" +
              item.roomOriginalPriceForPerTraveller.toString() +
              " Per Person" +
              this.getRoomCapacityName(item.capacity) +
              "</div>"
            //   <RoomSpacePrice> { cap: item.capacity, price : item.roomOriginalPriceForPerTraveller}
          )
        )
      );
      if (cp.length > 1) {
        cp.forEach(c => {
          this.roomOriginalPriceForPerTravellerHtml += c.toString();
        });
      } else {
        this.roomOriginalPriceForPerTravellerHtml = "";
        // distinct
        Array.from(
          new Set(
            this.trip.rooms.map(
              (item: any) => item.roomOriginalPriceForPerTraveller
            )
          )
        ).forEach(c => {
          this.roomOriginalPriceForPerTravellerHtml +=
            "<div>$" + c.toString() + " Per Person"  + "</div>";
        });
      }

    }
  }
  getRoomCapacityName(capacity: number) {
    let cpname = capacity.toString() + "Bed Room";
    switch (capacity) {
      case 1:
        {
          cpname = " in Single Room";
        }
        break;
      case 2:
        {
          cpname = " in Double Room";
        }
        break;
      case 3:
        {
          cpname = " in Triple Room";
        }
        break;
      case 4:
        {
          cpname = " in Quarter Room";
        }
        break;
      default:
        {
          cpname = capacity.toString() + " room";
        }
        break;
    }
    return cpname;
  }
  ngOnDestroy() {
    this.roomInfoSubscription.unsubscribe();
    this.totalPriceSubscription.unsubscribe();
  }
  ngOnInit() {
    this.reviewInfo = this.tourService.getTotalPrice();
    this.applyPromoCodeMsg = "";
  }
  ApplyPromoCode() {
    this.applyPromoCodeMsg = "";
    if (this.reviewInfo.PromoCodeEntered.trim() !== "") {
      const promoList = this.trip.rooms.reduce(
        (c, d) => [...c, ...d.promotionList],
        new Array<Promotion>()
      );
      this.trip.rooms.forEach(room => {
        room.selectedPromotion = null;
      });
      if (
        promoList.some(
          c =>
            c.code.trim().toUpperCase() ===
            this.reviewInfo.PromoCodeEntered.trim().toUpperCase()
        )
      ) {
        this.trip.rooms.forEach(room => {
          room.promotionList.forEach(promo => {
            if (
              promo.code.trim().toUpperCase() ===
              this.reviewInfo.PromoCodeEntered.trim().toUpperCase()
            ) {
              room.selectedPromotion = promo;
            }
          });
        });
        this.applyPromoCodeMsg = "";
      } else {
        this.applyPromoCodeMsg = "Invalid Promo Code!";
      }
    } else {
      this.trip.rooms.forEach(room => (room.selectedPromotion = null));
    }
    this.reviewInfo = this.tourService.getTotalPrice();
  }
}

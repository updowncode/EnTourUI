import { Component, OnInit, HostBinding, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { Traveller } from "../../Models/traveller";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { slideInDownAnimation } from "../../app.animations";
import { Subscription } from "rxjs";
import * as $ from "jquery";
export class OptionSummary {
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
}

@Component({
  selector: "app-tour-review-payment",
  templateUrl: "./tour-review-payment.component.html",
  styleUrls: ["./tour-review-payment.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourReviewPaymentComponent implements OnInit, OnDestroy {
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  travellers: Traveller[] = [];
  optionSummary: OptionSummary[] = [];
  msg = "Loading Review  ...";
  ToursSubscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router
  ) {}

  totalPrice = 0;
  totalRoomPrice = 0;
  totalOptionPrice = 0;
  perVisaPrice = 0;
  totalVisaQuantity = 0;
  totalVisaPrice = 0;
  tourInfoSources: string[] = ["", "Toronto Star", "Tour East Website"];
  ngOnDestroy() {
    this.ToursSubscription.unsubscribe();
  }
  ngOnInit() {
    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = this.activatedRoute.snapshot.queryParamMap.get("tripId");
    this.ToursSubscription = this.tourService.getTourById(this.tourId).subscribe(t => {
      const roomsLength = this.onResult(t);
      if (roomsLength === 0) {
        this.router.navigate(["/options"], {
          queryParams: { tourId: this.tourId, tripId: this.tripId }
        });
      } else {
        this.tourService.updateSelectedTour(this.tour);
        this.tourService.updateSelectedTrip(this.trip);
        this.initTrip();
      }
    });
  }
  onResult(tour: Tour): number {
    this.msg = "";
    this.tour = tour;
    this.trip = this.tour.trips.find(t => t.id === this.tripId);
    if (this.trip.rooms.length === 0) {
      if (localStorage.getItem(this.tripId.toString()) != null) {
        const _trip = JSON.parse(localStorage.getItem(this.tripId.toString()));
        this.trip = Object.assign({}, _trip);
        this.travellers = Object.assign(
          [],
          this.tourService.setupTravellers(this.trip.rooms)
        );
        return this.trip.rooms.length;
      } else {
        return 0;
      }
    } else {
      this.travellers = Object.assign(
        [],
        this.tourService.setupTravellers(this.trip.rooms)
      );
      return this.trip.rooms.length;
    }
  }
  initTrip() {
    this.optionSummary = new Array<OptionSummary>();
    for (let i = 0; i < this.travellers.length; i++) {
      if (
        this.travellers[i].selectedOptions != null &&
        this.travellers[i].selectedOptions.length > 0
      ) {
        for (let j = 0; j < this.travellers[i].selectedOptions.length; j++) {
          const optionInSummary = this.optionSummary.find(
            c => c.name === this.travellers[i].selectedOptions[j].name
          );
          if (null == optionInSummary) {
            const os = new OptionSummary();
            os.name = this.travellers[i].selectedOptions[j].name;
            os.price = this.travellers[i].selectedOptions[j].price;
            os.quantity = 1;
            os.subTotal = os.price * os.quantity;
            this.optionSummary.push(os);
          } else {
            optionInSummary.quantity++;
            optionInSummary.subTotal =
              optionInSummary.price * optionInSummary.quantity;
          }
        }
      }
    }

    this.totalPrice = this.getTotalPrice();
  }
  getTotalPrice(): number {
    if (this.trip !== undefined) {
      this.perVisaPrice = this.trip.visaPrice;
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
            this.totalVisaQuantity++;
            this.totalVisaPrice += this.trip.visaPrice;
          }
        }
      }
    }
    this.totalPrice =
      this.totalRoomPrice + this.totalOptionPrice + this.totalVisaPrice;
    return this.totalPrice;
  }

  gotoPayment() {
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.updateSelectedTour(this.tour);
    this.tourService.updateSelectedTrip(this.trip);
    this.tourService.payment(this.trip).then( resp => {
      const bookHtml = JSON.parse(resp._body).data.m_StringValue;
      $("#ReturnForm").html(bookHtml);
      $("#pay_form").submit();
    });
  }
}

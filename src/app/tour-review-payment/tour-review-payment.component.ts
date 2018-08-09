import { Component, OnInit, HostBinding } from "@angular/core";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { Traveller } from "../Models/traveller";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import { Room } from "../Models/room";
import { MockTourInfoSource } from "../Models/mock-tour-info-source";
import { slideInDownAnimation } from "../animations";
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
export class TourReviewPaymentComponent implements OnInit {
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "related";
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  travellers: Traveller[] = [];
  optionSummary: OptionSummary[] = [];
  msg = "Loading Review  ...";
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
  tourInfoSources: string[];
  ngOnInit() {
    this.msg = "";
    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = this.activatedRoute.snapshot.queryParamMap.get("tripId");
    this.tour = this.tourService.getToursMockDataById(this.tourId);
    this.trip = this.tourService.retrieveTrip();
    if (this.trip === undefined) {
      if (localStorage.getItem(this.tripId.toString()) != null) {
        this.trip = JSON.parse(localStorage.getItem(this.tripId.toString()));
      } else {
        this.router.navigate(["/tours"]);
      }
    }
    this.initTrip();
    this.trip.tourInfoSource = "";
    this.tourInfoSources = MockTourInfoSource;
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.saveTrip(this.trip);
  }
  initTrip() {
    this.trip.rooms.forEach((c: Room) => {
      if (c.travellers != null) {
        c.travellers.forEach(d => {
          this.travellers.push(d);
        });
      }
    });
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
          this.trip.rooms[i].roomPrice * this.trip.rooms[i].travellers.length;
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
    this.tourService.saveTrip(this.trip);

    this.router.navigate(["/travellerdetails"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
}

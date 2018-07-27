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
  tourId: number;
  tripId: number;
  travellers: Traveller[] = [];
  optionSummary: OptionSummary[] = [];
  msg = "Loading Review  ...";
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router
  ) {}
  optionTotal: number;
  totalPrice: number;
  tourInfoSources: string[];
  ngOnInit() {
    this.msg = "";
    this.tourId = +this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = +this.activatedRoute.snapshot.queryParamMap.get("tripId");
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
    this.optionTotal = 0;
    for (let i = 0; i < this.optionSummary.length; i++) {
      this.optionTotal += this.optionSummary[i].subTotal;
    }
    this.totalPrice =
      this.trip.tripCostForPerTraveller *
        this.trip.selectedTravellerQuantity.id +
      this.optionTotal;
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

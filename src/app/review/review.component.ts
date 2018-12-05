import { Component, OnInit, Input } from "@angular/core";
import { Trip } from "../Models/trip";
import { EnTourService } from "../en-tour.service";
import { ReviewInfo } from "../Models/review-info";

@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.sass"]
})
export class ReviewComponent implements OnInit {
  @Input()
  trip: Trip;
  reviewInfo: ReviewInfo;
  isDeposit: boolean;
  own: number;
  constructor(private tourService: EnTourService) {}

  ngOnInit() {
    this.tourService.setTripForReview(this.trip);
    this.reviewInfo = this.tourService.getTotalPrice();
    this.trip.totalPriceForPayment = this.reviewInfo.totalPrice;
    if (this.trip.paidAmounts) {
      this.own =
        (1 + this.trip.paymentTypeSurcharges) * this.trip.totalPriceForPayment -
        this.trip.paidAmounts.reduce((a, b) => a + b, 0);
      this.isDeposit = this.own > 0;
    }
  }
}

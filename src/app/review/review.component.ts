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
  constructor(private tourService: EnTourService) {}

  ngOnInit() {
    this.tourService.setTripForReview(this.trip);
    this.reviewInfo = this.tourService.getTotalPrice();
    this.trip.totalPriceForPayment = this.reviewInfo.totalPrice;
  }
}

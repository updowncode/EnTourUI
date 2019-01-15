import {
  Component,
  OnInit,
  HostBinding,
  OnDestroy,
  ElementRef,
  ViewChild
} from "@angular/core";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { Traveller } from "../../Models/traveller";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { slideInDownAnimation } from "../../app.animations";
import { Subscription } from "rxjs";
import * as $ from "jquery";
import { Location } from "@angular/common";
import { Form } from "@angular/forms";
import { MessageService } from "../../message.service";
import { EnBook } from "../../Models/en-book";
import { ReviewInfo } from "../../Models/review-info";
import { OptionSummary } from "../../Models/option-summary";
import { InfoSource } from "../../Models/info-source";
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
  isVerified: boolean;
  paying = false;
  toursSubscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router,
    private location: Location,
    private messageService: MessageService
  ) {}
  reviewInfo: ReviewInfo;
  // tourInfoSources: string[] = ["", "Search Engine", "Facebook", "Instagram", "Twitter", "Toronto Star", "eBlast", "Word of Mouth", "TraveLife", "Tour East Website", "Other"];
  ngOnDestroy() {
    this.toursSubscription.unsubscribe();
  }
  compareFn(c1: InfoSource, c2: InfoSource): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  ngOnInit() {
    this.isVerified = false;
    if (localStorage.getItem("EmailHasBeenSent") !== null) {
      localStorage.removeItem("EmailHasBeenSent");
    }

    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = this.activatedRoute.snapshot.queryParamMap.get("tripId");
    this.toursSubscription = this.tourService
      .getTourById(this.tourId)
      .subscribe(t => {
        const roomsLength = this.onResult(t);
        if (roomsLength === 0) {
          this.router.navigate(["/options"], {
            queryParams: { tourId: this.tourId, tripId: this.tripId }
          });
        } else {
          this.tourService.updateSelectedTour(this.tour);
          this.tourService.updateSelectedTrip(this.trip);
        }
        this.initTrip();
      });
      window.scrollTo(0, 0);
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
    this.reviewInfo = this.tourService.getTotalPrice();
    this.trip.selectedInfoSource = this.trip.infoSource.find(c => c.id === -1);
  }
  verify() {
    this.isVerified = true;
    if (this.isVerified) {
      this.gotoPayment();
    }
  }
  onSubmit(form: Form) {}
  gotoPayment() {
    this.messageService.clearMessage();
    if (
      !this.trip.billingInfo.agreeTermAndCondition ||
      !this.trip.billingInfo.haveReadTripNotes
    ) {
      this.tourService.openNgxModelDlg(
        "Please select 'Term and Conditions', 'trip notes'"
      );
      return;
    }
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.updateSelectedTour(this.tour);
    this.tourService.updateSelectedTrip(this.trip);
    const enBook = new EnBook();
    enBook.trip = Object.assign({}, this.trip);
    enBook.applicationID = this.trip.applicationID;
    enBook.currencyCode = this.trip.currencyCode;
    enBook.saleChannel = this.trip.saleChannel;
    enBook.ip = "";
    enBook.dk = this.trip.dk;
    enBook.userId = this.trip.userId;
    enBook.remark = "";
    enBook.insuranceRequest = false;
    this.paying = true;
    this.tourService
      .payment(enBook)
      .then(resp => {
        if (resp && resp._body) {
          const bookHtml = JSON.parse(resp._body).data;
          if (bookHtml === "fail") {
            this.paying = false;
            this.tourService.openNgxModelDlg(
              JSON.parse(resp._body).errorMsg,
              "'trip notes'"
            );
          } else {
            this.paying = false;
            $(bookHtml).appendTo("#ReturnForm");
            $("#pay_form").submit();
          }
        }
      })
      .catch(error => {
        this.paying = false;
        console.log(error._body);
      });
  }
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(["/"]);
    }
  }
}

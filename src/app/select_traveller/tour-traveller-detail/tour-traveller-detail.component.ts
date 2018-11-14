import {
  Component,
  OnInit,
  HostBinding,
  OnDestroy,
  Input
} from "@angular/core";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { slideInDownAnimation } from "../../app.animations";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";
import { CountryOrArea } from "../../Models/countryorarea";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TourDateType } from "../../Models/dateType";
@Component({
  selector: "app-tour-traveller-detail",
  templateUrl: "./tour-traveller-detail.component.html",
  styleUrls: ["./tour-traveller-detail.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourTravellerDetailComponent implements OnInit, OnDestroy {
  private _msg = "";
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
  isVerified: boolean;
  @Input()
  set msg(msg: string) {
    this._msg = (msg && msg.trim()) || "<no msg set>";
  }
  get msg(): string {
    return this._msg;
  }

  toursSubscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router,
    private location: Location
  ) {}
  ngOnDestroy() {
    this.toursSubscription.unsubscribe();
  }
  ngOnInit() {
    this.isVerified = false;
    this.msg = "Loading Traveller Details ...";
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
          this.initData();
        }
      });
  }
  initData() {
    for (let i = 0; i < this.trip.rooms.length; i++) {
      for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
        this.trip.rooms[i].travellers[j].title = "Mr";
        this.trip.rooms[i].travellers[j].placeofbirth = "Toronto";

        this.trip.rooms[i].travellers[j].birthday = new Date(1988, 5, 10);
        // this.trip.rooms[i].travellers[j].birthday.year = new Date().getFullYear();
        // this.trip.rooms[i].travellers[j].birthday.month = new Date().getMonth() + 1;
        // this.trip.rooms[i].travellers[j].birthday.day = new Date().getDate();

        this.trip.rooms[i].travellers[j].passport.number = "AS232424";

        this.trip.rooms[i].travellers[j].passport.issueDate = new Date(2017, 5, 10);
        // this.trip.rooms[i].travellers[j].passport.issueDate.year = new Date().getFullYear();
        // this.trip.rooms[i].travellers[j].passport.issueDate.month = new Date().getMonth() + 1;
        // this.trip.rooms[i].travellers[j].passport.issueDate.day = new Date().getDate();

        this.trip.rooms[i].travellers[j].passport.expiryDate = new Date(2020, 5, 10);
        // this.trip.rooms[i].travellers[j].passport.expiryDate.year = new Date().getFullYear();
        // this.trip.rooms[i].travellers[j].passport.expiryDate.month = new Date().getMonth() + 1;
        // this.trip.rooms[i].travellers[j].passport.expiryDate.day = new Date().getDate();
        this.trip.rooms[i].travellers[
          j
        ].passport.issuePlace = new CountryOrArea();
        this.trip.rooms[i].travellers[j].passport.issuePlace.id = 4;
        this.trip.rooms[i].travellers[j].passport.issuePlace.name = "Canada";
        this.trip.rooms[i].travellers[j].passport.issuePlace.code = "CA";

        this.trip.rooms[i].travellers[j].countryOrArea = new CountryOrArea();
        this.trip.rooms[i].travellers[j].countryOrArea.id = 4;
        this.trip.rooms[i].travellers[j].countryOrArea.name = "Canada";
        this.trip.rooms[i].travellers[j].countryOrArea.code = "CA";

        this.trip.rooms[i].travellers[j].specialRequest =
          "specialRequest" + j.toString();
      }
    }
  }
  onResult(tour: Tour): number {
    this.tour = tour;
    this.trip = this.tour.trips.find(t => t.id === this.tripId);
    if (this.trip.rooms.length === 0) {
      if (localStorage.getItem(this.tripId.toString()) != null) {
        const _trip = JSON.parse(localStorage.getItem(this.tripId.toString()));
        this.trip.rooms = Object.assign([], _trip.rooms);
        return this.trip.rooms.length;
      } else {
        return 0;
      }
    } else {
      return this.trip.rooms.length;
    }
  }
  allDataCorrect(): string {
    for (let i = 0; i < this.trip.rooms.length; i++) {
      if (this.trip.rooms[i].travellers.length > 0) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          if (this.trip.rooms[i].travellers[j].firstName.length === 0) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s First Name is required`;
          }
          if (this.trip.rooms[i].travellers[j].lastName.length === 0) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s Last Name is required`;
          }
          if (this.trip.rooms[i].travellers[j].title.length === 0) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s Title is required`;
          }
          if (this.trip.rooms[i].travellers[j].birthday === null) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s Date of Birth is required`;
          }
          if (this.trip.rooms[i].travellers[j].placeofbirth.length === 0) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s Place of Birth is required`;
          }
          if (this.trip.rooms[i].travellers[j].countryOrArea.id < 0) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s Nationality is required`;
          }
          if (this.trip.rooms[i].travellers[j].passport.number.length === 0) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s Passport number is required`;
          }
          if (this.trip.rooms[i].travellers[j].passport.issueDate === null) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s passport issue date is required`;
          }
          if (this.trip.rooms[i].travellers[j].passport.expiryDate === null) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s passport expiry date is required`;
          }
          if (this.trip.rooms[i].travellers[j].passport.issuePlace.id < 0) {
            return `Room #${this.trip.rooms[i].index}'s passenger ${
              this.trip.rooms[i].travellers[j].id + 1
            }'s passport issue place is required`;
          }
        }
      }
    }
    return "";
  }
  verify() {
    const verifyResult = this.allDataCorrect();
    if (verifyResult.length > 0) {
      this.tourService.openNgxModelDlg(verifyResult);
      return false;
    } else {
      this.isVerified = true;
    }
    if (this.isVerified) {
      this.gotoReviewPayment();
    }
  }
  gotoReviewPayment() {
    this.trip.rooms.forEach(room =>
      room.travellers.forEach(
        traveller => (traveller.firstName = traveller.firstName.trim())
      )
    );
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.updateSelectedTour(this.tour);
    this.tourService.updateSelectedTrip(this.trip);
    this.router.navigate(["/review"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
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

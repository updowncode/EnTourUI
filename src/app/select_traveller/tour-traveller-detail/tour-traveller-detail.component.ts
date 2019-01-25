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
          this.tourService.updateRoomInfo();
          // this.initData();
        }
      });
    window.scrollTo(0, 0);
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

        this.trip.rooms[i].travellers[j].passport.issueDate = new Date(
          2017,
          5,
          10
        );
        // this.trip.rooms[i].travellers[j].passport.issueDate.year = new Date().getFullYear();
        // this.trip.rooms[i].travellers[j].passport.issueDate.month = new Date().getMonth() + 1;
        // this.trip.rooms[i].travellers[j].passport.issueDate.day = new Date().getDate();

        this.trip.rooms[i].travellers[j].passport.expiryDate = new Date(
          2020,
          5,
          10
        );
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
    let msg = "";
    let errQuantity = 0;
    $("input[name='passportnumber'").each(function(index, el) {
      // if (index === elIndex) {
       // $(el).removeClass(["ng-invalid", "ng-touched"]);
        $(el).removeClass("ng-invalid");
        $(el).removeClass("ng-touched");
      // }
    });
    if (
      this.trip.billingInfo.firstName === null ||
      this.trip.billingInfo.firstName.trim() === ""
    ) {
      // return `First Name is required`;
      errQuantity++;
      $("#firstName").addClass("ng-invalid ng-touched");
    }
    if (
      this.trip.billingInfo.lastName === null ||
      this.trip.billingInfo.lastName.trim() === ""
    ) {
      // return `Last Name is required`;
      errQuantity++;
      $("#lastName").addClass("ng-invalid ng-touched");
    }
    if (
      this.trip.billingInfo.email === null ||
      this.trip.billingInfo.email.trim() === ""
    ) {
      errQuantity++;
      $("#email").addClass("ng-invalid ng-touched");
      // return `E-Mail is required`;
    }
    // primaryPhone
    if (
      this.trip.billingInfo.primaryPhone === null ||
      this.trip.billingInfo.primaryPhone.trim() === ""
    ) {
      errQuantity++;
      $("#primaryPhone").addClass("ng-invalid ng-touched");
      // return `Primary Phone is required`;
    }
    // mailingAddress
    if (
      this.trip.billingInfo.mailingAddress === null ||
      this.trip.billingInfo.mailingAddress.trim() === ""
    ) {
      errQuantity++;
      $("#mailingAddress").addClass("ng-invalid ng-touched");
      // return `Mailing Address is required`;
    }
    // city
    if (
      this.trip.billingInfo.city === null ||
      this.trip.billingInfo.city.trim() === ""
    ) {
      errQuantity++;
      $("#city").addClass("ng-invalid ng-touched");
      // return `City is required`;
    }
    // if (this.trip.billingInfo.country && this.trip.billingInfo.country.id < 0) {
    //   return `Country is required`;
    // }
    // provinceStates
    if (
      this.trip.billingInfo.provinceStates === null ||
      this.trip.billingInfo.provinceStates.trim() === ""
    ) {
      errQuantity++;
      $("#provinceStates").addClass("ng-invalid ng-touched");
      // return `Province or State is required`;
    }
    // postalCode
    if (
      this.trip.billingInfo.postalCode === null ||
      this.trip.billingInfo.postalCode.trim() === ""
    ) {
      errQuantity++;
      $("#postalCode").addClass("ng-invalid ng-touched");
      // return `Postal Code is required`;
    }
    let elIndex = 0;
    for (let i = 0; i < this.trip.rooms.length; i++) {
      if (this.trip.rooms[i].travellers.length > 0) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          if (this.trip.rooms[i].travellers[j].firstName.length === 0) {
            $("input[name='firstName'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
            // return `Passenger ${
            //   this.trip.rooms[i].travellers[j].id + 1
            // }'s first name is required`;
          }
          if (this.trip.rooms[i].travellers[j].lastName.length === 0) {
            $("input[name='lastName'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
            // return `Passenger ${
            //   this.trip.rooms[i].travellers[j].id + 1
            // }'s last name is required`;
          }

          if (
            this.trip.rooms[i].travellers[j].birthday === null ||
            !this.isValidDate(this.trip.rooms[i].travellers[j].birthday)
          ) {
            $("input[name='birthday'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
            // return `Passenger ${
            //   this.trip.rooms[i].travellers[j].id + 1
            // }'s date of birth is required`;
          }

          if (this.trip.rooms[i].travellers[j].countryOrArea.code === "CA") {
            if (this.trip.rooms[i].travellers[j].passport.number.length > 0) {
              if (
                this.trip.rooms[i].travellers[j].passport.number.length === 1
              ) {
                $("input[name='passportnumber'").each(function(index, el) {
                  if (index === elIndex) {
                    errQuantity++;
                    msg = "Canada passport must start with two characters";
                    $(el).addClass("ng-invalid ng-touched");
                  }
                });
              }
              if (
                this.trip.rooms[i].travellers[j].passport.number.length >= 2
              ) {
                if (
                  !new RegExp("^[A-Za-z]{2}").test(
                    this.trip.rooms[i].travellers[j].passport.number.substr(
                      0,
                      2
                    )
                  )
                ) {
                  $("input[name='passportnumber'").each(function(index, el) {
                    if (index === elIndex) {
                      errQuantity++;
                      msg = "Canada passport must start with two characters";
                      $(el).addClass("ng-invalid ng-touched");
                    }
                  });
                } else if (
                  this.trip.rooms[i].travellers[j].passport.number.length !== 8
                ) {
                  $("input[name='passportnumber'").each(function(index, el) {
                    if (index === elIndex) {
                      errQuantity++;
                      msg = "Passport number length is not correct";
                      $(el).addClass("ng-invalid ng-touched");
                    }
                  });
                } else if (
                  !new RegExp("[0-9]{6}$").test(
                    this.trip.rooms[i].travellers[j].passport.number.substr(
                      2,
                      6
                    )
                  )
                ) {
                  $("input[name='passportnumber'").each(function(index, el) {
                    if (index === elIndex) {
                      errQuantity++;
                      msg = "Passport number last six character is not number";
                      $(el).addClass("ng-invalid ng-touched");
                    }
                  });
                }
              }
            }
          }
          if (this.trip.rooms[i].travellers[j].placeofbirth.length === 0) {
            $("input[name='placeofbirth'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
          }
          if (this.trip.rooms[i].travellers[j].passport.number.length === 0) {
            $("input[name='passportnumber'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
            // return `Passenger ${
            //   this.trip.rooms[i].travellers[j].id + 1
            // }'s passport number is required`;
          }
          if (
            this.trip.rooms[i].travellers[j].passport.issueDate === null ||
            !this.isValidDate(
              this.trip.rooms[i].travellers[j].passport.issueDate
            )
          ) {
            $("input[name='passportissueDate'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
            // return `Passenger ${
            //   this.trip.rooms[i].travellers[j].id + 1
            // }'s passport issue date is required`;
          }
          if (
            this.trip.rooms[i].travellers[j].passport.expiryDate === null ||
            !this.isValidDate(
              this.trip.rooms[i].travellers[j].passport.expiryDate
            )
          ) {
            $("input[name='passportexpiryDate'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
            // return `Passenger ${
            //   this.trip.rooms[i].travellers[j].id + 1
            // }'s passport expiry date is required`;
          }
          elIndex++;
        }
      }
    }
    if (errQuantity > 0) {
      if (msg === "") {
        return "Please fill all the required fields";
      } else {
        return msg;
      }
    }
    return "";
  }
  isValidDate(d: any) {
    return d instanceof Date && !isNaN(d.getTime());
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

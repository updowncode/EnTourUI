import { Component, OnInit, HostBinding } from "@angular/core";
import { EnTourCoreService } from "../en-tour-core/en-tour-core.service";
import { EnTourService } from "../en-tour.service";
import { slideInDownAnimation } from "../animations";
import { Router, ActivatedRoute } from "@angular/router";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { Traveller } from "../Models/traveller";
import { Quantity } from "../Models/quantity";
import { BillingInfo } from "../Models/billing-info";
import { AuthService } from "../auth/auth.service";
import { Option } from "../Models/option";
import { Passport } from "../Models/passport";
@Component({
  selector: "app-tour-traveller",
  templateUrl: "./tour-traveller.component.html",
  styleUrls: ["./tour-traveller.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourTravellerComponent implements OnInit {
  @HostBinding("@routeAnimation") routeAnimation = true;
  // @HostBinding("style.display") display = "block";
  // @HostBinding("style.position") position = "absolute";
  trip: Trip;
  tour: Tour;
  tourId: number;
  tripId: number;
  msg = "Loading Traveller ...";
  constructor(
    private tourService: EnTourService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.msg = "";
    this.tourId = +this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = +this.activatedRoute.snapshot.queryParamMap.get("tripId");
    this.trip = this.tourService.retrieveTrip();
    if (this.trip === undefined) {
      if (localStorage.getItem(this.tripId.toString()) != null) {
        this.trip = JSON.parse(localStorage.getItem(this.tripId.toString()));
      } else {
        this.router.navigate(["/tours"]);
      }
    }
    this.initTrip();
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.saveTrip(this.trip);
  }

  initTrip() {
    this.trip.availabledTravellerQuantities = this.tourService.getAvailabledTravellerQuantities(
      this.tourId,
      this.tripId
    );
    this.trip.availabledRoomQuantities = this.tourService.getAvailabledRoomQuantities(
      this.tourId,
      this.tripId,
      this.trip.availabledTravellerQuantities[0]
    );
    this.trip.selectedTravellerQuantity = this.trip.availabledTravellerQuantities[0];
    this.trip.selectedRoomQuantity = this.trip.availabledRoomQuantities[0];
    this.trip.billingInfo = new BillingInfo();
    this.trip.rooms = this.tourService
      .getRooms(this.tourId, this.tripId)
      .sort((a, b) => {
        if (a.roomPrice > b.roomPrice) {
          return 1;
        }
        if (a.roomPrice < b.roomPrice) {
          return -1;
        }
        return 0;
      });
    this.trip.rooms[0].travellers = new Array<Traveller>();
    this.trip.rooms[0].travellers.push(
      {
        id: 1,
        title: "",
        firstName: "David",
        middleName: "",
        lastName: "",
        placeofbirth: "",
        birthday: "",
        passport: {
          number: "",
          issueDate: "",
          expiryDate: "",
          issuePlace: { id: 1, name: "Canada", code: "CA" }
        },
        countryorarea: null,
        selectedOptions: null,
        needVisa: true,
        needInsuance: true,
        specialRequest: "",
        roomId: this.trip.rooms[0].id
      },
      {
        id: 2,
        title: "",
        firstName: "Peter",
        middleName: "",
        lastName: "",
        placeofbirth: "",
        birthday: "",
        passport: {
          number: "",
          issueDate: "",
          expiryDate: "",
          issuePlace: { id: 1, name: "Canada", code: "CA" }
        },
        countryorarea: null,
        selectedOptions: null,
        needVisa: true,
        needInsuance: true,
        specialRequest: "",
        roomId: this.trip.rooms[0].id
      }
    );
    const ops = this.tourService.getOptions(this.tourId, this.tripId);
    this.trip.rooms[0].travellers[0].selectedOptions = new Array<Option>();
    this.trip.rooms[0].travellers[0].selectedOptions.push(ops[0]);
  }
  compareFn(c1: Quantity, c2: Quantity): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  roomChange(newValue: Quantity) {
    this.trip.selectedRoomQuantity = newValue;
  }
  travellerChange(newValue: Quantity) {
    this.trip.selectedTravellerQuantity = newValue;
  }
  goToOptions(): void {
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.saveTrip(this.trip);

    this.router.navigate(["/options"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
}

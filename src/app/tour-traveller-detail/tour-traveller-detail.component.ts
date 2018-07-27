import { Component, OnInit, HostBinding } from "@angular/core";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { Traveller } from "../Models/traveller";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import { Room } from "../Models/room";
import { CountryOrArea } from "../Models/countryorarea";
import { Title } from "../Models/title";
import { slideInDownAnimation } from "../animations";
@Component({
  selector: "app-tour-traveller-detail",
  templateUrl: "./tour-traveller-detail.component.html",
  styleUrls: ["./tour-traveller-detail.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourTravellerDetailComponent implements OnInit {
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "related";
  tour: Tour;
  trip: Trip;
  tourId: number;
  tripId: number;
  travellers: Traveller[] = [];
  msg = "Loading Traveller Details ...";
  availabledTitles: Title[] = [
    { id: 1, name: "Mr" },
    { id: 2, name: "Mrs" },
    { id: 3, name: "Miss" },
    { id: 4, name: "Ms" },
    { id: 5, name: "Sir" },
    { id: 6, name: "Dr" }
  ];
  availabledCountryOrAreas: CountryOrArea[] = [
    { id: 1, name: "Canada", code: "CA" },
    { id: 2, name: "Unite States", code: "US" },
    { id: 3, name: "China", code: "CN" }
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router
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
    this.trip.rooms.forEach((c: Room) => {
      if (c.travellers != null) {
        c.travellers.forEach(d => {
          this.travellers.push(d);
        });
      }
    });
  }
  gotoReviewPayment() {
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.saveTrip(this.trip);

    this.router.navigate(["/reviewpayment"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
}

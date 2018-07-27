import { Component, OnInit, HostBinding } from "@angular/core";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import { Traveller } from "../Models/traveller";
import { Room } from "../Models/room";
import { slideInDownAnimation } from "../animations";
@Component({
  selector: "app-tour-option",
  templateUrl: "./tour-option.component.html",
  styleUrls: ["./tour-option.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourOptionComponent implements OnInit {
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "related";
  tour: Tour;
  trip: Trip;
  tourId: number;
  tripId: number;
  travellers: Traveller[] = [];
  msg = "Loading options ...";
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
    this.trip.options = this.tourService.getOptions(this.tourId, this.tripId);
    this.trip.rooms.forEach((c: Room) => {
      if (c.travellers != null) {
        c.travellers.forEach(d => {
          this.travellers.push(d);
        });
      }
    });
  }
  gotoTravellerDetail() {
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.saveTrip(this.trip);

    this.router.navigate(["/travellerdetails"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
}

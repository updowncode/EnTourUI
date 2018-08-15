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
  msg = "Loading options ...";
  constructor(
    private tourService: EnTourService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.tourId = params.tourId;
      this.tripId = params.tripId;
      this.tourService.getTourById(this.tourId).subscribe(t => {
        const roomsLength = this.onResult(t);
        if (roomsLength === 0) {
          this.router.navigate(["/travellers"], {
            queryParams: { tourId: this.tourId, tripId: this.tripId }
          });
        } else {
          this.tourService.shareTour(this.tour);
          this.tourService.shareTrip(this.trip);
        }
      });
    });
  }

  onResult(tour: Tour): number {
    this.msg = "";
    this.tour = tour;
    this.trip = this.tour.trips.find(t => t.id === this.tripId);
    if (this.trip.rooms.length === 0) {
      if (localStorage.getItem(this.tripId.toString()) != null) {
        const _trip = JSON.parse(localStorage.getItem(this.tripId.toString()));
        this.trip.rooms = Object.assign([], _trip.rooms);
        this.travellers = Object.assign([], this.tourService.setupTravellers(this.trip.rooms));
        return this.trip.rooms.length;
      } else {
        return 0;
      }
    } else {
      this.travellers = Object.assign([], this.tourService.setupTravellers(this.trip.rooms));
      return this.trip.rooms.length;
    }
  }

  gotoTravellerDetail() {
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.shareTour(this.tour);
    this.tourService.shareTrip(this.trip);
    this.router.navigate(["/travellerdetails"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
}

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
    this.msg = "Load options";
    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = this.activatedRoute.snapshot.queryParamMap.get("tripId");
    this.tourService.getToursAsync().subscribe((tours: Tour[]) => {
      this.tour = Object.assign(
        {},
        tours.find(tour => tour.id === this.tourId)
      );
      this.trip = this.tour.trips.find(trip => trip.id === this.tripId);
      // this.tourService.shareTour(this.tour);
      // this.tourService.shareTrip(this.trip);
      this.trip.rooms.forEach((c: Room) => {
        if (c.travellers != null) {
          c.travellers.forEach(d => {
            this.travellers.push(d);
          });
        }
      });
    });
  }
  gotoTravellerDetail() {
    this.tourService.shareTour(this.tour);
    this.tourService.shareTrip(this.trip);
    this.router.navigate(["/travellerdetails"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
}

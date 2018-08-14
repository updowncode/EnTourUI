import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import { Tour } from "../Models/tour";
import { slideInDownAnimation } from "../animations";
import { Trip } from "../Models/trip";
@Component({
  selector: "app-tour-detail",
  templateUrl: "./tour-detail.component.html",
  styleUrls: ["./tour-detail.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourDetailComponent implements OnInit {
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "related";
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.tourId = this.activatedRoute.snapshot.paramMap.get("id");
    this.tourService.getToursAsync().subscribe((tours: Tour[]) => {
      this.tourService.saveTours(tours);
      this.tour = Object.assign(
        {},
        tours.find(tour => tour.id === this.tourId)
      );
      this.initTrip();
    });
  }
  initTrip() {
    if (this.tour.trips != null) {
      this.trip = Object.assign({}, this.tour.trips[0]);
      this.onSelectTrip(this.tour.trips[0]);
    }
  }
  onSelectTrip(trip: Trip) {
    this.trip = trip;
    this.tourService.saveTrip(this.trip);
  }
  gotoTraveller(tourId: string, tripId: string): void {
    this.onSelectTrip(this.tour.trips.find(c => c.id === tripId));
    localStorage.removeItem(this.trip.id.toString());
    localStorage.setItem(this.trip.id.toString(), JSON.stringify(this.trip));
    this.router.navigate(["/travellers"], {
      queryParams: { tourId: tourId, tripId: tripId }
    });
  }
}

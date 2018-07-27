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
  tourId: number;
  tripId: number;
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "related";
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.tourId = +this.activatedRoute.snapshot.paramMap.get("id");
    this.tour = this.tourService.getToursMockDataById(this.tourId);
    this.initTrip();
    this.tourService.saveTrip(this.trip);
  }
  initTrip() {
    this.trip = this.tour.trips.find(c => c.isSelected);
    if (this.trip == null && this.tour.trips.length > 0) {
      this.tour.trips[0].isSelected = true;
      this.trip = this.tour.trips[0];
    }
    this.tour.trips.forEach(trip => {
      trip.notIncludeIn = this.tourService.getNotIncludeIn(
        trip.tourId,
        trip.id
      );
      trip.includedIn = this.tourService.getIncludeIn(trip.tourId, trip.id);
    });
  }
  onSelectTrip(trip: Trip) {
    this.trip = trip;
    this.tour.trips.forEach(t => {
      t.id === trip.id ? (t.isSelected = true) : (t.isSelected = false);
    });
     this.tourService.saveTrip(this.trip);
  }
  gotoTraveller(tourId: number, tripId: number): void {
    this.onSelectTrip(this.tour.trips.find(c => c.id === tripId));
    localStorage.removeItem(this.trip.id.toString());
    localStorage.setItem(this.trip.id.toString(), JSON.stringify(this.trip));
     this.router.navigate(["/travellers"], {
      queryParams: { tourId: tourId, tripId: tripId }
    });
  }
}

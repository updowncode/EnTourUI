import { Component, OnInit, HostBinding, OnDestroy } from "@angular/core";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { slideInDownAnimation } from "../../app.animations";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";
@Component({
  selector: "app-tour-traveller-detail",
  templateUrl: "./tour-traveller-detail.component.html",
  styleUrls: ["./tour-traveller-detail.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourTravellerDetailComponent implements OnInit, OnDestroy {
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
  msg = "Loading Traveller Details ...";
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
    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = this.activatedRoute.snapshot.queryParamMap.get("tripId");
    this.toursSubscription = this.tourService.getTourById(this.tourId).subscribe(t => {
      const roomsLength = this.onResult(t);
      if (roomsLength === 0) {
        this.router.navigate(["/options"], {
          queryParams: { tourId: this.tourId, tripId: this.tripId }
        });
      } else {
        this.tourService.updateSelectedTour(this.tour);
        this.tourService.updateSelectedTrip(this.trip);
      }
    });
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

  gotoReviewPayment() {
    this.trip.rooms.forEach( room => room.travellers.forEach( traveller => traveller.firstName = traveller.firstName.trim()));
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.updateSelectedTour(this.tour);
    this.tourService.updateSelectedTrip(this.trip);
    this.router.navigate(["/reviewpayment"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}

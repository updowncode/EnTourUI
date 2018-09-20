import { Component, OnInit, HostBinding, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { Traveller } from "../../Models/traveller";
import { Room } from "../../Models/room";
import { slideInDownAnimation } from "../../app.animations";
import { Subscription } from "rxjs";
@Component({
  selector: "app-tour-option",
  templateUrl: "./tour-option.component.html",
  styleUrls: ["./tour-option.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourOptionComponent implements OnInit, OnDestroy {
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
  isVerified: boolean;
  msg = "Loading options ...";
  paramSubscription: Subscription;
  toursSubscription: Subscription;
  constructor(
    private tourService: EnTourService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}
  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.toursSubscription.unsubscribe();
  }
  ngOnInit() {
    this.isVerified = false;
    this.paramSubscription = this.activatedRoute.queryParams.subscribe(
      params => {
        this.tourId = params.tourId;
        this.tripId = params.tripId;
        this.toursSubscription = this.tourService
          .getTourById(this.tourId)
          .subscribe(t => {
            const roomsLength = this.onResult(t);
            if (roomsLength === 0) {
              this.router.navigate(["/tours"], {
                queryParams: { tourId: this.tourId, tripId: this.tripId }
              });
            } else {
              this.tourService.updateSelectedTour(this.tour);
              this.tourService.updateSelectedTrip(this.trip);
            }
          });
      }
    );
  }

  onResult(tour: Tour): number {
    this.msg = "";
    this.tour = tour;
    this.trip = this.tour.trips.find(t => t.id === this.tripId);
    if (this.trip.rooms.length === 0) {
      if (localStorage.getItem(this.tripId.toString()) != null) {
        const _trip = JSON.parse(localStorage.getItem(this.tripId.toString()));
        this.trip.rooms = Object.assign([], _trip.rooms);
        this.travellers = Object.assign(
          [],
          this.tourService.setupTravellers(this.trip.rooms)
        );
        return this.trip.rooms.length;
      } else {
        return 0;
      }
    } else {
      this.travellers = Object.assign(
        [],
        this.tourService.setupTravellers(this.trip.rooms)
      );
      return this.trip.rooms.length;
    }
  }
  allDataCorrect(): string {
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
      this.gotoTravellerDetail();
    }
  }
  gotoTravellerDetail() {
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.updateSelectedTour(this.tour);
    this.tourService.updateSelectedTrip(this.trip);
    this.router.navigate(["/travellers"], {
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

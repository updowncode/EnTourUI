import {
  Component,
  OnInit,
  Input,
  HostBinding,
  OnDestroy,
  Inject,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  ActivatedRoute,
  ParamMap,
  Router,
  NavigationError,
  RouterEvent,
  NavigationEnd
} from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { Tour } from "../../Models/tour";
import { slideInDownAnimation } from "../../app.animations";
import { Trip } from "../../Models/trip";
import { Subscription } from "rxjs";
import { MessageService } from "../../message.service";
import { APP_BASE_HREF } from "@angular/common";
import { filter, switchMap } from "rxjs/operators";
import * as $ from 'jquery';
@Component({
  selector: "app-display-trips",
  templateUrl: "./display-trips.component.html",
  styleUrls: ["./display-trips.component.sass"],
  animations: [slideInDownAnimation]
})
export class DisplayTripsComponent implements OnInit, OnDestroy {
  // @ViewChild("myNav", {read: ElementRef}) el: ElementRef;
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  toursSubscription: Subscription;
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router,
    // @Inject(APP_BASE_HREF) public baseHref: string,
    private messageService: MessageService
  ) {
    // router.events.filter(e => e instanceof NavigationError).subscribe(e => {
    //   this.messageService.add(e.error);
    // });
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     this.initialiseInvites();
    //   }
    // });
  }
  ngOnDestroy() {
    if (this.toursSubscription) {
      this.toursSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    // this.tourId = this.activatedRoute.snapshot.paramMap.get("id");
    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.toursSubscription = this.tourService
      .getToursAsync()
      .subscribe((tours: Tour[]) => this.onResult(tours));
  }
  onResult(tours: Tour[]) {
    this.tourService.saveTours(tours);
    this.tour = Object.assign({}, tours.find(tour => tour.id === this.tourId));
    this.initTrips();
  }
  initTrips() {
    if (this.tour.trips != null) {
      this.trip = Object.assign({}, this.tour.trips[0]);
      this.onSelectTrip(this.tour.trips[0]);
    }
  }
  onSelectTrip(trip: Trip) {
    this.trip = trip;
  }
  private handleError(error: any): Promise<any> {
    this.router.navigateByUrl("/");
    console.error("An error occurred", error); // for demo purposes only
    this.messageService.sendMessage("An error occurred" + error);
    this.messageService.add("setup ok").subscribe((result: boolean) => {
      if (!result) {
        console.log("");
        return;
      }
      console.log("error add");
    });

    return Promise.reject(error.message || error);
  }
  gotoTraveller(tourId: string, tripId: string): void {
    // this.onSelectTrip(this.tour.trips.find(c => c.id === tripId));
    const url = "rooms?tourId=" + tourId + "&tripId=" + tripId;
    console.log(url);

    // console.log(this.el.nativeElement.id);
    // $("#myNav").parent().children("a").click();
   // window.open('/ENTOUR/rooms?tourId=CHG11&tripId=30004810', '_blank');
    // this.router.navigateByUrl("/rooms?tourId=CHG11&tripId=30004810");

     this.router.navigate(["/rooms"], {
      queryParams: { tourId: tourId, tripId: tripId },
      replaceUrl: true
    });
  }
}

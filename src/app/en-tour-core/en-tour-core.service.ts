/* tslint:disable:no-unused-variable component-selector-name one-line check-open-brace */
/* tslint:disable:*/
import { Injectable, Optional, OnDestroy } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { UserServiceConfig } from "./user-service-config";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { Quantity } from "../Models/quantity";
import { EnTourService } from "../en-tour.service";

const FETCH_LATENCY = 500;

@Injectable()
export class EnTourCoreService implements OnDestroy {
  nav: string;
  travellerQuantities = Array<Quantity>();
  roomQuantities = Array<Quantity>();
  constructor(
    // private tourService: EnTourService,
    @Optional() config: UserServiceConfig
  ) {
    if (config) {
      this.nav = config.nav;
    }
    console.log("ContactService instance created.");
  }
  ngOnDestroy() {
    console.log("ContactService instance destroyed.");
  }
  getTravellerQuantitiesByID(tourId: number, tripId: number): Quantity[] {
    this.travellerQuantities = Array<Quantity>();
    this.travellerQuantities.push(new Quantity(-1, "Please select"));
    this.travellerQuantities.push(new Quantity(1, "Adult"));
    this.travellerQuantities.push(new Quantity(2, "Adult"));
    this.travellerQuantities.push(new Quantity(3, "Adult"));
    this.travellerQuantities.push(new Quantity(4, "Adult"));
    // return of(this.travellerQuantities).pipe(delay(FETCH_LATENCY));
    return this.travellerQuantities;
  }
  // setupAvailabledTravellersQuantity(
  //   tourId: number,
  //   tripId: number
  // ): Observable<Tour> {
  //   const tour = this.tourService.getTourMockData(tourId);
  //   tour.trips.map(c => {
  //     c.id === tripId ? c.isSelected = true : c.isSelected = false;
  //   });

  //   tour.availabledTravellerQuantity = this.getTravellerQuantitiesByID(
  //     tourId,
  //     tripId
  //   );
  //   return of(tour).pipe(delay(FETCH_LATENCY));
  // }
  getRoomsQuantity(tourId: number, tripId: number): Observable<Quantity[]> {
    this.roomQuantities = Array<Quantity>();
    this.roomQuantities.push(new Quantity(-1, "Please select"));
    this.roomQuantities.push(new Quantity(1, "Room"));
    this.roomQuantities.push(new Quantity(2, "Room"));
    this.roomQuantities.push(new Quantity(3, "Room"));
    this.roomQuantities.push(new Quantity(4, "Room"));
    return of(this.roomQuantities).pipe(delay(FETCH_LATENCY));
  }
  // getContact(id: number | string): Observable<Contact> {
  //   const contact$ = of(CONTACTS.find(contact => contact.id === +id));
  //   return contact$.pipe(delay(FETCH_LATENCY));
  // }
}

/* tslint:disable:no-unused-variable component-selector-name one-line check-open-brace */
/* tslint:disable:*/
import { Injectable, } from "@angular/core";
import { Optional } from "@angular/core";
import { OnDestroy } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
// import { UserServiceConfig } from "./user-service-config";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
// import { Quantity } from "../Models/quantity";
// import { EnTourService } from "../en-tour.service";

const FETCH_LATENCY = 500;
class UserServiceConfig {
  nav: string;
}
@Injectable()
export class EnTourCoreService implements OnDestroy {
  nav: string;
  // travellerQuantities = Array<Quantity>();
  // roomQuantities = Array<Quantity>();
  constructor(
    // private tourService: EnTourService,
    @Optional() config: UserServiceConfig
  ) {
    if (config) {
      this.nav = config.nav;
    }
    // console.log("ContactService instance created.");
  }
  ngOnDestroy() {
    // console.log("ContactService instance destroyed.");
  }


  // getContact(id: number | string): Observable<Contact> {
  //   const contact$ = of(CONTACTS.find(contact => contact.id === +id));
  //   return contact$.pipe(delay(FETCH_LATENCY));
  // }
}

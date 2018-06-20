import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TourAvailabilityComponent } from './tour-availability/tour-availability.component';
import { TourTravellerComponent } from './tour-traveller/tour-traveller.component';
import { TourOptionComponent } from './tour-option/tour-option.component';
import { TourTravellerDetailComponent } from './tour-traveller-detail/tour-traveller-detail.component';
import { TourReviewPaymentComponent } from './tour-review-payment/tour-review-payment.component';
import { TourNavCompComponent } from './tour-nav-comp/tour-nav-comp.component';

@NgModule({
  declarations: [
    AppComponent,
    TourAvailabilityComponent,
    TourTravellerComponent,
    TourOptionComponent,
    TourTravellerDetailComponent,
    TourReviewPaymentComponent,
    TourNavCompComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

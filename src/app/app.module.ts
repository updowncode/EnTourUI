import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {APP_BASE_HREF} from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { EnTourService } from './en-tour.service';

import { AppComponent } from './app.component';
import { TourListComponent } from './tour-list/tour-list.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { TourTravellerComponent } from './tour-traveller/tour-traveller.component';
import { TourOptionComponent } from './tour-option/tour-option.component';
import { TourTravellerDetailComponent } from './tour-traveller-detail/tour-traveller-detail.component';
import { TourReviewPaymentComponent } from './tour-review-payment/tour-review-payment.component';
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    TourListComponent,
    TourDetailComponent,
    TourTravellerComponent,
    TourOptionComponent,
    TourTravellerDetailComponent,
    TourReviewPaymentComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  // providers: [{provide: APP_BASE_HREF, useValue : '/entourdetail' }],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

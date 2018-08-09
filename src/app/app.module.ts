import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { APP_BASE_HREF } from "@angular/common";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EnTourService } from "./en-tour.service";
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from "./app.component";
import { TourListComponent } from "./tour-list/tour-list.component";
import { TourDetailComponent } from "./tour-detail/tour-detail.component";
import { TourTravellerComponent } from "./tour-traveller/tour-traveller.component";
import { TourOptionComponent } from "./tour-option/tour-option.component";
import { TourTravellerDetailComponent } from "./tour-traveller-detail/tour-traveller-detail.component";
import { TourReviewPaymentComponent } from "./tour-review-payment/tour-review-payment.component";
import { MessageComponent } from "./message/message.component";
import { PopupComponent } from "./popup/popup.component";
import { HighlightDirective } from "./directives/highlight/highlight.directive";
import { EnTourCoreModule } from "./en-tour-core/en-tour-core.module";
import { EnTourCoreService } from "./en-tour-core/en-tour-core.service";
import { AppMaterialModule } from "./app-material/app-material.module";
import { AuthGuard } from "./auth/auth.guard";
import { AuthService } from "./auth/auth.service";
import { TripDetailsComponent } from "./trip-details/trip-details.component";
import { SelectRoomComponent } from "./select-room/select-room.component";
import { TravellerInRoomComponent } from "./traveller-in-room/traveller-in-room.component";
import { BillingInfoComponent } from "./billing-info/billing-info.component";
import { OptionForTravellerComponent } from "./option-for-traveller/option-for-traveller.component";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { DetailForTravellerComponent } from './detail-for-traveller/detail-for-traveller.component';
import { TripSummaryComponent } from './trip-summary/trip-summary.component';
// ng g c test -is -it --spec=false
// ng new project-name --routing --style=sass
// ng g m app-material
// npm install --save @angular/material @angular/cdk
@NgModule({
  declarations: [
    AppComponent,
    TourListComponent,
    TourDetailComponent,
    TourTravellerComponent,
    TourOptionComponent,
    TourTravellerDetailComponent,
    TourReviewPaymentComponent,
    MessageComponent,
    PopupComponent,
    HighlightDirective,
    TripDetailsComponent,
    SelectRoomComponent,
    TravellerInRoomComponent,
    BillingInfoComponent,
    OptionForTravellerComponent,
    NavBarComponent,
    DetailForTravellerComponent,
    TripSummaryComponent
  ],
  imports: [
    BrowserModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    EnTourCoreModule.forRoot({ nav: "DATE & PRICING" }),
    AppRoutingModule
  ],
  // providers: [{provide: APP_BASE_HREF, useValue : '/entourdetail' }],
  providers: [EnTourService, AuthService, AuthGuard, CanDeactivateGuard],
  bootstrap: [AppComponent],
  entryComponents: [PopupComponent]
})
export class AppModule {}

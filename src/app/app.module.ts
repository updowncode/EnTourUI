import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { APP_BASE_HREF } from "@angular/common";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EnTourService } from "./en-tour.service";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { TourListComponent } from "./select_tour/tour-list/tour-list.component";
import { TourOptionComponent } from "./select_option/tour-option/tour-option.component";
import { TourTravellerDetailComponent } from "./select_traveller/tour-traveller-detail/tour-traveller-detail.component";
import { TourReviewPaymentComponent } from "./select_review/tour-review-payment/tour-review-payment.component";
import { MessageComponent } from "./selected_share/message/message.component";
import { PopupComponent } from "./popup/popup.component";
import { HighlightDirective } from "./directives/highlight/highlight.directive";
import { EnTourCoreModule } from "./en-tour-core/en-tour-core.module";
import { EnTourCoreService } from "./en-tour-core/en-tour-core.service";
import { AuthGuard } from "./auth/auth.guard";
import { AuthService } from "./auth/auth.service";
import { TripDetailsComponent } from "./select_trip/trip-details/trip-details.component";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { TourPaymentComponent } from "./select_payment/tour-payment/tour-payment.component";
import { UrlSerializer } from "@angular/router";
import { LowerCaseUrlSerializer } from "./lower-case-url-serializer";
import { AppMaterialModule } from "./app-material/app-material.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MyDatePickerComponent } from "./my-date-picker/my-date-picker.component";
// tslint:disable-next-line:max-line-length
import { TourTravellerDetailEachTravellerComponent } from "./select_traveller/tour-traveller-detail-each-traveller/tour-traveller-detail-each-traveller.component";
// tslint:disable-next-line:max-line-length
import { TourOptionForEachTravellerComponent } from "./select_option/tour-option-for-each-traveller/tour-option-for-each-traveller.component";
import { TourNavBarComponent } from "./selected_share/tour-nav-bar/tour-nav-bar.component";
import { TourRoomsComponent } from "./select_room/tour-rooms/tour-rooms.component";
import { TourRoomsBillingInfoComponent } from "./select_room/tour-rooms-billing-info/tour-rooms-billing-info.component";
import { TourRoomsEachRoomComponent } from './select_room/tour-rooms-each-room/tour-rooms-each-room.component';
// tslint:disable-next-line:max-line-length
import { TourRoomsEachRoomEachTravellerComponent } from './select_room/tour-rooms-each-room-each-traveller/tour-rooms-each-room-each-traveller.component';
import { TourSummaryComponent } from './selected_share/tour-summary/tour-summary.component';
import { DisplayTripsComponent } from './select_trip/display-trips/display-trips.component';

// ng g c test -is -it --spec=false
// ng new project-name --routing --style=sass
// ng g m app-material
// npm install --save @angular/material @angular/cdk
@NgModule({
  declarations: [
    AppComponent,
    TourListComponent,
    TourOptionComponent,
    TourTravellerDetailComponent,
    TourReviewPaymentComponent,
    MessageComponent,
    PopupComponent,
    HighlightDirective,
    TripDetailsComponent,
    TourPaymentComponent,
    MyDatePickerComponent,
    TourTravellerDetailEachTravellerComponent,
    TourOptionForEachTravellerComponent,
    TourNavBarComponent,
    TourRoomsComponent,
    TourRoomsBillingInfoComponent,
    TourRoomsEachRoomComponent,
    TourRoomsEachRoomEachTravellerComponent,
    TourSummaryComponent,
    DisplayTripsComponent
  ],
  imports: [
    BrowserModule,
    AppMaterialModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    EnTourCoreModule.forRoot({ nav: "DATE & PRICING" }),
    AppRoutingModule
  ],
  // providers: [{provide: APP_BASE_HREF, useValue : '/entourdetail' }],
  providers: [
    EnTourService,
    AuthService,
    AuthGuard,
    CanDeactivateGuard
    // {
    //   provide: UrlSerializer,
    //   useClass: LowerCaseUrlSerializer
    // },
    //  {provide: APP_BASE_HREF, useValue : '/ENTOURDETAIL'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [PopupComponent]
})
export class AppModule {}

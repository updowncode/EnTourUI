import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { APP_BASE_HREF, PlatformLocation } from "@angular/common";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EnTourService } from "./en-tour.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
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
import { TourRoomsEachRoomComponent } from "./select_room/tour-rooms-each-room/tour-rooms-each-room.component";
// tslint:disable-next-line:max-line-length
import { TourRoomsEachRoomEachTravellerComponent } from "./select_room/tour-rooms-each-room-each-traveller/tour-rooms-each-room-each-traveller.component";
import { TourSummaryComponent } from "./selected_share/tour-summary/tour-summary.component";
import { DisplayTripsComponent } from "./select_trip/display-trips/display-trips.component";
import { TestComponent } from "./test/test.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { MySpyDirective } from "./share/my-spy.directive";
// tslint:disable-next-line:max-line-length
import { TourRoomsEachRoomEachTravellerChildComponent } from "./select_room/tour-rooms-each-room-each-traveller-child/tour-rooms-each-room-each-traveller-child.component";
import { UnlessDirective } from "./share/unless.directive";
import { FetchJsonPipe } from "./share/FetchJsonPipe";
import { PopupService } from "./popup.service";
import { MyModelDlgComponent } from "./my-model-dlg/my-model-dlg.component";
import { NgbdModalContent } from "./ngbd-model-content/ngbd-model-content";
import { ForbiddenValidatorDirective } from "./share/forbidden-name.directive";
import { RoomValidatorDirective } from "./share/room-validator.directive";
import { TourRoomsFormComponent } from "./select_room/tour-rooms-form/tour-rooms-form.component";
import { KeysPipe } from "./share/keys.pipe";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ModalModule } from "ngx-bootstrap/modal";
import { NgxModelDlgComponent } from "./ngx-model-dlg/ngx-model-dlg.component";
import { AlertModule } from "ngx-bootstrap/alert";
// import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { TourRoomsDynamicComponent } from "./select_room/tour-rooms-dynamic/tour-rooms-dynamic.component";
import { TourRoomsBillingInfoDynamicComponent } from "./select_room/tour-rooms-billing-info-dynamic/tour-rooms-billing-info-dynamic.component";
import { TourRoomsEachRoomDynamicComponent } from "./select_room/tour-rooms-each-room-dynamic/tour-rooms-each-room-dynamic.component";
import { TourRoomsEachRoomEachTravellerDynamicComponent } from "./select_room/tour-rooms-each-room-each-traveller-dynamic/tour-rooms-each-room-each-traveller-dynamic.component";
import { TourRoomsEachRoomEachTravellerChildDynamicComponent } from "./select_room/tour-rooms-each-room-each-traveller-child-dynamic/tour-rooms-each-room-each-traveller-child-dynamic.component";
import { ReviewComponent } from "./review/review.component";
import { NoopInterceptor } from "./share/noop-interceptor";
import { ReceiptComponent } from './receipt/receipt.component';
import { SafePipe } from './safe.pipe';
import { FormatDecimalPipe } from "./share/format-decimal.pipe";

// import { NoopInterceptor } from "../../node_modules/@angular/common/http/src/interceptor";
// export function getBaseHref(platformLocation: PlatformLocation): string {
//   return platformLocation.getBaseHrefFromDOM();
// }
// ng g c test -is -it --spec=false
// ng new project-name --routing --style=sass
// ng g m app-material
// npm install --save @angular/material @angular/cdk
// --flat 把这个文件放进了 src/app 中，而不是单独的目录中。
// --module=app 告诉 CLI 把它注册到 AppModule 的 imports 数组中。
// ng add @angular/elements --name=*your_project_name*.
@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    PopupComponent,
    HighlightDirective,
    MyDatePickerComponent,
    TourTravellerDetailEachTravellerComponent,
    TourOptionForEachTravellerComponent,
    TourNavBarComponent,
    TourListComponent,
    TourOptionComponent,
    TourTravellerDetailComponent,
    TripDetailsComponent,
    TourPaymentComponent,
    TourReviewPaymentComponent,
    TourRoomsComponent,
    TourRoomsBillingInfoComponent,
    TourRoomsEachRoomComponent,
    TourRoomsEachRoomEachTravellerComponent,
    TestComponent,
    PageNotFoundComponent,
    MySpyDirective,
    TourRoomsEachRoomEachTravellerChildComponent,
    UnlessDirective,
    TourSummaryComponent,
    MyModelDlgComponent,
    DisplayTripsComponent,
    ForbiddenValidatorDirective,
    RoomValidatorDirective,
    TourRoomsFormComponent,
    NgxModelDlgComponent,
    // DynamicFormComponent,
    TourRoomsDynamicComponent,
    TourRoomsBillingInfoDynamicComponent,
    TourRoomsEachRoomDynamicComponent,
    TourRoomsEachRoomEachTravellerDynamicComponent,
    TourRoomsEachRoomEachTravellerChildDynamicComponent,
    ReviewComponent,
    ReceiptComponent,
    SafePipe,
    FetchJsonPipe,
    KeysPipe,
    FormatDecimalPipe,
    NgbdModalContent
  ],
  imports: [
    BrowserModule,
    AppMaterialModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    EnTourCoreModule.forRoot({ nav: "DATE & PRICING" }),
    AppRoutingModule
  ],
  // providers: [{provide: APP_BASE_HREF, useValue : '/ERTOUR' }],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
    EnTourService,
    AuthService,
    AuthGuard,
    CanDeactivateGuard,
    PopupService,
    // {
    //   provide: UrlSerializer,
    //   useClass: LowerCaseUrlSerializer
    // },
    {
      provide: APP_BASE_HREF,
      useFactory: (platformLocation: PlatformLocation): string => {
        return platformLocation.getBaseHrefFromDOM();
      },
      deps: [PlatformLocation]
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PopupComponent, NgbdModalContent, NgxModelDlgComponent]
})
export class AppModule {}

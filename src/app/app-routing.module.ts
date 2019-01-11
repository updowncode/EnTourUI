import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { DisplayTripsComponent } from "./select_trip/display-trips/display-trips.component";
import { TourOptionComponent } from "./select_option/tour-option/tour-option.component";
import { TourTravellerDetailComponent } from "./select_traveller/tour-traveller-detail/tour-traveller-detail.component";
import { TourReviewPaymentComponent } from "./select_review/tour-review-payment/tour-review-payment.component";
import { TourListComponent } from "./select_tour/tour-list/tour-list.component";
import { TourPaymentComponent } from "./select_payment/tour-payment/tour-payment.component";
import { TourRoomsComponent } from "./select_room/tour-rooms/tour-rooms.component";
import { TestComponent } from "./test/test.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
// import { DynamicFormComponent } from "./dynamic-form/dynamic-form.component";
import { TourRoomsDynamicComponent } from "./select_room/tour-rooms-dynamic/tour-rooms-dynamic.component";
import { ReceiptComponent } from "./receipt/receipt.component";

const routes: Routes = [
  { path: "tours", component: TourListComponent },
  { path: "trips", component: DisplayTripsComponent },
  { path: "rooms", component: TourRoomsComponent },
  // { path: "rooms", component: TourRoomsDynamicComponent },
  { path: "options", component: TourOptionComponent },
  { path: "travellers", component: TourTravellerDetailComponent },
  { path: "review", component: TourReviewPaymentComponent },
  { path: "PAYMENT", redirectTo: "payment" },
  { path: "payment", component: TourPaymentComponent },
  { path: "receipt", component: ReceiptComponent },
  // { path: "dynamic", component: DynamicFormComponent },
  // tslint:disable-next-line:max-line-length
  // http://localhost:4200/ENTOUR/PAYMENT?trnApproved=1&trnId=10100577&messageId=1&messageText=Approved&authCode=TEST&responseType=T&trnAmount=110.00&trnDate=9%2F14%2F2018%201:38:33%20PM&trnOrderNumber=123456&trnLanguage=eng&trnCustomerName=qinag&trnEmailAddress=asad@sdf.com&trnPhoneNumber=4169290888&avsProcessed=1&avsId=Y&avsResult=1&avsAddrMatch=1&avsPostalMatch=1&avsMessage=Street%20address%20and%20Postal%2FZIP%20match.&cvdId=1&cardType=VI&trnType=P&paymentMethod=CC&ref1=&ref2=&ref3=&ref4=&ref5=&hashValue=47b4e59f59ffda947079048cf0ab7f47
 // { path: "", component: TourListComponent, pathMatch: "full" },
   { path: "", redirectTo: "tours", pathMatch: "full" },
  // { path: "ENTOUR", component: TourListComponent, pathMatch: "full" }, // for dnndev.me
  { path: "**", component: PageNotFoundComponent }
];
@NgModule({
  // imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}

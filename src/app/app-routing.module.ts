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

const routes: Routes = [
  { path: "tours", component: TourListComponent },
  { path: "trips", component: DisplayTripsComponent },
  { path: "rooms", component: TourRoomsComponent },
  { path: "options", component: TourOptionComponent },
  { path: "travellers", component: TourTravellerDetailComponent },
  { path: "review", component: TourReviewPaymentComponent },
  { path: "PAYMENT", redirectTo: "payment" },
  { path: "payment", component: TourPaymentComponent },
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

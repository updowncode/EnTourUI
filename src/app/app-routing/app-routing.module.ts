import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "../app.component";
import { TourDetailComponent } from "../tour-detail/tour-detail.component";
import { TourTravellerComponent } from "../tour-traveller/tour-traveller.component";
import { TourOptionComponent } from "../tour-option/tour-option.component";
import { TourTravellerDetailComponent } from "../tour-traveller-detail/tour-traveller-detail.component";
import { TourReviewPaymentComponent } from "../tour-review-payment/tour-review-payment.component";
import { TourListComponent } from "../tour-list/tour-list.component";
import { TourPaymentComponent } from "../tour-payment/tour-payment.component";

const routes: Routes = [
  { path: "tours", component: TourListComponent },
  { path: "detail/:id", component: TourDetailComponent },
  { path: "travellers", component: TourTravellerComponent },
  { path: "options", component: TourOptionComponent },
  { path: "travellerdetails", component: TourTravellerDetailComponent },
  { path: "reviewpayment", component: TourReviewPaymentComponent },
  { path: "PAYMENT", redirectTo: "payment" },
  { path: "payment", component: TourPaymentComponent  },
  { path: "", component: TourListComponent, pathMatch: "full" }
  // { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}

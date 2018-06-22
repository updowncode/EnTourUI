import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { TourDetailComponent } from '../tour-detail/tour-detail.component';
import { TourTravellerComponent } from '../tour-traveller/tour-traveller.component';
import { TourOptionComponent } from '../tour-option/tour-option.component';
import { TourTravellerDetailComponent } from '../tour-traveller-detail/tour-traveller-detail.component';
import { TourReviewPaymentComponent } from '../tour-review-payment/tour-review-payment.component';

const routes: Routes = [
  { path: 'tours', component: AppComponent },
  { path: 'detail/:id', component: TourDetailComponent },
  { path: 'travellers', component: TourTravellerComponent },
  { path: 'options', component: TourOptionComponent },
  { path: 'travellerdetails', component: TourTravellerDetailComponent },
  { path: 'payment', component: TourReviewPaymentComponent },
  { path: '', redirectTo: 'tours', pathMatch: 'full' }];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }

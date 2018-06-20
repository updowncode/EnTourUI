import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourReviewPaymentComponent } from './tour-review-payment.component';

describe('TourReviewPaymentComponent', () => {
  let component: TourReviewPaymentComponent;
  let fixture: ComponentFixture<TourReviewPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourReviewPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourReviewPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

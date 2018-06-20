import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourAvailabilityComponent } from './tour-availability.component';

describe('TourAvailabilityComponent', () => {
  let component: TourAvailabilityComponent;
  let fixture: ComponentFixture<TourAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

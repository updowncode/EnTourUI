import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourTravellerDetailComponent } from './tour-traveller-detail.component';

describe('TourTravellerDetailComponent', () => {
  let component: TourTravellerDetailComponent;
  let fixture: ComponentFixture<TourTravellerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourTravellerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourTravellerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

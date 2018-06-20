import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourTravellerComponent } from './tour-traveller.component';

describe('TourTravellerComponent', () => {
  let component: TourTravellerComponent;
  let fixture: ComponentFixture<TourTravellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourTravellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourTravellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

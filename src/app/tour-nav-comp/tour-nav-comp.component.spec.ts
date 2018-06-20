import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourNavCompComponent } from './tour-nav-comp.component';

describe('TourNavCompComponent', () => {
  let component: TourNavCompComponent;
  let fixture: ComponentFixture<TourNavCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourNavCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourNavCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

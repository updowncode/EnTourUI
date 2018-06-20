import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourOptionComponent } from './tour-option.component';

describe('TourOptionComponent', () => {
  let component: TourOptionComponent;
  let fixture: ComponentFixture<TourOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

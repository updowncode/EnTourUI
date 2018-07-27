import { Component, OnInit, Input } from '@angular/core';
import { Trip } from '../Models/trip';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.sass']
})
export class TripDetailsComponent implements OnInit {
  @Input() trip: Trip;
  constructor() { }

  ngOnInit() {
  }

}

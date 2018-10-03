import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tour-rooms-each-room-each-traveller-child-dynamic',
  templateUrl: './tour-rooms-each-room-each-traveller-child-dynamic.component.html',
  styleUrls: ['./tour-rooms-each-room-each-traveller-child-dynamic.component.sass']
})
export class TourRoomsEachRoomEachTravellerChildDynamicComponent implements OnInit {
  @Input()
  travellerIndex: number;
  constructor() { }

  ngOnInit() {
  }

}

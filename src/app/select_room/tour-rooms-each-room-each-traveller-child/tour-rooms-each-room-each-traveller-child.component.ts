import { Component, OnInit, Input } from '@angular/core';
import { Traveller } from '../../Models/traveller';

@Component({
  selector: 'app-tour-rooms-each-room-each-traveller-child',
  templateUrl: './tour-rooms-each-room-each-traveller-child.component.html',
  styleUrls: ['./tour-rooms-each-room-each-traveller-child.component.sass']
})
export class TourRoomsEachRoomEachTravellerChildComponent implements OnInit {
  @Input()
  traveller: Traveller;
  constructor() { }

  ngOnInit() {
  }

}

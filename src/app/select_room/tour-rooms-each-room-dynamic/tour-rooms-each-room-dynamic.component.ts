import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tour-rooms-each-room-dynamic',
  templateUrl: './tour-rooms-each-room-dynamic.component.html',
  styleUrls: ['./tour-rooms-each-room-dynamic.component.sass']
})
export class TourRoomsEachRoomDynamicComponent implements OnInit {
  @Input()
  roomFormGroup: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}

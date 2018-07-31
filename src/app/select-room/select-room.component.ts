import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../Models/room';
import { Trip } from '../Models/trip';

@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.sass']
})
export class SelectRoomComponent implements OnInit {
  @Input() room: Room;
  @Input() trip: Trip;
  @Input() roomIndex: number;
  constructor() { }

  ngOnInit() {
  }

}

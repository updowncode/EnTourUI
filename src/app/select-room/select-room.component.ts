import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../Models/room';

@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.sass']
})
export class SelectRoomComponent implements OnInit {
  @Input() room: Room;
  @Input() tripRooms: Room[];
  constructor() { }

  ngOnInit() {
  }

}

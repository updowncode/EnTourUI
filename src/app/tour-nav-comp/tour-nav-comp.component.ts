import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tour-nav-comp',
  templateUrl: './tour-nav-comp.component.html',
  styleUrls: ['./tour-nav-comp.component.sass']
})
export class TourNavCompComponent implements OnInit {

  private index: number;
  constructor(index) {
    this.index = index;
   }

  ngOnInit() {
    this.index = 1;
  }

}

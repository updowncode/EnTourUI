import { Component, OnInit, Input } from '@angular/core';
import { Traveller } from '../Models/traveller';
import { CountryOrArea } from '../Models/countryorarea';
import { Title } from '../Models/title';

@Component({
  selector: 'app-detail-for-traveller',
  templateUrl: './detail-for-traveller.component.html',
  styleUrls: ['./detail-for-traveller.component.sass']
})
export class DetailForTravellerComponent implements OnInit {
  @Input() traveller: Traveller;
  @Input() index: number;
  @Input() availabledTitles: Title[];
  @Input() availabledCountryOrAreas: CountryOrArea[];
  constructor() {}

  ngOnInit() {}
}

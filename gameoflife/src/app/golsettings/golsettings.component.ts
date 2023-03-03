import { Component } from '@angular/core';


@Component({
  selector: 'app-golsettings',
  templateUrl: './golsettings.component.html',
  styleUrls: ['./golsettings.component.css']
})
export class GolsettingsComponent {
  static fieldSize = 10;
  static refreshIntervalMs = 200;
  somethingClicked() {

  }
  constructor() {
    //this.test = test;
  }
}

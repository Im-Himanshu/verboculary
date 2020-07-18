import { Component, OnInit } from '@angular/core';

import { AppRate } from '@ionic-native/app-rate/ngx';

@Component({
  selector: 'app-app-rate',
  templateUrl: './app-rate.component.html',
  styleUrls: ['./app-rate.component.scss'],
})
export class AppRateComponent implements OnInit {

  constructor(private appRate : AppRate ) { }

  ngOnInit() {}

  triggerRateApp(){
    this.appRate.preferences.storeAppURL = {
      android: "",
      ios: "",
    }
  }

}

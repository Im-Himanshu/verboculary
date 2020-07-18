import { Injectable } from '@angular/core';

import { AppRate } from '@ionic-native/app-rate/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppRateService {

  constructor(private appRate : AppRate) { }

  triggerRateApp(){
    console.log("App Rating triggered");
    this.appRate.preferences.storeAppURL = {
      android: "https://google.com",
      ios: "https://google.com",
    }
  }
}

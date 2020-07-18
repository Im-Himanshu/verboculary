import { Injectable } from '@angular/core';

import { AppRate } from '@ionic-native/app-rate/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppRateService {

  constructor(private appRate : AppRate) { }

  triggerRateApp(){
    this.appRate.preferences.storeAppURL = {
      android: "",
      ios: "",
    }
  }
}

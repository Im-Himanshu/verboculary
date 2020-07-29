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
    this.appRate.promptForRating(true);
  }

  showAppRate(){
    this.appRate.preferences = {
        displayAppName: 'Verboculary',
        usesUntilPrompt: 10,
        promptAgainForEachNewVersion: true,
        storeAppURL : {
          ios: '',
          android: '',
        },
        customLocale: {
          title: 'Do you enjoy using verboculary?',
          message: 'If you enjoy would you mind taking a moment to rate it?',
          cancelButtonLabel: 'No,Thanks',
          laterButtonLabel: 'Remind Me Later',
          rateButtonLabel: 'Rate It Now'
        },
        callbacks : {
          onRateDialogShow: function(callback){
            console.log('rate shown');
          },
          onButtonClicked: function(buttonIndex){
            console.log('selected index',buttonIndex);
          }
        }
          
    }
    this.appRate.promptForRating(false);
  }
}

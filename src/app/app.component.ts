import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.reScaleScreen();
    });
  }

  reScaleScreen() {
    let element = document.getElementById("toScale");
    let screen = window.screen;
    console.log("just a buffer")
    let parentElement = document.getElementById("parentdiv");
    if (screen.availWidth < element.clientWidth) {
      //client-width is set to minimum of 400 is it goes below that the screen will scale to always show 400 px else the default view is shown
      var scale =
        Math.ceil((screen.availWidth / element.clientWidth) * 100) / 100;
      let scaleString = "scale(" + scale + ")";
      element.style.transform = scaleString;
      element.style.height = Math.ceil(100 / scale) + "vh";
    }
    else {
      var scale =
        Math.ceil((screen.availWidth / element.clientWidth) * 100) / 100;
      let scaleString = "scale(" + 1.0 + ")";
      element.style.transform = scaleString;
      element.style.height = "100vh"

    }


  }



}

import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './home/services/data-base.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private isAppReady = false;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: DatabaseService,
    private router: Router,
  ) {
    this.initializeApp();
    this.isTheUserNew();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.reScaleScreen();
    });
  }


  isTheUserNew() {
    this.db.isTheUserNew().subscribe(data => {
      console.log(data)

      // if the first promise return false then show slides
      if (!data[0]) {
        this.router.navigate(['/slides']);
      }
      this.isAppReady = true;

    })


  }


  // after the screen size gets too low it scale the zoom level down to keep it fit in one screen..this is a re-usable behaviour across app
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

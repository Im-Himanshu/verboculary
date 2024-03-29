import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { processedDataSharing } from './interfaces/dropdown.interface';
import { DatabaseService } from './services/data-base.service'
import { ModalController, IonRange, IonSearchbar } from '@ionic/angular';
import { AboutDeveloperComponent } from './about-developer/about-developer.component';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HowToUseComponent } from './how-to-use/how-to-use.component'
import { ThemeChangeService } from './services/theme-change.service'
import { SharingServiceService } from './services/sharing-service.service';
import { Router } from '@angular/router';

import { AdmobSerService } from './services/admob-ser.service';
import { Storage } from '@ionic/storage';
import { PodcastService } from './services/podcast.service';

import { ApprateService } from './services/apprateService/apprate.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChildren('searchBar', { read: ElementRef }) ionSearchBar: IonSearchbar;

  //@ViewChild("container", { static: false, read: ElementRef }) container: ElementRef;
  appTitle: string = "GRE Ninja"
  isProcessed: boolean = false;


  selectedTheme: string = 'Default'
  //selectedWords: any; not maintaining here as lots of hassle in updating it
  allSetData: processedDataSharing;
  allSetOfcategory: any;
  allWordsOfSets;
  isDarkMode: boolean = false;
  chartLabelsAndData = {};
  modeValue: boolean = true;
  themeValue: 'Light Theme' | 'Dark Theme' = 'Light Theme';

  prevDeltaX = 0;
  prevDeltaY = 0;

  @ViewChild('range', { static: false }) range: IonRange;

  constructor(public db: DatabaseService, public modalController: ModalController, public toastController: ToastController, public alertController: AlertController, public themeService: ThemeChangeService, public router: Router, public sharingService: SharingServiceService, public admob: AdmobSerService, private storage: Storage, public podcast: PodcastService,
    private apprate: ApprateService) {
    this.allSetData = this.db.allSetData;
    this.allWordsOfSets = this.allSetData.allWordOfSets;
    this.showFullscreenAdd();
    this.apprate.presentRateUs();
  }
  ngOnInit() {
    // this.themeService.setMode(this.themeService.mode);
    this.themeService.setThemeValue(this.themeService.mode);
  }


  goToUrl(url) {
    this.router.navigate([url]);

  }

  searchIconClicked() {
    //this.ionSearchBar.setFocus();
    this.goToUrl('/mainmodule/base/wordSets/allWords')
    this.db.isToShowSearchBar = true;
    let searchBar = document.getElementById("searchBar")
    searchBar.focus();
    //this.ionSearchBar.setFocus();
    //this.db.allSelectedWordIdsFiltered.splice(0, this.db.allSelectedWordIdsFiltered.length); // deleting all the


  }






  async presentAlertConfirm() {
    //    this.db.fireBaseService.feedAllwordsDatainFirebase();
    const alert = await this.alertController.create({
      header: 'Warning! Deleting all User Data?',
      message: "Are You sure you want to reset all the User Data? This will delete all the progress. You won't be able to retrieve it again.",
      cssClass: 'ionicAlert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            this.db.presentToast("Deletion Cancelled!!");
          }
        }, {
          text: 'Reset',
          handler: () => {
            this.db.reSetApp();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentDynamicAlert(data) {

    let header = data.header;
    let message = data.message;
    let buttons = data.buttons; // of the format of whatever I want;
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons
    });

    await alert.present();
  }
  async presentRatingAlert() {
    const alert = await this.alertController.create({
      header: 'Rate Us',
      message: 'Would you mind rating us? it means a lot.',
      cssClass: 'alertstar',
      buttons: [
        {
          text: 'May be Later!',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.goToRatingSite();
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Take Me there',
          handler: () => {
            //this.db.reSetApp();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  changeAppTheme() {
    this.themeService.changeTheme(this.selectedTheme);

  }

  goToRatingSite() {
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: AboutDeveloperComponent
    });
    return await modal.present();
  }

  async presentHowToUseModal() {
    const modal = await this.modalController.create({
      component: HowToUseComponent
    });
    return await modal.present();
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  resetProgress() {

  }



  toggleMode(e) {
    this.themeService.toggleMode();
  }




  compareWithFn_category = (o1, o2) => {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  };
  compareWithFn_set = (o1, o2) => {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  };
  compareWith_category = this.compareWithFn_category;
  compareWith_set = this.compareWithFn_set;



  prev() {
    this.podcast.prev();
  }

  next() {
    this.podcast.next();
  }

  tooglePlayer(newState) {
    this.podcast.tooglePlayer();
  }

  seek() {
    this.podcast.seek(this.range);
  }

  close() {
    this.podcast.closePodcast();
  }


  showFullscreenAdd() {
    this.storage.get("loginCount").then(data => {
      let x = data % 5;
      if (x == 4) { // for every 5 th login
        this.admob.showInterstitialAds();
        console.log("Add shown");
      }
    })
  }

  rate() {
    window.location.href = "market://details?id=com.GREninja.GRE.vocabulary";
  }
}

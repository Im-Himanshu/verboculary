import { Component, OnInit } from '@angular/core';
import { dropdownData, processedDataSharing } from './interfaces/dropdown.interface';
import { DatabaseService } from './services/data-base.service'
import { ModalController } from '@ionic/angular';
import { AboutDeveloperComponent } from './about-developer/about-developer.component';
import { FilterPopOverComponent } from './filter-pop-over/filter-pop-over.component'
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HowToUseComponent } from './how-to-use/how-to-use.component'
import { appSessionData } from './appSessionData.interface'
import { ThemeChangeService } from './services/theme-change.service'
import {SearchService} from './services/search.service'
import {SharingServiceService} from './services/sharing-service.service';
import { AppRateService } from './POCs/AppRate Service/app-rate.service';
import { Router } from '@angular/router'
import { wordToIdMap } from '../wordToId'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  appTitle: string = "Verboculary"
  isProcessed: boolean = false;


  selectedTheme: string = 'Default'
  //selectedWords: any; not maintaining here as lots of hassle in updating it
  allSetData: processedDataSharing;
  allSetOfcategory: any;
  allWordsOfSets;
  isDarkMode: boolean = false;


  prevDeltaX = 0;
  prevDeltaY = 0;

  constructor(public searchService: SearchService, private db: DatabaseService, public modalController: ModalController, public toastController: ToastController, public alertController: AlertController, public themeService: ThemeChangeService, public router: Router, public sharingService: SharingServiceService, public appRateService: AppRateService) {
    this.allSetData = this.db.allSetData;
    this.allWordsOfSets = this.allSetData.allWordOfSets;

  }
  ngOnInit() {


  }




  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Warning! Deleting all App Data?',
      message: 'Are You sure you want to reset all the app data? this will delete all the progress.',
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



  handlePan(event) {

    let absoluteY = event.center.y;
    if (absoluteY < 30 || absoluteY > 500) { return; }
    if (event.deltaX === 0 || (event.center.x === 0 && event.center.y === 0)) return;

    //console.log(event.deltaX, event.deltaY)
    let newDeltaX = event.deltaX - this.prevDeltaX; // the new delta
    let newDeltaY = event.deltaY - this.prevDeltaY // the new delta more then the previous one
    this.prevDeltaX = event.deltaX;
    this.prevDeltaY = event.deltaY;
    let rotate = newDeltaX * newDeltaY;
    //console.log(newDeltaX, newDeltaY)

    let move: any = event.deltaY;
    if (event.deltaY >= 0) {
      move = "+" + move; // assigning the sign to the positive numbers
    }
    let toMoveElement = document.getElementById("toMove");
    let crntPosition: any = toMoveElement.style.top;
    crntPosition = crntPosition.substring(0, crntPosition.length - 2)// -1 for 0 index and - 2 for removing px
    crntPosition = parseInt(crntPosition);

    let newPosition = crntPosition + newDeltaY;

    if (absoluteY < 30 || newPosition > 700 || absoluteY > 430) { return; }
    let newValue = "calc(" + + move + "px)";
    toMoveElement.style.top = newPosition + "px"

  }


  handlePanEnd(event) {
    //30 to 500 250

    let toMoveElement = document.getElementById("toMove");

    let absoluteY = event.center.y;

    if (absoluteY > 200) {
      toMoveElement.style.top = 430 + "px"
    }
    if (absoluteY <= 200) {
      toMoveElement.style.top = 30 + "px"
    }
    this.prevDeltaX = 0;
    this.prevDeltaY = 0;

  }

  swipeup(event) {
    let toMoveElement = document.getElementById("toMove");

    let absoluteY = event.center.y;

    if (absoluteY > 200) {
      toMoveElement.style.top = 430 + "px"
    }
    if (absoluteY <= 200) {
      toMoveElement.style.top = 30 + "px"
    }
    this.prevDeltaX = 0;
    this.prevDeltaY = 0;



  }




  compareWithFn_category = (o1, o2) => {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  };
  compareWithFn_set = (o1, o2) => {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  };
  compareWith_category = this.compareWithFn_category;
  compareWith_set = this.compareWithFn_set;

  searchBarOnFocus = (event) => {

  }

}

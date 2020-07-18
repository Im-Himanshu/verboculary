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
import {SharingServiceService} from './services/sharing-service.service'
import { Router } from '@angular/router'
import { wordToIdMap } from '../wordToId'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  appTitle: string = "Verboculary"
  default_category: number = 0;
  default_set: number = 0;
  isProcessed: boolean = false;
  isMultiple: boolean = true;
  totalWordsCount: number = 0;
  titleThreshold = 2;


  selectedCategory: string;
  selectedSet = [];
  selectedFilter: string;
  selectedSorting: String = 'shuffle';
  selectedTheme: string = 'Default'
  //selectedWords: any; not maintaining here as lots of hassle in updating it
  allSetData: processedDataSharing;
  allCategoryType: any[];
  allSetOfcategory: any;
  allWordOfSets: any;
  cards;
  willComeAgain: boolean = false;
  appSessionData: appSessionData;
  isDarkMode: boolean = false;
  searchQuery: string = 'Hey yo';

  repetitions = [1, 2, 3, 4, 5, 6, 7];
  prevDeltaX = 0;
  prevDeltaY = 0;
  masterCard = [1, 2, 3]


  constructor(public searchService: SearchService, private db: DatabaseService, public modalController: ModalController, public toastController: ToastController, public alertController: AlertController, private themeService: ThemeChangeService, public router: Router,public sharingService: SharingServiceService) {
    this.cards = [];

  }
  ngOnInit() {

  }


  //4
  sortSelectedIds() {
    if (!this.db.filteredSelectedWordIds) return;
    if (this.selectedSorting === 'alphabetically') {
      this.db.sortIdsAlphabetically(this.db.filteredSelectedWordIds);
    }
    else {
      this.db.shuffle(this.db.filteredSelectedWordIds); // will shuffle the list IDs randomly
    }
    this.updateSessionData();
    // no need of event because basic objects is remaining same
  }

  //5
  updateSessionData() {

  }


  filterWords(type: number, wordIDs: string[]) {
    let dynamicData = this.db.wordsDynamicData;
    let filteredIds = [];

    for (let wordID of wordIDs) {
      try {
        let isWordMarked = dynamicData[Number(wordID)]['isMarked'];
        if (type == 1 && isWordMarked) {
          filteredIds.push(wordID);
        }
        if (type == 0 && !isWordMarked) {
          filteredIds.push(wordID);
        }

      } catch (error) {
        console.log(JSON.stringify(error)); // error occured still progressing for next loop

      }
    }
    return filteredIds;

  }

  sortingChanged($event) {
    this.sortSelectedIds();
  }


  removeSet(oneSet) {
    // logic here is to remove the last set and keep all as the final case
    let deleteCount = 1;
    let startIndex = this.selectedSet.indexOf(oneSet);
    if (this.selectedSet.length <= 1) {
      if (this.selectedSet[0] && this.selectedSet[0] !== 'All') {
        this.selectedSet = ['All']; // if the last element is not all then show all;
        this.presentToast('Last Filter removed, All words are selected!!');
        return;
      }
      this.presentToast('Select atleast one Set From SideMenu!!');
      return;
    }
    if (oneSet == 'tails') {
      startIndex = this.titleThreshold;
      deleteCount = this.selectedSet.length - this.titleThreshold;

    }
    let deletedSet;
    if (startIndex != -1) {
      deletedSet = this.selectedSet.splice(startIndex, deleteCount);
    }

    this.presentToast('Removed ' + deleteCount + " Selected Sets : " + deletedSet)
    this.selectedSet = [].concat(this.selectedSet); // to trigger the setChnaged Event
  }

  removeFilter() {
    this.presentToast('Filtered Removed: ' + this.selectedFilter)
    this.selectedFilter = 'all';
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

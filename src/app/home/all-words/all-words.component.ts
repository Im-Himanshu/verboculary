import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../services/data-base.service";
import { FilterPopOverComponent } from "../filter-pop-over/filter-pop-over.component";
import { PopoverController } from "@ionic/angular";

import { NavParams, Events } from "@ionic/angular";

@Component({
  selector: "app-all-words",
  templateUrl: "./all-words.component.html",
  styleUrls: ["./all-words.component.scss"]
})
export class AllWordsComponent implements OnInit {
  allWordOfSets: any;
  allSelectedWordIDs: string[];
  selectedIDsDynamicData: any; // of type wordAppData
  allWordDetails: any;
  isData1Ready: boolean = false;
  isData2Ready: boolean = false;
  isAllWordMastered: boolean = false;
  clickedWordId;

  constructor(
    private db: DatabaseService,
    private popoverController: PopoverController,
    private events: Events
  ) {
    this.db.wordListChangeEvent.asObservable().subscribe(data => {
      // data will be the list of sets  // here data will be the list of sets selected on the screen I have to fetch all the owrds to be shown in this// if it comes here before the actual event it will be publis
      if (data) {
        this.fetchSelectedIdfromService();
      }
    });

    this.db.fetchingWordDataCompleted.asObservable().subscribe(data => {
      if (data) {
        this.fetchallWordsFromService();
      }
    });
    // in case the data has already been published then go for it in starting
    if (this.db.allSelectedWordIDs) {
      this.fetchSelectedIdfromService();
    }
    if (this.db.allWordsData) {
      this.fetchallWordsFromService();
    }
  }
  isToShowAll: boolean = false;

  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FilterPopOverComponent,
      event: ev
    });

    /** Sync event from popover component */
    this.events.subscribe("fromPopoverEvent", () => {});
    return await popover.present();
  }

  fetchSelectedIdfromService() {
    this.allSelectedWordIDs = this.db.filteredSelectedWordIds; // set the selected IDs everytime it has been changed there
    if (!this.allSelectedWordIDs || this.allSelectedWordIDs.length == 0) {
      this.wordListEmptyTask();
      return;
    }
    this.isAllWordMastered = false; // have to reset every time the filter is chnaged in case of reversal
    this.allWordDetails = this.db.allWordsData;
    this.fetchselectedIdsDynamicData();

    //console.log("from all-words.component.ts")
  }

  wordListEmptyTask() {
    this.isAllWordMastered = true;
  }

  shuffleWord() {
    if (!this.allSelectedWordIDs) return;
    this.db.shuffle(this.allSelectedWordIDs);
  }
  sortIdsAlphabetically() {
    this.db.sortIdsAlphabetically(this.allSelectedWordIDs);
  }

  fetchallWordsFromService() {
    this.allSelectedWordIDs = this.db.filteredSelectedWordIds; // set the selected IDs everytime it has been changed there
    this.allWordDetails = this.db.allWordsData;
    this.isData2Ready = true;
  }

  onDynamicDataChange() {
    this.db.saveCurrentStateofDynamicData(); // the data is directly access from the service so only need to be saved in localstorage
  }

  fetchselectedIdsDynamicData() {
    this.selectedIDsDynamicData = this.db.getMultipleWordsState(
      this.allSelectedWordIDs
    );
    this.isData1Ready = true;
  }

  ngOnInit() {}
  toggleMeaning(idToExpand) {
    if (idToExpand === this.clickedWordId) {
      this.clickedWordId = null; // to provide toggle of meaning
    } else {
      this.clickedWordId = idToExpand;
    }
  }

  toggleShowMeaningofAll() {
    this.isToShowAll = !this.isToShowAll;
  }
  changeMark(newMark, wordId) {
    this.toggleMeaning(wordId);
    if (newMark) {
      this.selectedIDsDynamicData[wordId]["isMarked"] = true;
    } else {
      this.selectedIDsDynamicData[wordId]["isMarked"] = false;
    }
    this.onDynamicDataChange();
  }
}

import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-practise',
  templateUrl: './practise.component.html',
  styleUrls: ['./practise.component.scss'],
})
export class PractiseComponent implements OnInit {

  isToShowMeaning: boolean = false;
  allWordOfSets: any;
  isData1Ready: boolean = false;
  selectedId; // randomly setting it to avoid error
  selectedIdIndex;
  isToShowAll: boolean = false;
  practiseStats: any;
  totalWordPoint; // number Of words * correctThreshold like 1 point for every correct trial...
  masteredWordPoint;
  seenWordCount;
  nonMasteredWordIds = []; // list of Ids to be shown in the practise now.
  selectedCategory;
  correctThreshold = 4;
  isAllWordMastered = false;
  flashCards = [];
  cards;


  allSelectedWordIDs: string[];
  wordDynamicData: any;
  allWordsData: any;
  randomizedWordIDsList: string[];


  constructor(private db: DatabaseService, private route: ActivatedRoute, public sanitizer: DomSanitizer, public toastController: ToastController) {

    this.allSelectedWordIDs = this.db.allSelectedWordIds;
    this.wordDynamicData = this.db.wordsDynamicData;
    this.allWordsData = this.db.allWordsData;
    this.processDynamicData();
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDynamicDataChange();
  }




  processDynamicData() {
    if (!this.allSelectedWordIDs || this.allSelectedWordIDs.length == 0) {
      this.isAllWordMastered = true;
      return;
    }
    this.isAllWordMastered = false; // if it comes here means all things are right
    //this.selectedCategory = this.db.selectedCategory;
    this.totalWordPoint = (this.allSelectedWordIDs.length) * this.correctThreshold;
    this.masteredWordPoint = 0;
    this.nonMasteredWordIds = []; // list of Ids to be shown in the practise now.
    this.seenWordCount = 0;
    for (let onewordsID of this.allSelectedWordIDs) {
      let oneWordDynamicData = this.wordDynamicData[onewordsID];
      if (oneWordDynamicData && oneWordDynamicData['isMastered']) { // to avoid error in case the category is null
        this.masteredWordPoint = this.masteredWordPoint + this.correctThreshold;
      }
      else {
        if (!oneWordDynamicData) {
          this.wordDynamicData[onewordsID] = {}
          oneWordDynamicData = this.wordDynamicData[onewordsID];
          oneWordDynamicData['isMastered'] = false;
          oneWordDynamicData['correctCount'] = 0;
        }
        this.nonMasteredWordIds.push(onewordsID);
      }


      if (this.wordDynamicData[onewordsID]['isSeen']) {
        this.seenWordCount++;

      }
    }
    if (this.nonMasteredWordIds.length == 0) {
      this.isAllWordMastered = true;
      return;
    }
    this.onDynamicDataChange();
    this.getInitialWordList();
    //this.next(); 
  }


  getInitialWordList() {
    this.randomizedWordIDsList = []; // remove all previous
    let size = this.nonMasteredWordIds.length;
    if (size > 5) size = 5;  // to set the max in case the total word length is less than 5
    if (size < 2) size = 2;
    for (let i = 0; i < size; i++) {
      let next = this.next();
      if (next) this.randomizedWordIDsList.push(next); // will come null if the word is mastered still a buffer of 5 will remain
    }
    this.selectedId = this.randomizedWordIDsList[0]; // first element will be shown first    
    this.isData1Ready = true;
  }




  toggleMeaning() {
    this.isToShowMeaning = !this.isToShowMeaning;
  }



  changeMark(event) {
    let newMark = event.newMark;
    let wordId = event.wordId;
    this.toggleMeaning();
    if (newMark) {

      this.wordDynamicData[wordId]["isMarked"] = true;
    }
    else {

      this.wordDynamicData[wordId]["isMarked"] = false;
    }
    this.onDynamicDataChange();
  }

  onDynamicDataChange() {
    this.db.saveCurrentStateofDynamicData(); // the data is directly access from the service so only need to be saved in localstorage
  }



  next() {
    if (this.nonMasteredWordIds.length == 0) {
      this.isAllWordMastered = true;
      return;
    }
    this.isToShowMeaning = false;
    let nextIdIndex: number = this.getRndInteger(0, this.nonMasteredWordIds.length)
    this.selectedId = this.nonMasteredWordIds[nextIdIndex];
    if (!this.selectedId) {
      this.next(); // to send back if there is a null
    }

    return this.nonMasteredWordIds[nextIdIndex];


  }

  // will give in range [min, max)
  getRndInteger(min = 0, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


  userResponse2(event) {
    let type = 0;
    if (event.choice) {
      type = 1;
    }
    else {
      type = -1
    }
    this.userResponse(type, event.wordID);
    this.randomizedWordIDsList.push(this.next()); // we are not modifying the original list so word may appear again and again only when the useResponse remove them they will change
    this.selectedId = this.randomizedWordIDsList[1]; // new Word will be this from the child component logic
  }



  userResponse(type: number, wordID?) {
    if (wordID) {
      this.selectedId = wordID;
    }

    if (!this.selectedId || !this.selectedCategory) {
      this.next();
      return;
    }
    if (this.allSelectedWordIDs.length == 0) {
      this.isAllWordMastered = true;
      return;
    }

    let oneWordDynamicData = this.wordDynamicData[this.selectedId]  // will never be null always make sure to start this
    let correctCount = oneWordDynamicData['correctCount'];

    if (type == 1) {
      oneWordDynamicData['correctCount']++;
      this.masteredWordPoint = this.masteredWordPoint + 1;
    }
    if (type == 0) {
      oneWordDynamicData['correctCount'] = correctCount - 2;
      this.masteredWordPoint = this.masteredWordPoint - 2;
    }
    if (type == -1) {
      this.masteredWordPoint = this.masteredWordPoint - oneWordDynamicData['correctCount']
      oneWordDynamicData['correctCount'] = 0; // restart the word
    }

    /// let's sanitize the result

    if (oneWordDynamicData['correctCount'] >= this.correctThreshold) {
      oneWordDynamicData['isMastered'] = true;
      this.wordDynamicData[this.selectedId]['isMastered'] = true;
      let index = this.nonMasteredWordIds.indexOf(this.selectedId);
      if (index || index == 0) {
        this.nonMasteredWordIds.splice(index, 1)
      }
      this.presentToast(this.allWordsData[this.selectedId][1])
    }

    if (oneWordDynamicData['correctCount'] < 0) {
      this.masteredWordPoint = this.masteredWordPoint + (0 - oneWordDynamicData['correctCount']);// increase by the same factor mijnus but count is negative
      oneWordDynamicData['correctCount'] = 0;
    }

    this.onDynamicDataChange();
    //this.next();

  }


  async presentToast(Word) {
    const toast = await this.toastController.create({
      message: 'Word Mastered :     ' + Word,
      duration: 2000
    });
    toast.present();
  }

}
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import domtoimage from 'dom-to-image';
@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit {




  allSelectedWordIDs: string[];
  public wordDynamicData: any; // this always need to in synced with the stored data;
  allWordsData: any;
  selectedId = '3'; // randomly setting it to avoid error


  allWordOfSets: any;
  selectedIDsDynamicData: any; // of type wordAppData
  url: any = {};
  activeURL = 0;
  isToShowDetails: boolean = false;
  isSafeUrlReady: boolean = true;
  isAllWordMastered: boolean = false;
  @ViewChild('container', { static: false }) container;


  tabBars: any = ["https://www.google.com/search?igu=1&ei=&q=define+",
    "https://www.merriam-webster.com/dictionary/",
    "https://www.freethesaurus.com/"];
  tabBarsKeys = ['Google',
    'Merriam',
    'FreeThesaurus'];
  previousWordsIds = [];
  nextWordsIds = [] // this will be used when user go tp previous and click next



  constructor(private db: DatabaseService, private route: ActivatedRoute, public sanitizer: DomSanitizer) {

  }

  noSelectedData() {
    this.isAllWordMastered = true;
  }
  ngOnInit() {

    this.allSelectedWordIDs = this.db.allSelectedWordFiltered;
    console.log(this.allSelectedWordIDs);
    this.wordDynamicData = this.db.wordsDynamicData;
    this.allWordsData = this.db.allWordsData;

    if (this.allSelectedWordIDs.length == 0) {
      this.isAllWordMastered = true;
    }
    this.route.paramMap.subscribe(params => {
      if (params.get('wordId')) {
        this.selectedId = params.get('wordId');
      }
      else if (this.allSelectedWordIDs.length != 0) {
        this.selectedId = this.allSelectedWordIDs[0]; // starting with the first word if no wordid is given in url
      }
    });
  }



  getSafeUrl(type?) {

    if (type == 1 && this.url[this.tabBarsKeys[this.activeURL]]) {
      return; // the event is coming from the tab changed and the url is already existing then don't repeat it.
    }
    let word = this.allWordsData[this.selectedId][1]
    this.url[this.tabBarsKeys[this.activeURL]] = this.sanitizer.bypassSecurityTrustResourceUrl(this.tabBars[this.activeURL] + word);
    this.isSafeUrlReady = true;
    this.afterFrameAppear();
  }

  shareButtonClone() {
    domtoimage.toPng(this.container.nativeElement)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  onDynamicDataChange(setName?, wordId?, isToAdd?) {
    if (setName && wordId) {
      this.db.editWordIdInDynamicSet(setName, wordId, isToAdd);
    }
    this.db.saveCurrentStateofDynamicData(); // the data is directly access from the service so only need to be saved in localstorage
  }


  async afterWordAppear() {
    await new Promise(resolve => setTimeout(resolve, 2 * 1000));
    this.changeSeen(1, this.selectedId);
  }

  async afterFrameAppear() {
    await new Promise(resolve => setTimeout(resolve, 2 * 1000))
    this.onLoad();
  }


  changeMark(newMark, wordId) {
    this.wordDynamicData[wordId]["isMarked"] = newMark
    this.onDynamicDataChange("allMarked", wordId, newMark);
  }

  changeSeen(newMark, wordId) {
    this.wordDynamicData[wordId]["isSeen"] = newMark;
    this.onDynamicDataChange("allViewed", wordId, newMark);
  }


  previous() {
    if (this.previousWordsIds.length == 0) {
      this.db.presentToast("No Previous Word Found!!")
      return;
    }

    this.nextWordsIds.push(this.selectedId); // remove so that next previous will be different
    this.selectedId = this.previousWordsIds[this.previousWordsIds.length - 1];
    let Idtrimmed = this.previousWordsIds.splice(this.previousWordsIds.length - 1, 1);
    this.getSafeUrl();
    this.afterWordAppear();
  }


  next() {
    this.previousWordsIds.push(this.selectedId);

    if (this.nextWordsIds.length != 0) {
      this.selectedId = this.nextWordsIds[this.nextWordsIds.length - 1];
      this.nextWordsIds.splice(this.nextWordsIds.length - 1, 1);

    }
    else {
      let nextIdIndex: number = this.getRndInteger(0, this.allSelectedWordIDs.length)
      let selectedIdIndex = nextIdIndex;
      this.selectedId = this.allSelectedWordIDs[selectedIdIndex];

    }

    this.getSafeUrl();
    this.afterWordAppear();
  }

  // Rang = [min, max)
  getRndInteger(min = 0, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  onTabChanged(event) {
    this.activeURL = event.index;
    this.getSafeUrl();// 1
  }
  onLoad() {
    let docs = document.getElementById('loadImg')
    if (docs) docs.style.display = 'none';
  }

}

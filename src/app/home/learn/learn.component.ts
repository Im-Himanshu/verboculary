import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';
import { SharingServiceService } from '../services/sharing-service.service'
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { wordToIdMap } from '../../wordToId'
import { Router } from '@angular/router';



import domtoimage from 'dom-to-image';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Screenshot } from '@ionic-native/screenshot/ngx';
@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit {

  @ViewChild("container", { static: false, read: ElementRef }) container: ElementRef;
  selectedSet: string;

  allSelectedWordIDs: number[];
  public wordDynamicData: any; // this always need to in synced with the stored data;
  allWordsData: any;
  selectedId: number = 3; // randomly setting it to avoid error
  allWordOfSets: any;
  selectedIDsDynamicData: any; // of type wordAppData
  url: any = {};
  activeURL = 0;
  isToShowDetails: boolean = false;
  isSafeUrlReady: boolean = true;
  isAllWordMastered: boolean = false;
  foundIDMapping = {};
  wordToIdMap: any = wordToIdMap;

  tabBars: any = ["https://www.google.com/search?igu=1&ei=&q=define+",
    "https://www.merriam-webster.com/dictionary/",
    "https://www.freethesaurus.com/"];
  tabBarsKeys = ['Google',
    'Merriam',
    'FreeThesaurus'];
  previousWordsIds = [];
  nextWordsIds = [] // this will be used when user go tp previous and click next

  img = [];
  images: any;



  constructor(private screenshot: Screenshot, private db: DatabaseService, private route: ActivatedRoute, public sanitizer: DomSanitizer, public shareService: SharingServiceService, private router: Router) {

    this.selectedSet = this.db.selectedSet;

  }

  noSelectedData() {
    this.isAllWordMastered = true;
  }
  ngOnInit() {

    this.allSelectedWordIDs = this.db.allSelectedWordIdsFiltered;
    // console.log(this.allSelectedWordIDs);
    this.wordDynamicData = this.db.wordsDynamicData;
    this.allWordsData = this.db.allWordsData;

    if (this.allSelectedWordIDs.length == 0) {
      this.isAllWordMastered = true;
    }
    this.route.paramMap.subscribe(params => {
      if (params.get('wordId')) {
        try {
          this.selectedId = parseInt(params.get('wordId'))
        }
        catch (e) {
          console.error(e)
        }
      }
      else if (this.allSelectedWordIDs.length != 0) {
        this.selectedId = this.allSelectedWordIDs[0]; // starting with the first word if no wordid is given in url
      }
      this.afterWordAppear();
      this.getSafeUrl();
    });
    // console.log(this.allWordsData[this.selectedId],this.wordDynamicData[this.selectedId]);

  }
  stopParentProp(event) {
    event.stopPropagation();
  }

  onScreenShot(event) {
    console.log(this.screenshot)
    this.screenshot.URI(80).then(res => {
      // console.log(res.URI);
      //only works on android
      this.shareService.onShareImage(res.URI);
    })
  }

  selectId(syn) {
    let crntIndex = this.allSelectedWordIDs.indexOf(this.selectedId); // will be -1 if not availaible and move on to next
    if (crntIndex != -1) {
      this.previousWordsIds.push(this.selectedId);
    }
    this.selectedId = this.wordToIdMap[syn];
  }

  goToUrl(syn) {

    this.selectedId = this.wordToIdMap[syn]

    //this.router.navigate(['/mainmodule/base/wordSets/' + this.db.selectedSet + '/learn/' + this.wordToIdMap[syn]]);
    // console.log('/mainmodule/base/wordSets/' + this.viewType + '/' + wordToIdMap[syn])
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
        console.log(dataUrl);
        document.body.appendChild(img);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  socialShare(event) {
    this.shareService.shareImageViaScreenshot(this.container);
  }

  async afterWordAppear() {
    await new Promise(resolve => setTimeout(resolve, 2 * 1000));
    this.changeSeen(true, this.selectedId);
  }

  async afterFrameAppear() {
    await new Promise(resolve => setTimeout(resolve, 2 * 1000))
    this.onLoad();
  }


  changeMark(newState, wordId) {
    this.db.changeWordIdState(wordId, 'isMarked', newState);
  }

  changeSeen(newState: boolean, wordId) {
    this.db.changeWordIdState(wordId, 'isViewed', newState)
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
    let crntIndex = this.allSelectedWordIDs.indexOf(this.selectedId); // will be -1 if not availaible and move on to next
    if (crntIndex != -1) {
      this.previousWordsIds.push(this.selectedId);
    }
    else if (this.selectedId != null) {
      if (this.previousWordsIds.length != 0) {
        crntIndex = this.previousWordsIds[this.previousWordsIds.length - 1]; // select the second last from the set
        // because it was starting from beginning everytime their is a synonyms checked
      }
    }
    if (this.nextWordsIds.length != 0) {
      this.selectedId = this.nextWordsIds[this.nextWordsIds.length - 1];
      this.nextWordsIds.splice(this.nextWordsIds.length - 1, 1);

    }
    else {
      let nextIdIndex: number = crntIndex + 1// this.getRndInteger(0, this.allSelectedWordIDs.length)
      if (nextIdIndex > this.allSelectedWordIDs.length) {
        console.log("word list completed, click next to go through it again")
      }
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

  startP(wordId, playNext) {
    if (!this.db.isPlaying) {
      this.db.startPodcast(wordId, playNext)
    } else {
      this.db.closePodcast();
      this.db.startPodcast(wordId, playNext);
    }
  }

}

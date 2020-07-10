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

  @ViewChild('container',{static: false}) container;

  shareButtonClone(){
    domtoimage.toPng(this.container.nativeElement)
    .then(function(dataUrl){
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    })
    .catch(function(error){
      console.log(error);
    })
  }

  allWordOfSets : any;
  allSelectedWordIDs: string[];
  allWordDetails : any;
  isData1Ready : boolean = false;
  isData2Ready : boolean = false;
  selectedId = '3'; // randomly setting it to avoid error
  isToShowAll : boolean = false;
  selectedIDsDynamicData : any; // of type wordAppData
  url : any = {};
  activeURL = 0;
  isToShowDetails : boolean = false;
  isSafeUrlReady : boolean = true;
  isAllWordMastered : boolean = false;

  tabBars : any = ["https://www.google.com/search?igu=1&ei=&q=define+",
                  "https://www.merriam-webster.com/dictionary/",
                  "https://www.freethesaurus.com/" ];
  tabBarsKeys = ['Google',
                  'Merriam',
                  'FreeThesaurus' ];
  previousWordsIds = [];
  nextWordsIds = [] // this will be used when user go tp previous and click next



  constructor(private db : DatabaseService, private route: ActivatedRoute,public sanitizer: DomSanitizer) {
    this.db.wordListChangeEvent.asObservable().subscribe(data=>{  // data will be the list of sets  // here data will be the list of sets selected on the screen I have to fetch all the owrds to be shown in this// if it comes here before the actual event it will be publis
      if(data){
        this.fetchSelectedIdfromService();
        this.previousWordsIds= [];
        this.nextWordsIds = [];
       }
    });
    this.db.fetchingWordDataCompleted.asObservable().subscribe(data=>{
      if(data){
        this.fetchallWordsFromService()
      }
    })
  // in case the data has already been published then go for it in starting
    if(this.db.allWordsData){
      this.fetchallWordsFromService();
    }
    if(this.db.allSelectedWordIDs){
      this.fetchSelectedIdfromService();
    }

   }

   noSelectedData(){
    this.isAllWordMastered = true;
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if(params.get('wordId')){
       this.selectedId = params.get('wordId');
      }
   });
   }

  fetchSelectedIdfromService(){
      this.allSelectedWordIDs = this.db.filteredSelectedWordIds; // set the selected IDs everytime it has been changed there
      this.allWordDetails = this.db.allWordsData;
      this.fetchselectedIdsDynamicData();
      if(!this.allSelectedWordIDs || this.allSelectedWordIDs.length == 0){
        this.noSelectedData()
        return;
      }
      this.isAllWordMastered = false;
      this.next();
  }

  fetchallWordsFromService(){
    this.allSelectedWordIDs = this.db.filteredSelectedWordIds; // set the selected IDs everytime it has been changed there
    this.allWordDetails = this.db.allWordsData;
    this.isData2Ready = true;
  }
  fetchselectedIdsDynamicData(){
    this.selectedIDsDynamicData = this.db.getMultipleWordsState(this.allSelectedWordIDs);
    this.isData1Ready = true;

  }

  getSafeUrl(type?) {

    if(type == 1 && this.url[this.tabBarsKeys[this.activeURL]] ){
      return; // the event is coming from the tab changed and the url is already existing then don't repeat it.
    }
    let word = this.allWordDetails[this.selectedId][1]
    this.url[this.tabBarsKeys[this.activeURL]] = this.sanitizer.bypassSecurityTrustResourceUrl(this.tabBars[this.activeURL] + word);
    this.isSafeUrlReady = true;
    this.afterFrameAppear();
  }

  onDynamicDataChange(){
    this.db.saveCurrentStateofDynamicData(); // the data is directly access from the service so only need to be saved in localstorage
  }


  async afterWordAppear(){
    await new Promise( resolve => setTimeout(resolve, 2*1000) );
    this.changeSeen(1, this.selectedId);
  }

  async afterFrameAppear(){
    await new Promise(resolve => setTimeout(resolve, 2*1000))
    this.onLoad();
  }


  changeMark(newMark, wordId){
    if(newMark) {

    this.selectedIDsDynamicData[wordId]["isMarked"] = true;
    }
    else{

      this.selectedIDsDynamicData[wordId]["isMarked"] = false;
    }
    this.onDynamicDataChange();
  }

  changeSeen(newMark, wordId){
    if(newMark) {

    this.selectedIDsDynamicData[wordId]["isSeen"] = true;
    }
    else{

      this.selectedIDsDynamicData[wordId]["isSeen"] = false;
    }
    this.onDynamicDataChange();
  }


  previous(){
    if(this.previousWordsIds.length == 0) {
      this.db.presentToast("No Previous Word Found!!")
      return;
    }

    this.nextWordsIds.push(this.selectedId); // remove so that next previous will be different
    this.selectedId = this.previousWordsIds[this.previousWordsIds.length-1];
    let Idtrimmed = this.previousWordsIds.splice(this.previousWordsIds.length-1,1);
    this.getSafeUrl();
    this.afterWordAppear();
  }


  next(){
    this.previousWordsIds.push(this.selectedId);

    if(this.nextWordsIds.length != 0 ){
      this.selectedId = this.nextWordsIds[this.nextWordsIds.length-1];
      this.nextWordsIds.splice(this.nextWordsIds.length-1,1);

    }
    else{
      let nextIdIndex : number = this.getRndInteger(0,this.allSelectedWordIDs.length)
      let selectedIdIndex = nextIdIndex;
      this.selectedId = this.allSelectedWordIDs[selectedIdIndex];

    }

    this.getSafeUrl();
    this.afterWordAppear();
  }

 // Rang = [min, max)
  getRndInteger(min = 0, max) {
    return Math.floor(Math.random() * (max - min ) ) + min;
  }

  onTabChanged(event){
    this.activeURL = event.index;
    this.getSafeUrl();// 1
  }
onLoad(){
  let docs = document.getElementById('loadImg')
  if(docs)  docs.style.display='none';
}

}

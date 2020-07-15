import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';
import { SearchService } from '../services/search.service'
import { wordToIdMap } from '../../wordToId';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  wordlist = null;
  selectedSorting: string = "shuffel";
  selectedFilter: string = "all"
  id = wordToIdMap;
  allSelectedWordIDs: string[];
  allWordsData: any;
  wordsDynamicData: any;
  isWordopen: any = {}; // {id:boolean}
  isToTakeNote: any = {};
  wordState: any = {}; // save isOpen, isToShowNote
  wordArray: any[];
  sortedAllSelectedWordIds: string[] = [];
  sortingTypes = [
    { value: 'shuffel', viewValue: 'Shuffeled' },
    { value: 'alpha', viewValue: 'Alphabetical' },
  ];
  filterTypes = [
    { value: 'all', viewValue: 'All' },
    { value: 'viewed', viewValue: 'Viewed' },
    { value: 'marked', viewValue: 'Marked' }
  ]
  constructor(private db: DatabaseService, public searchService: SearchService) {
    this.allSelectedWordIDs = this.db.allSelectedWordFiltered;
    this.allWordsData = this.db.allWordsData;
    this.wordsDynamicData = this.db.wordsDynamicData;
  }

  ngOnInit() {
    this.wordArray = this.searchService.convertWordMapToArray();
    this.db.recoverValues();
    console.log(this.wordArray);
    let stringList: string[] = [];
    for(var i = 0; i<this.allSelectedWordIDs.length; i++){
      stringList.push(this.allWordsData[this.allSelectedWordIDs[i]][1]);
    }
    stringList.sort(function(a,b){
      if(a>b){
        return 1;
      }
      if(a<b){
        return -1;
      }
      return 0;
    })
    for(var i = 0; i<stringList.length; i++){
      this.sortedAllSelectedWordIds.push(this.id[stringList[i]]);
    }
    // this.allSelectedWordIDs = this.sortedAllSelectedWordIds;
    // console.log(this.sortedAllSelectedWordIds);

  }

  ngOnDestroy() {
    this.saveDynamicData();
  }

  saveDynamicData() {
    this.db.saveCurrentStateofDynamicData(); // the data is directly access from the service so only need to be saved in localstorage
  }

  onWordClickToggleit(wordId: any) {
    if (!this.isWordopen[wordId]) {
      this.isWordopen[wordId] = false;

    }
    this.isWordopen[wordId] = !this.isWordopen[wordId];
    event.stopPropagation();
  }

  takeNoteToggle(event, wordId: any) {
    if (!this.isToTakeNote[wordId]) {
      this.isToTakeNote[wordId] = false;
    }
    this.isToTakeNote[wordId] = !this.isToTakeNote[wordId];
    event.stopPropagation();
  }

  toggleBookMark(event, wordId: any) {

    this.wordsDynamicData[wordId]['isMarked'] = !this.wordsDynamicData[wordId]['isMarked'];
    this.db.editWordIdInDynamicSet("allMarked", wordId, this.wordsDynamicData[wordId]['isMarked']);
    event.stopPropagation();
    this.saveDynamicData();

  }



  changeFilter(event) {

    this.selectedSorting = "shuffel";
    if(event.value == "marked"){
      this.db.recoverValues();
      this.db.markedFilter();
      console.log("marked");
    }
    else if(event.value == "viewed"){
      this.db.recoverValues();
      this.db.viewedAllWordsOfSelectedSet();
    }
    else{
      this.db.recoverValues();
    }

  }
  changeSorting(event) {
    if(event.value == "alpha"){
      this.db.sortAllWordsOfSelectedSet();
    }

    else{
      this.db.shuffleAllWordsOfSelectedSet();
    }
    // this.allSelectedWordIDs = this.db.sortAllWordsOfSelectedSet();

    //switch the object to sorted object

  }
}

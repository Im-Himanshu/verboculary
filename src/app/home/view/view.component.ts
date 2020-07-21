import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';
import { SearchService } from '../services/search.service'
import { wordToIdMap } from '../../wordToId';
import { AppRateService } from '../services/app-rate.service';
import { AdmobSerService } from '../services/admob-ser.service';


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
  selectedSet;
  shuffleIt = true;

  sortingTypes = [
    { value: 'shuffel', viewValue: 'Shuffeled' }, // default state
    { value: 'alpha', viewValue: 'Alphabetical' },
  ];
  filterTypes = [
    { value: 'all', viewValue: 'All' },
    { value: 'viewed', viewValue: 'Viewed' },
    { value: 'marked', viewValue: 'Marked' }
  ]
  constructor(private db: DatabaseService, public searchService: SearchService,private apprate : AppRateService,private admob : AdmobSerService) {
    this.allSelectedWordIDs = this.db.allSelectedWordIdsFiltered;
    // console.log(this.allSelectedWordIDs);
    this.allWordsData = this.db.allWordsData;
    this.wordsDynamicData = this.db.wordsDynamicData;

    this.selectedSet = this.db.selectedSet;
    this.admob.showBannerAdd();
    this.apprate.showAppRate();
  }

  ngOnInit() {
    this.wordArray = this.searchService.convertWordMapToArray();
    //this.db.changeSortingOfIds("alpha")

  }

  ngOnDestroy() {
    this.saveDynamicData();
  }

  saveDynamicData() {
    this.db.saveCurrentStateofDynamicData(); // the data is directly access from the service so only need to be saved in localstorage
  }

  changeFilter(event) {
    this.db.filterSelectedIDBasedOnGivenCriterion(event.value);
    this.selectedSorting = "shuffel";
  }

  shuffleButton(event) {
    this.shuffleIt = !this.shuffleIt;
    this.db.changeSortingOfIds(event.currentTarget.attributes.value.nodeValue);
  }
  changeSorting(event) {
    this.db.changeSortingOfIds(event.value)
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

  start(wordId, playNext) {
    this.db.startPodcast(wordId, playNext);
  }
}

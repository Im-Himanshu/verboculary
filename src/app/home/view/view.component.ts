import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';
import { SearchService } from '../services/search.service'
import { wordToIdMap } from '../../wordToId';
import { AppRateService } from '../services/app-rate.service';
import { AdmobSerService } from '../services/admob-ser.service';
import { PodcastService } from '../services/podcast.service'


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
  constructor(public db: DatabaseService, public searchService: SearchService, private apprate: AppRateService, private admob: AdmobSerService, public podcast : PodcastService) {
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
    //this.saveDynamicData();
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
    // this function will handle all the complexity inside this
    this.db.changeWordIdState(wordId, 'isMarked', !this.wordsDynamicData[wordId]['isMarked']);
    event.stopPropagation();
  }

  start(wordId, playNext) {
    if (this.podcast.player) {
      this.podcast.tooglePlayer(!this.podcast.onPause)
    }
    else if (!this.podcast.isPlaying) {
      this.podcast.startPodcast(wordId, playNext);
    }
    else {
      this.podcast.pause()
    }
  }

  startP(wordId, playNext) {
    if (!this.podcast.player) {
      this.podcast.startPodcast(wordId, playNext);
    } else if (this.podcast.currId == wordId){
      this.podcast.tooglePlayer(!this.podcast.onPause);
    } else if(this.podcast.currId != wordId){
      this.podcast.player.stop();
      this.podcast.startPodcast(wordId, playNext);
    } else {
      this.podcast.closePodcast();
    }
  }
}

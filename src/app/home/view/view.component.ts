import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';
import { wordToIdMap } from '../../wordToId';
import { AdmobSerService } from '../services/admob-ser.service';
import { PodcastService } from '../services/podcast.service'
import { appNameToUINameMapping } from "../interfaces/wordAppData.interface"
import { BehaviorSubject, Observable } from 'rxjs';



@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
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
  isToLoadWord = false;
  //wordDataObservable = new BehaviorSubject([]);
  nameTrackFn = (_: number, item: string) => item; // will update the viewport only if the item inside is updated not the whole object is checked 
  private _startLoadingWordDataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public startLoadingWordDataObs: Observable<boolean> = this._startLoadingWordDataSubject.asObservable();/* learning for ngFor loop optimization 


https://blog.angular-university.io/angular-2-ngfor/  /// using track by
https://blog.bitsrc.io/3-ways-to-render-large-lists-in-angular-9f4dcb9b65 
https://stackoverflow.com/questions/47474743/ngif-not-updating-when-variable-changes
https://grokonez.com/frontend/angular/angular-7/angular-7-virtual-scroll-example-angular-material-cdk




*/


  sortingTypes = [
    { value: 'shuffel', viewValue: 'Shuffeled' }, // default state
    { value: 'alpha', viewValue: 'Alphabetical' },
  ];
  filterTypes = [
    { value: 'all', viewValue: 'All' },
    { value: 'viewed', viewValue: 'Viewed' },
    { value: 'marked', viewValue: 'Marked' }
  ]
  constructor(public db: DatabaseService, private admob: AdmobSerService, public podcast: PodcastService) {
    this.allSelectedWordIDs = this.db.allSelectedWordIdsFiltered;
    this.allWordsData = this.db.allWordsData;
    this.wordsDynamicData = this.db.wordsDynamicData;
    this.selectedSet = this.db.selectedSet;
    this.admob.showBannerAdd();
  }

  ngOnInit() {
    //this.db.changeSortingOfIds("alpha")
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.isToLoadWord = true;
      this._startLoadingWordDataSubject.next(this.isToLoadWord)
      /*Your Code*/
    }, 500);
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
    //this.allSelectedWordIDs.splice(0, this.allSelectedWordIDs.length);
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

  togglePlaying(wordId, isToPlayAll?) {
    if (this.podcast.isPlayerPlaying) {
      if (this.podcast.currId == wordId) {
        this.podcast.playPauseGivenId(wordId, false, isToPlayAll) // pause the current id
      }
      else {
        // will play a given new word...
        this.podcast.playPauseGivenId(wordId, true, isToPlayAll)
      }
    }
    else {
      // if player is not playing then play it
      this.podcast.playPauseGivenId(wordId, true, isToPlayAll)
    }
  }


}

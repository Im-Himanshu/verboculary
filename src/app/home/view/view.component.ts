import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  wordlist = null;
  selectedSorting: string = "alpha";
  selectedFilter: string = "all"


  allSelectedWordIDs: string[];
  allWordsData: any;
  wordsDynamicData: any;
  isWordopen: any = {}; // {id:boolean}
  isToTakeNote: any = {};
  wordState: any = {}; // save isOpen, isToShowNote


  sortingTypes = [
    { value: 'alpha', viewValue: 'Alphabetical' },
    { value: 'shuffel', viewValue: 'Shuffeled' }
  ];
  filterTypes = [
    { value: 'all', viewValue: 'All' },
    { value: 'viewed', viewValue: 'Viewed' },
    { value: 'marked', viewValue: 'Marked' }
  ]
  constructor(private db: DatabaseService) {
    this.allSelectedWordIDs = this.db.allSelectedWordIds;
    this.allWordsData = this.db.allWordsData;
    this.wordsDynamicData = this.db.wordsDynamicData;


  }

  ngOnInit() { }

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
    event.stopPropagation();
    this.saveDynamicData();

  }
  changeFilter(event) {
    console.log("Filter Changed")

  }
  changeSorting(event) {
    console.log("sorting chnaged")

  }



}

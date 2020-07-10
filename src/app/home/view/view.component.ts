import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  wordlist = null;
  selectedSorting: string = "alpha";
  selectedFilter: string = "all"


  sortingTypes = [
    { value: 'alpha', viewValue: 'Alphabetical' },
    { value: 'shuffel', viewValue: 'Shuffeled' }
  ];
  filterTypes = [
    { value: 'all', viewValue: 'All' },
    { value: 'viewed', viewValue: 'Viewed' },
    { value: 'marked', viewValue: 'Marked' }
  ]
  constructor() {

    this.wordlist = [
      { word: "First", meaning: "a very very very long text goes here so that we can see how it wraps with the other element", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Second", meaning: "Second's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Third", meaning: "Third's meaning", isOpen: false, isToTakeNote: false, isBookMarked: false },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true },
      { word: "Fourth-last", meaning: "Fourth's meaning", isOpen: false, isToTakeNote: false, isBookMarked: true }
    ]
  }

  ngOnInit() { }

  onWordClickToggleit(word: any) {
    word.isOpen = !word.isOpen;
  }

  takeNoteToggle(event, word: any) {
    word.isToTakeNote = !word.isToTakeNote;
    event.stopPropagation();
  }

  toggleBookMark(event, word: any) {
    word.isBookMarked = !word.isBookMarked
    event.stopPropagation();

  }
  changeFilter(event) {
    console.log("Filter Changed")

  }
  changeSorting(event) {
    console.log("sorting chnaged")

  }



}

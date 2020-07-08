import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  wordlist = null
  constructor() {

    this.wordlist = [
      { word: "first", meaning: "first's meaning", isOpen: false },
      { word: "Second", meaning: "Second's meaning", isOpen: false },
      { word: "Third", meaning: "Third's meaning", isOpen: false },
      { word: "Fourth", meaning: "Fourth's meaning", isOpen: false }
    ]
  }

  ngOnInit() { }

  onWordClickToggleit(word: any) {
    word.isOpen = !word.isOpen;
  }



}

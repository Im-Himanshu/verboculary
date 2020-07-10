import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-word-sets',
  templateUrl: './word-sets.component.html',
  styleUrls: ['./word-sets.component.scss'],
})
export class WordSetsComponent implements OnInit {


  // here we will implement slides and 

  viewType = "view"//0, 1, 2 view, learn, test; // default is set to view
  selectedSet;
  selectedWordId;

  constructor(private route: ActivatedRoute) {

    this.route.paramMap.subscribe(params => {
      if (params.get('setName')) {
        this.selectedSet = params.get('setName');
      }
      if (params.get('viewType')) {
        this.viewType = params.get('viewType');
      }
      if (params.get('wordId')) {
        this.selectedWordId = params.get('wordId');
      }
    });



  }

  ngOnInit() { }

}

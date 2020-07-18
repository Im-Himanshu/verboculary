import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from "../services/data-base.service";
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';

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

  isDataReady = false;
  activeTabIndex = 0;

  constructor(private route: ActivatedRoute, private db: DatabaseService,
    private router: Router) {

    router.events.forEach((event: NavigationEvent) => {
      //After Navigation, because firstchild are populated only till navigation ends
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.isDataReady = true; // let the service fetch the set data 
        }, 500)
      }
    });

    this.route.paramMap.subscribe(params => {
      if (params.get('viewType')) {
        this.viewType = params.get('viewType');
        this.setSpecificView();
      }
      if (params.get('setName')) {
        this.selectedSet = params.get('setName');
      }
      if (params.get('wordId')) {
        this.selectedWordId = params.get('wordId');
      }

    })

  }

  setSpecificView() {
    if (this.viewType == 'view') {
      this.activeTabIndex = 0;
    }
    if (this.viewType == 'learn') {
      this.activeTabIndex = 1;
    }
    if (this.viewType == 'test') {
      this.activeTabIndex = 2;
    }
  }

  ngOnInit() {
  }

}

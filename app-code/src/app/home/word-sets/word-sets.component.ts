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
  activeTabIndex = 0;
  currentPosition;
  height;
  minimumThreshold;
  startPosition;
  isOpen = false;
  chartLabelsAndData = null;
  isChartDataReady = false;
  selectedFilter = 'all';
  FabButtonVisible: boolean = true;

  constructor(private route: ActivatedRoute, public db: DatabaseService,
    private router: Router) {

    this.selectedFilter = this.db.selectedFilter;
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

  filterButton(filterType) {
    //console.log(filterType);
    this.db.selectedFilter = filterType;
    this.db.filterSelectedIDBasedOnGivenCriterion(filterType);
  }

  setSpecificView() {
    if (this.viewType == 'view') {
      //search icon
      this.activeTabIndex = 0;
    }
    if (this.viewType == 'learn') {
      //search icon shrink
      this.activeTabIndex = 1;
      this.FabButtonVisible = false;
    }
    if (this.viewType == 'test') {
      //search icon shrink
      this.activeTabIndex = 2;
      this.FabButtonVisible = false
    }
  }

  ngOnInit() {
    console.log("demo")
    this.processChartData();
  }

  ngOnDestroy() {
    //this.db.selectedSet = "allWords"; // doing this cause a major descpripency as the 
    this.db.isToRemoveCompleteSearch = false; // reset this one
    this.db.isToShowSearchBar = false;
    this.db.runSyncOperationForSetLevelOperation(); // this will generate the report after the view ends for the selected set
    this.db.saveCurrentStateofDynamicData()
    //this.db.selectedFilter = 'all'
  }



  processChartData() {

    return new Promise((resolve, reject) => {

      if (this.chartLabelsAndData != null) {
        resolve(true);
        this.isChartDataReady = true;
        return;
      }

      let allSelectedWordsId = this.db.allSetData.allWordOfSets[this.selectedSet];
      let individualViewedDate = []
      let individualLearnedDate = []
      for (let oneId of allSelectedWordsId) {
        let oneWordDynamicData = this.db.wordsDynamicData[oneId];
        if (oneWordDynamicData["viewedDate"] != null) {
          individualViewedDate.push(oneWordDynamicData["viewedDate"])
        }
        if (oneWordDynamicData["learnedDate"] != null) {
          individualLearnedDate.push(oneWordDynamicData["learnedDate"])
        }
      }
      individualLearnedDate.sort(this.db.sortDates);
      individualViewedDate.sort(this.db.sortDates);
      let totalLearningOnDate = {}
      let totalViewedOnDate = {}
      let i = 1;
      for (let oneDate of individualViewedDate) {
        totalViewedOnDate[oneDate] = i;
        i++
      }
      let j = 1;
      for (let oneDate of individualLearnedDate) {
        totalLearningOnDate[oneDate] = j;
        j++
      }

      let allDates = individualLearnedDate.concat(individualViewedDate)
      allDates.sort(this.db.sortDates);

      let lastViewedCount = 0
      let lastLearnedCount = 0;
      this.chartLabelsAndData = {};
      let chartLabelsAndData = this.chartLabelsAndData;
      let existingDatewithoutSecond = {}
      for (let oneDate of allDates) {
        let oneDataPoint = {}

        if (totalViewedOnDate[oneDate] != null) {
          oneDataPoint["viewed"] = totalViewedOnDate[oneDate];
          lastViewedCount = totalViewedOnDate[oneDate];
        }
        else {
          oneDataPoint["viewed"] = lastViewedCount;
        }
        if (totalLearningOnDate[oneDate] != null) {
          oneDataPoint["learned"] = totalLearningOnDate[oneDate];
          lastLearnedCount = totalLearningOnDate[oneDate];
        }
        else {
          oneDataPoint["learned"] = lastLearnedCount;
        }

        // because oneDate will be in increasing order so will be keeping only the latest one if seconds is the only difference
        //let oneDate : string
        let date = new Date(oneDate);
        let hours: string = "" + date.getHours();
        if (hours.length <= 1) {
          hours = "0" + hours; // adding a trailing zero for single digit as it is causing shorting issues 
        }
        let minutes = "" + date.getMinutes();
        if (minutes.length <= 1) {
          minutes = "0" + minutes;
        }
        oneDate = date.toLocaleDateString() + ", " + hours + ":" + minutes;
        chartLabelsAndData[oneDate] = oneDataPoint;
      }

      resolve(true);
      this.isChartDataReady = true;



    })
  }

  open() {
    if (this.isOpen == false) {
      this.isOpen = true;
      this.processChartData();
      (<HTMLStyleElement>document.querySelector(".bottomSheet")).style.bottom = "0px";
      //(<HTMLStyleElement>document.querySelector(".bg")).style.display = "block";
      this.FabButtonVisible = false;

    } else {
      this.close();
      this.FabButtonVisible = true;
    }
  }

  close() {
    this.currentPosition = 0;
    this.startPosition = 0;

    (<HTMLStyleElement>document.querySelector(".bottomSheet")).style.bottom = "-1000px";
    (<HTMLStyleElement>document.querySelector(".bottomSheet")).style.transform = "translate3d(0px,0px,0px)";
    (<HTMLStyleElement>document.querySelector(".bg")).style.display = "none";
    this.isOpen = false;
    this.FabButtonVisible = true;
  }

  touchMove(evt: TouchEvent) {

    if (this.startPosition == 0) {
      this.startPosition = evt.touches[0].clientY;
    }

    this.height = document.querySelector(".bottomSheet").clientHeight;

    var y = evt.touches[0].clientY;
    this.currentPosition = y - this.startPosition;

    if (this.currentPosition > 0 && this.startPosition > 0) {
      (<HTMLStyleElement>document.querySelector(".bottomSheet")).style.transform = "translate3d(0px," + this.currentPosition + "px,0px)";
    }
  }

  touchEnd() {
    this.minimumThreshold = this.height - 130;

    if (this.currentPosition < this.minimumThreshold) {
      (<HTMLStyleElement>document.querySelector(".bottomSheet")).style.transform = "translate3d(0px,0px,0px)";
    }
    else {
      this.close();
    }
  }

  onTabChange(ev: any) {
    if (ev.detail.index == 0) {
      this.FabButtonVisible = true;
    } else {
      this.FabButtonVisible = false;
    }
  }

}

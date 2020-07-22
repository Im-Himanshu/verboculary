import { Component, OnInit, Renderer2, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular'
import { DatabaseService } from "../services/data-base.service"
import { appNameToUINameMapping } from "../interfaces/wordAppData.interface"
import { processedDataSharing } from '../interfaces/dropdown.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent implements OnInit {


  repetitions = [0, 1, 2, 3, 4, 5, 6];
  prevDeltaX = 0;
  prevDeltaY = 0;
  @ViewChild('ion_content', { static: false }) ionScroll: IonContent;
  appNametoUINameMapping = new appNameToUINameMapping().appNametoUINamemapping;
  allSelectedSet;
  allSetProgressData;
  collectiveProgress;


  allSetData: processedDataSharing;
  allSetOfcategory: any;
  allWordsOfSets;
  isDarkMode: boolean = false;
  chartLabelsAndData = {};

  constructor(private renderer: Renderer2, private db: DatabaseService, private router: Router) {
    this.allSelectedSet = this.db.allSetinSelectedCategory;
    this.allSetProgressData = this.db.allSetData.setLevelProgressData;
    this.processTotalSetData();

    this.allSetData = this.db.allSetData;
    this.allWordsOfSets = this.allSetData.allWordOfSets;
    this.setChartResult();

  }

  ngOnInit() { }

  setChartResult() {
    let allDayProgress = this.db.allSetData.dateWiseTotalProgressReport;
    this.chartLabelsAndData = allDayProgress;
  }


  goToUrl(url) {
    this.router.navigate([url]);

  }

  processTotalSetData() {

    this.collectiveProgress = {
      "beginner": {
        "totalLearned": 0,
        "totalViewed": 0,
        "totalWords": 0
      },
      "transitional": {
        "totalLearned": 0,
        "totalViewed": 0,
        "totalWords": 0
      },
      "pro": {
        "totalLearned": 0,
        "totalViewed": 0,
        "totalWords": 0
      }
    }

    for (let one of this.repetitions) {
      this.collectiveProgress['beginner']['totalLearned'] += this.allSetProgressData[this.allSelectedSet[one]]['totalLearned'];
      this.collectiveProgress['beginner']['totalWords'] += this.allSetProgressData[this.allSelectedSet[one]]['totalWords'];
      this.collectiveProgress['beginner']['totalViewed'] += this.allSetProgressData[this.allSelectedSet[one]]['totalViewed'];
    }
    for (let one of this.repetitions) {
      this.collectiveProgress['transitional']['totalLearned'] += this.allSetProgressData[this.allSelectedSet[one + 7]]['totalLearned'];
      this.collectiveProgress['transitional']['totalWords'] += this.allSetProgressData[this.allSelectedSet[one + 7]]['totalWords'];
      this.collectiveProgress['transitional']['totalViewed'] += this.allSetProgressData[this.allSelectedSet[one]]['totalViewed'];
    }
    for (let one of this.repetitions) {
      this.collectiveProgress['pro']['totalLearned'] += this.allSetProgressData[this.allSelectedSet[one + 14]]['totalLearned'];
      this.collectiveProgress['pro']['totalWords'] += this.allSetProgressData[this.allSelectedSet[one + 14]]['totalWords'];
      this.collectiveProgress['pro']['totalViewed'] += this.allSetProgressData[this.allSelectedSet[one]]['totalViewed'];
    }




  }

  handlePan(event) {

    let absoluteY = event.center.y;
    if (absoluteY < 30 || absoluteY > 500) { return; }
    if (event.deltaX === 0 || (event.center.x === 0 && event.center.y === 0)) return;

    //console.log(event.deltaX, event.deltaY)
    let newDeltaX = event.deltaX - this.prevDeltaX; // the new delta
    let newDeltaY = event.deltaY - this.prevDeltaY // the new delta more then the previous one
    this.prevDeltaX = event.deltaX;
    this.prevDeltaY = event.deltaY;
    let rotate = newDeltaX * newDeltaY;
    //console.log(newDeltaX, newDeltaY)

    let move: any = event.deltaY;
    if (event.deltaY >= 0) {
      move = "+" + move; // assigning the sign to the positive numbers
    }
    let toMoveElement = document.getElementById("toMove");
    let crntPosition: any = toMoveElement.style.top;
    crntPosition = crntPosition.substring(0, crntPosition.length - 2)// -1 for 0 index and - 2 for removing px
    crntPosition = parseInt(crntPosition);

    let newPosition = crntPosition + newDeltaY;

    if (absoluteY < 30 || newPosition > 700 || absoluteY > 430) { return; }
    let newValue = "calc(" + + move + "px)";
    toMoveElement.style.top = newPosition + "px"

  }


  handlePanEnd(event) {
    //30 to 500 250

    let toMoveElement = document.getElementById("toMove");

    let absoluteY = event.center.y;

    if (absoluteY > 200) {
      toMoveElement.style.top = 430 + "px"
    }
    if (absoluteY <= 200) {
      toMoveElement.style.top = 30 + "px"
    }
    this.prevDeltaX = 0;
    this.prevDeltaY = 0;

  }

  swipeup(event) {
    let toMoveElement = document.getElementById("toMove");

    let absoluteY = event.center.y;

    if (absoluteY > 200) {
      toMoveElement.style.top = 430 + "px"
    }
    if (absoluteY <= 200) {
      toMoveElement.style.top = 30 + "px"
    }
    this.prevDeltaX = 0;
    this.prevDeltaY = 0;



  }


  scrollParentToChild($child) {
    this.ionScroll.scrollToPoint(0, $child.offsetTop, 500)
  }

  scrollToTop() {
    this.ionScroll.scrollToTop(1000);
  }

}

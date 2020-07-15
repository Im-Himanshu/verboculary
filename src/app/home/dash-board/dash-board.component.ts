import { Component, OnInit, Renderer2, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular'
import { DatabaseService } from "../services/data-base.service"
import { appNameToUINameMapping } from "../interfaces/wordAppData.interface"
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

  constructor(private renderer: Renderer2, private db: DatabaseService) {
    this.allSelectedSet = this.db.allSetinSelectedCategory;
    this.allSetProgressData = this.db.allSetData.setLevelProgressData;
    this.processTotalSetData();

  }

  ngOnInit() { }
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


  scrollParentToChild($child) {
    this.ionScroll.scrollToPoint(0, $child.offsetTop, 500)
  }

  scrollToTop() {
    this.ionScroll.scrollToTop(1000);
  }

}

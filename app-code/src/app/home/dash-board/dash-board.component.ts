import { Component, OnInit, Renderer2, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular'
import { DatabaseService } from "../services/data-base.service"
import { SharingServiceService } from "../services/sharing-service.service"
import { appNameToUINameMapping } from "../interfaces/wordAppData.interface"
import { processedDataSharing } from '../interfaces/dropdown.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Screenshot } from '@ionic-native/screenshot/ngx'
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
  totalScreenHeight;
  heightFromTop
  isGraphVisible = false;
  totalNumberofWords = 0;

  constructor(private renderer: Renderer2, public db: DatabaseService, private router: Router, private platform: Platform, public screenshot: Screenshot, private shareService: SharingServiceService, private activatedRoute: ActivatedRoute) {
    this.totalScreenHeight = this.platform.height();
    console.log("screen Height :", this.totalScreenHeight);
    this.allSelectedSet = this.db.allSetinSelectedCategory;
    this.allSetProgressData = this.db.allSetData.setLevelProgressData;
    this.processTotalSetData();

    this.allSetData = this.db.allSetData;
    this.allWordsOfSets = this.allSetData.allWordOfSets;
    this.setChartResult();
    if (Object.keys(this.db.allSetData.dateWiseTotalProgressReport).length > 1) {
      this.isGraphVisible = true;
    }


  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // this.adjustTheDragged()


    // let masterFilter = document.getElementById("masterFilter");
    // this.heightFromTop = masterFilter.offsetTop + masterFilter.offsetHeight + 100; // place where slider need to be fit in
    // let toMoveElement = document.getElementById("toMove");
    // toMoveElement.style.top = this.heightFromTop + "px"

  }

  onScreenshot(event) {
    this.screenshot.URI(80).then(res => {
      this.shareService.onShareImage(res.URI);
    })
  }

  setChartResult() {
    let allDayProgress = this.db.allSetData.dateWiseTotalProgressReport;
    this.chartLabelsAndData = allDayProgress;
  }


  goToUrl(url) {
    // this.db.isNavigationLoading = true;
    this.router.navigate([url]);//,{relativeTo: this.activatedRoute}
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
      this.collectiveProgress['transitional']['totalViewed'] += this.allSetProgressData[this.allSelectedSet[one + 7]]['totalViewed'];
    }
    for (let one of this.repetitions) {
      this.collectiveProgress['pro']['totalLearned'] += this.allSetProgressData[this.allSelectedSet[one + 14]]['totalLearned'];
      this.collectiveProgress['pro']['totalWords'] += this.allSetProgressData[this.allSelectedSet[one + 14]]['totalWords'];
      this.collectiveProgress['pro']['totalViewed'] += this.allSetProgressData[this.allSelectedSet[one + 14]]['totalViewed'];
    }
    this.totalNumberofWords = this.collectiveProgress['beginner']['totalWords'] + this.collectiveProgress['transitional']['totalWords'] + this.collectiveProgress['pro']['totalWords']




  }

  touchStarted(event: TouchEvent) {
    this.prevDeltaY = event.touches[0].clientY;
    let toMoveElement = document.getElementById("toMove");
    let newPosition = toMoveElement.offsetTop;
    toMoveElement.style.top = newPosition + "px"

  }

  touchEnded(event: TouchEvent) {
    this.prevDeltaY = 0;
  }

  handleTouch(event: TouchEvent) {
    //console.log("touch running :", event.touches[0])
    this.totalScreenHeight = this.platform.height();

    let absoluteY = event.touches[0].clientY;
    if (absoluteY < 78 || absoluteY > (this.totalScreenHeight - 40)) {
      // if the touch goes above a certain range stop doing anything in this case
      // if the touch goes in range of headear and >500 is for screen width
      return;
    }
    let newDeltaY = event.touches[0].clientY - this.prevDeltaY // the new delta more then the previous one
    this.prevDeltaY = event.touches[0].clientY
    let toMoveElement = document.getElementById("toMove");
    let crntPosition: any = toMoveElement.style.top;
    crntPosition = crntPosition.substring(0, crntPosition.length - 2)// -1 for 0 index and - 2 for removing px
    crntPosition = parseInt(crntPosition);

    let newPosition = crntPosition + newDeltaY;

    if (absoluteY < 30 || newPosition > (this.totalScreenHeight - 100) || absoluteY > this.totalScreenHeight) {
      // never executed
      return;
    }
    toMoveElement.style.top = newPosition + "px"

  }

  adjustTheDragged() {
    let masterFilter = document.getElementById("masterFilter");
    let offSetTop = masterFilter.offsetTop + masterFilter.offsetHeight + 30; // place where slider need 
    let toMoveElement = document.getElementById("toMove");
    toMoveElement.style.top = offSetTop + "px"
  }


  handleTouchEnd(event: TouchEvent) {
    let masterFilter = document.getElementById("masterFilter");
    let offSetTop = masterFilter.offsetTop + masterFilter.offsetHeight + 30; // place where slider need to be fit in
    let toMoveElement = document.getElementById("toMove");
    let absoluteY = event.changedTouches[0].clientY;
    let twoThird = Math.floor(3 * offSetTop / 4)
    if (absoluteY > twoThird) {
      // more then 180 down from top take it down
      toMoveElement.style.top = offSetTop + "px"
    }
    else { // if greater than 2 rd tha
      //if less 180 down take it up
      toMoveElement.style.top = 10 + "px"
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

  scrollToElement(element) { }

}

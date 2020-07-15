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

  constructor(private renderer: Renderer2, private db: DatabaseService) {
    this.allSelectedSet = this.db.allSetinSelectedCategory;
    this.allSetProgressData = this.db.allSetData.setLevelProgressData;

  }

  ngOnInit() { }


  scrollParentToChild($child) {
    this.ionScroll.scrollToPoint(0, $child.offsetTop, 500)
  }

  scrollToTop() {
    this.ionScroll.scrollToTop(1000);
  }

}

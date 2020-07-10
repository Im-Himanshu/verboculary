import { Component, OnInit, Renderer2, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular'
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent implements OnInit {


  repetitions = [1, 2, 3, 4, 5, 6, 7];
  prevDeltaX = 0;
  prevDeltaY = 0;
  @ViewChild('ion_content', { static: false }) ionScroll: IonContent;

  constructor(private renderer: Renderer2) { }

  ngOnInit() { }


  scrollParentToChild($child) {
    this.ionScroll.scrollToPoint(0, $child.offsetTop, 500)
  }

  scrollToTop() {
    this.ionScroll.scrollToTop(1000);

  }

}

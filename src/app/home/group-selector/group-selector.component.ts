import { Component, OnInit, Renderer2, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular'
@Component({
  selector: 'app-group-selector',
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.scss'],
})
export class GroupSelectorComponent implements OnInit {

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

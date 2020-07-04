import { Component, Input, ViewChildren, QueryList, EventEmitter, ElementRef, Output, Renderer2 } from '@angular/core';

import { trigger, keyframes, animate, transition } from "@angular/animations";
import * as kf from "../../keyframes";

@Component({
  selector: 'app-swipable-card',
  templateUrl: './swipable-card.component.html',
  styleUrls: ['./swipable-card.component.scss'],
})
export class SwipableCardComponent {
  animationState: string;
  @Input('cards') allCardsIDs: Array<any>; // will have all the 
  @Input('allWordsDetails') allWordDetails;
  @Input('selectedIDsDynamicData') selectedIDsDynamicData;

  @ViewChildren('tinderCard') tinderCards: QueryList<ElementRef>;
  tinderCardsArray: Array<ElementRef>;

  @Output() choiceMade = new EventEmitter();
  @Output() changeMarkEvent = new EventEmitter();
  moveOutWidth: number;
  shiftRequired: boolean;
  transitionInProgress: boolean;
  heartVisible: boolean;
  crossVisible: boolean;
  isToShowMeaning: boolean = false;

  constructor(private renderer: Renderer2) {
    this.choiceMade.subscribe(data => {
      this.controlCardPopulation();
    })


  }

  controlCardPopulation() {
    if (this.allCardsIDs.length > 6) {
      this.allCardsIDs.splice(6, this.allCardsIDs.length - 6); // from 5 till end
    }
  }
  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }
  ngOnInit() {

  }
  toggleMeaning() {
    this.isToShowMeaning = !this.isToShowMeaning;
  }

  userClickedButton(event, heart) {
    event.preventDefault();
    if (!this.allCardsIDs.length) return false;
    if (heart) {
      this.renderer.setStyle(this.tinderCardsArray[0].nativeElement, 'transform', 'translate(' + this.moveOutWidth + 'px, -100px) rotate(-30deg)');
      this.toggleChoiceIndicator(false, true);
      this.emitChoice(heart, this.allCardsIDs[0]);
    } else {
      this.renderer.setStyle(this.tinderCardsArray[0].nativeElement, 'transform', 'translate(-' + this.moveOutWidth + 'px, -100px) rotate(30deg)');
      this.toggleChoiceIndicator(true, false);
      this.emitChoice(heart, this.allCardsIDs[0]);
    };
    this.shiftRequired = true;
    this.transitionInProgress = true;
  };

  handlePan(event) {

    if (event.deltaX === 0 || (event.center.x === 0 && event.center.y === 0) || !this.allCardsIDs.length) return;

    if (this.transitionInProgress) {
      this.handleShift();
    }

    this.renderer.addClass(this.tinderCardsArray[0].nativeElement, 'moving');

    if (event.deltaX > 0) { this.toggleChoiceIndicator(false, true) }
    if (event.deltaX < 0) { this.toggleChoiceIndicator(true, false) }

    let xMulti = event.deltaX * 0.03;
    let yMulti = event.deltaY / 80;
    let rotate = xMulti * yMulti;

    this.renderer.setStyle(this.tinderCardsArray[0].nativeElement, 'transform', 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)');

    this.shiftRequired = true;

  };

  handlePanEnd(event) {

    this.toggleChoiceIndicator(false, false);

    if (!this.allCardsIDs.length) return;

    this.renderer.removeClass(this.tinderCardsArray[0].nativeElement, 'moving');

    let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
    if (keep) {

      this.renderer.setStyle(this.tinderCardsArray[0].nativeElement, 'transform', '');
      this.shiftRequired = false;

    } else {

      let endX = Math.max(Math.abs(event.velocityX) * this.moveOutWidth, this.moveOutWidth);
      let toX = event.deltaX > 0 ? endX : -endX;
      let endY = Math.abs(event.velocityY) * this.moveOutWidth;
      let toY = event.deltaY > 0 ? endY : -endY;
      let xMulti = event.deltaX * 0.03;
      let yMulti = event.deltaY / 80;
      let rotate = xMulti * yMulti;

      this.renderer.setStyle(this.tinderCardsArray[0].nativeElement, 'transform', 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)');

      this.shiftRequired = true;

      this.emitChoice(!!(event.deltaX > 0), this.allCardsIDs[0]);
    }
    this.transitionInProgress = true;
  };

  toggleChoiceIndicator(cross, heart) {
    this.crossVisible = cross;
    this.heartVisible = heart;
  };

  handleShift() {
    this.transitionInProgress = false;
    this.toggleChoiceIndicator(false, false)
    if (this.shiftRequired) {
      this.shiftRequired = false;
      this.allCardsIDs.shift();
      this.isToShowMeaning = false;
    };
  };

  emitChoice(heart, card) {
    this.isToShowMeaning = false;
    this.choiceMade.emit({
      choice: heart,
      payload: card,
      wordID: card
    })
  };

  ngAfterViewInit() {
    this.moveOutWidth = document.documentElement.clientWidth * 1.5;
    this.tinderCardsArray = this.tinderCards.toArray();
    this.tinderCards.changes.subscribe(() => {
      this.tinderCardsArray = this.tinderCards.toArray();
    })
  };
  changeMark(newMark, wordId) {
    this.changeMarkEvent.emit({
      newMark: newMark,
      wordId: wordId
    })
    this.isToShowMeaning = true;

  }


}

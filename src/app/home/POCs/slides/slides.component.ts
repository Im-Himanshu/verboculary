import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 300,
    effect: 'Cube',
  }

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor() { }

  ngOnInit() { }


  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }


}

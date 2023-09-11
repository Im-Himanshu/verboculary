import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-horizontal-scroll',
  templateUrl: './horizontal-scroll.component.html',
  styleUrls: ['./horizontal-scroll.component.scss'],
})
export class HorizontalScrollComponent {
  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  constructor() { }

}

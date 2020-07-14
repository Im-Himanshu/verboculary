import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular'
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 300,
    effect: 'Cube',
  }

  @ViewChild('slides',{ static: true}) slides:IonSlides;

  constructor(public storage : Storage, private router: Router) { }

  ngOnInit() {}


  next(){
    this.slides.slideNext();
  }

  prev(){
    this.slides.slidePrev();
  }

  slidesDestroy(){
    this.storage.set('slidesStatus',"false");
    console.log(this.storage.get('slidesStatus'));
    // this.router.navigate(['/']);  //why was this line being used
  }

}

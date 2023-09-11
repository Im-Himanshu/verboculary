import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import {
  useAnimation,
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import * as anime from 'animejs';

import { FlipAnimation } from './reusableAngularANimation';
@Component({
  selector: 'app-animated',
  templateUrl: './animated.component.html',
  styleUrls: ['./animated.component.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('900ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(150%)' }),
        animate('900ms 300ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('anyChangeinthis', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(150%)' }),
        animate('900ms 300ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    FlipAnimation.animations // this will feed a animation by the name of flipState
  ]
})
export class AnimatedComponent implements OnInit {
  @ViewChildren('itemlist', { read: ElementRef }) items: QueryList<ElementRef>;

  constructor() { }

  ngOnInit() { }

  //animation using the libraries 
  //1. animejs --npm install animejs
  callAnime() {
    anime({
      targets: '.animate-me',
      translateX: [
        { value: 100, duration: 1200 },
        { value: 0, duration: 800 }
      ],
      rotate: '1turn',
      backgroundColor: '#ff00ff',
      duration: 2000
    });
  }


  // working...
  // documentation of this is here. https://github.com/daneden/animate.css
  // // class="animated infinite bounce delay-2s" or as this 
  // .yourElement {
  //   animation-duration: 3s;
  //   animation-delay: 2s;
  //   animation-iteration-count: infinite;
  // }
  animateItems() {
    let elements = this.items.toArray();
    elements.map(elem => {
      return elem.nativeElement.classList.add('zoomOutRight') // easiest...
    })

  }
  usingFunction() {

    let elements = this.items.toArray();
    elements.map(elem => {
      this.animateCSS(elem, 'zoomOutRight', this.afterAnimationFunction);
    })

  }
  afterAnimationFunction() {

  }
  //https://www.w3schools.com/css/css3_animations.asp
  // above can be feed as the service or as a function of the above 
  // for example 
  animateCSS(element, animationName, callback) {
    const node = element.nativeElement;//document.querySelector('.animate-me') for class element
    node.classList.add('animated', animationName)

    function handleAnimationEnd() { // this will reset the animation
      node.classList.remove('animated', animationName)
      node.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
  }


  // one more way using the css keyframes if soemthign is not availaible in animate.css
  // so basically what this does is provide a predefine css class to apply to element and we can choose when to apply them...otherwise al those operation can be done in simple css...


  flip = 'inactive';

  toggleFlip() {
    this.flip = this.flip === 'inactive' ? 'active' : 'inactive';
  }


}

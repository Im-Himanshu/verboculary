import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-icon',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})

// to use this the parent component must have the position : relative with width and height tag defined so that the content inside could be aligned according to that div only
// it will fit in exactly to the size of the parent div so that 
// using it requires no hasel but making a div of appropriate size 
// <div style ="position: relative; width: 20;height : 100%">
export class SvgComponent {
  @Input() name: String;

  constructor() { }

  get absUrl() {
    return window.location.href;
  }
}
import { Component, OnInit, Renderer2, ViewChildren, ElementRef, ViewChild } from '@angular/core';
// this component is the parent folder for all thesub routing it displays them in a shutter
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent implements OnInit {

  repetitions = [1, 2, 3, 4, 5, 6, 7];
  prevDeltaX = 0;
  prevDeltaY = 0;
  masterCard = [1, 2, 3]

  constructor(private renderer: Renderer2) { }

  ngOnInit() { }

  handlePan(event) {

    let absoluteY = event.center.y;
    if (absoluteY < 30 || absoluteY > 500) { return; }
    if (event.deltaX === 0 || (event.center.x === 0 && event.center.y === 0)) return;

    //console.log(event.deltaX, event.deltaY)
    let newDeltaX = event.deltaX - this.prevDeltaX; // the new delta 
    let newDeltaY = event.deltaY - this.prevDeltaY // the new delta more then the previous one
    this.prevDeltaX = event.deltaX;
    this.prevDeltaY = event.deltaY;
    let rotate = newDeltaX * newDeltaY;
    //console.log(newDeltaX, newDeltaY)

    let move: any = event.deltaY;
    if (event.deltaY >= 0) {
      move = "+" + move; // assigning the sign to the positive numbers
    }
    let toMoveElement = document.getElementById("toMove");
    let crntPosition: any = toMoveElement.style.top;
    crntPosition = crntPosition.substring(0, crntPosition.length - 2)// -1 for 0 index and - 2 for removing px
    crntPosition = parseInt(crntPosition);

    let newPosition = crntPosition + newDeltaY;

    if (absoluteY < 30 || newPosition > 700 || absoluteY > 430) { return; }
    let newValue = "calc(" + + move + "px)";
    toMoveElement.style.top = newPosition + "px"

  }


  handlePanEnd(event) {
    //30 to 500 250

    let toMoveElement = document.getElementById("toMove");

    let absoluteY = event.center.y;

    if (absoluteY > 200) {
      toMoveElement.style.top = 430 + "px"
    }
    if (absoluteY <= 200) {
      toMoveElement.style.top = 30 + "px"
    }
    this.prevDeltaX = 0;
    this.prevDeltaY = 0;

  }

  swipeup(event) {
    let toMoveElement = document.getElementById("toMove");

    let absoluteY = event.center.y;

    if (absoluteY > 200) {
      toMoveElement.style.top = 430 + "px"
    }
    if (absoluteY <= 200) {
      toMoveElement.style.top = 30 + "px"
    }
    this.prevDeltaX = 0;
    this.prevDeltaY = 0;



  }


}

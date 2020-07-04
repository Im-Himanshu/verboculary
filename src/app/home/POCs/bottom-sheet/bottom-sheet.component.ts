import { Component, OnInit } from '@angular/core';
import { DrawerState } from '@fivethree/core';
@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
})
export class BottomSheetComponent implements OnInit {

  //https://github.com/fivethree-team/ionic-4-components/blob/master/src/app/pages/bottom-sheet/bottom-sheet.module.ts
  //demo : https://fivethree-team.github.io/ionic-4-components/bottom-sheet -- only in mobile..

  shouldBounce = true;
  dockedHeight = 224;
  distanceTop = 0;
  drawerState = DrawerState.Docked;
  states = DrawerState;

  handle = true;
  float = true;
  rounded = true;
  constructor() { }

  ngOnInit() {}

}

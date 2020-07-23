import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'svg-definitions',
  templateUrl: './svg-definitions.component.html',
  styleUrls: ['./svg-definitions.component.scss'],
})
export class SvgDefinitionsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  // to update the preview run this command in the current folder, it will show all the icons of the app

  /// node svg-converter.js

  beginnerOuter = "#62C58A";
  beginnerInner = "#FECC7B";


}

import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import domtoimage from 'dom-to-image';
import {SharingServiceService} from '../../services/sharing-service.service'
@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
  @ViewChild('container',{static: false, read: ElementRef}) container: ElementRef;
  @ViewChild('container2',{static: false, read: ElementRef}) container2: ElementRef;
  ourImage: any;
  constructor(private renderer: Renderer2, private sharingService: SharingServiceService) { }
  shareButtonClone(event){
    this.sharingService.shareImageViaScreenshot(this.container);
  }

  ngOnInit() {}

}

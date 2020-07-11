import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
  @ViewChild('container',{static: false, read: ElementRef}) container: ElementRef;
  @ViewChild('container2',{static: false, read: ElementRef}) container2: ElementRef;
  ourImage: any;
  constructor(private renderer: Renderer2) { }
  shareButtonClone(event){

    domtoimage.toPng(this.container.nativeElement)
    .then((dataUrl)=>{
      var img = new Image();
      img.src = dataUrl;
      console.log(img);
      // this.container2.nativeElement.innerHTML = img;
      this.renderer.appendChild(this.container.nativeElement,img);
      console.log("working");
    })
    .catch(function(error){
      console.log("error",error);
    })
  }

  ngOnInit() {}

}

import { Injectable, ElementRef } from '@angular/core';
import domtoimage from 'dom-to-image';
@Injectable({
  providedIn: 'root'
})
export class SharingServiceService {

  constructor() { }


  // this is where the social sharing component will come


  shareImageViaScreenshot(container: ElementRef){
    domtoimage.toPng(container.nativeElement)
    .then((dataUrl)=>{
      var img = new Image();
      img.src = dataUrl;
      console.log(img);

      //this is where the social sharing component will be called with the img.src

      console.log("working");//remove this once checked on your terminal
    })
    .catch(function(error){
      console.log("error",error);
    })
  }
}

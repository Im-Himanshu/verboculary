import { Injectable, ElementRef } from '@angular/core';
import domtoimage from 'dom-to-image';
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

@Injectable({
  providedIn: 'root'
})
export class SharingServiceService {

  constructor(private socialSharing: SocialSharing) { }

  //deeplinking call or create service


  onShareApp() {
    // console.log("App Share triggered");
    this.socialSharing.share(
      "Download the verboculary app for GRE preparation",
      null,
      [],
      "https://verboculary.page.link/PZXe"
    );
  }

  onShareImage(url: any) {
    this.socialSharing.share(
      "Join us at verboculary",
      null,
      [url],
      "https://verboculary.page.link/PZXe",
      //deeplinking part here only
    );
  }

  // this is where the social sharing component will come


  shareImageViaScreenshot(container: ElementRef){
    domtoimage.toPng(container.nativeElement)
    .then((dataUrl)=>{
      var img = new Image();
      img.src = dataUrl;
      console.log(img);

      this.onShareImage(img.src);

      console.log("working");//remove this once checked on your terminal
    })
    .catch(function(error){
      console.log("error",error);
    })
  }
}

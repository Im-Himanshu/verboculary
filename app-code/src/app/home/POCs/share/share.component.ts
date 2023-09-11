import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef,
} from "@angular/core";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import domtoimage from "dom-to-image";
import { SharingServiceService } from '../../services/sharing-service.service';

@Component({
  selector: "app-share",
  templateUrl: "./share.component.html",
  styleUrls: ["./share.component.scss"],
})
export class ShareComponent implements OnInit {
  @ViewChild("container", { static: false, read: ElementRef })
  container: ElementRef;
  // @ViewChild("container2", { static: false, read: ElementRef })
  // container2: ElementRef;
  constructor(
    private sharingService: SharingServiceService
  ) {}

  ngOnInit() {}
  screenshot(event){
    this.sharingService.shareImageViaScreenshot(this.container);
  }


}
// onShare(url: any) {
  //   this.socialSharing.share(
  //     "Join us at verboculary",
  //     null,
  //     [url],
  //     "gre.verboculary.com"
  //   );
  // }
  // screenshot(event) {
  //   domtoimage
  //     .toPng(this.container.nativeElement)
  //     .then((dataUrl) => {
  //       var img = new Image();
  //       img.src = dataUrl;
  //       // console.log(img);
  //       this.onShare(img.src);
  //       // this.container2.nativeElement.innerHTML = img;
  //       this.renderer.appendChild(this.container.nativeElement, img);
  //       // console.log("working");
  //     })
  //     .catch(function (error) {
  //       console.log("error", error);
  //     });
  // }
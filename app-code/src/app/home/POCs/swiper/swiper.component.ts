import { Component, OnInit } from "@angular/core";
import { SuperTabs } from "@ionic-super-tabs/angular";
import { SuperTabChangeEventDetail } from "@ionic-super-tabs/core";

@Component({
  selector: "app-swiper",
  templateUrl: "./swiper.component.html",
  styleUrls: ["./swiper.component.scss"],
})
export class SwiperComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  activeTabIndex: number;
  dosomething(event) {
    console.log(event);
  }
  onTabChange(ev: CustomEvent<SuperTabChangeEventDetail>) {
    console.log("Tab change fired", ev);
    this.activeTabIndex = ev.detail.index;
  }
}

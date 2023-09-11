import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events } from '@ionic/angular';
//import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Component({
  selector: 'app-filter-pop-over',
  templateUrl: './filter-pop-over.component.html',
  styleUrls: ['./filter-pop-over.component.scss'],
})
export class FilterPopOverComponent implements OnInit {
  page;

  constructor(
    private events: Events,
    private navParams: NavParams,
    private popoverController: PopoverController) {

  }

  ngOnInit() {
    //Get data from popover page
    this.page = this.navParams.get('data');
  }

  wifiSetting() {
    // code for setting wifi option in apps
  }

  logout() {
	// code for logout
  }

  eventFromPopover() {
    this.events.publish('fromPopoverEvent');
    this.popoverController.dismiss();
  }

  close(){
    this.popoverController.dismiss()
  }

}

import { Component, OnInit } from '@angular/core';

import { ModalController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-about-developer',
  templateUrl: './about-developer.component.html',
  styleUrls: ['./about-developer.component.scss'],
})
export class AboutDeveloperComponent  {

  myParameter: boolean;
  myOtherParameter: Date;
  constructor(private modalController: ModalController,
              private navParams: NavParams) {
  }
  ionViewWillEnter() {
    this.myParameter = this.navParams.get('aParameter');
    this.myOtherParameter = this.navParams.get('otherParameter');
  }
  async closeModal() {
    const result: Date = new Date();    
    await this.modalController.dismiss(result);
  }


  redirecttoURl(url){
    window.open(url, '_system', 'location=yes,fullscreen=yes')
    return false;
  }

}

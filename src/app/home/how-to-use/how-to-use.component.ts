import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss'],
})
export class HowToUseComponent  {

  isToShowMore : boolean = false;


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


  showMoreToggle(toSetValue){
    this.isToShowMore = toSetValue;
  }
}

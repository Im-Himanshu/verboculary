import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApprateService {

  loginCount: number;

  constructor(private storage : Storage, private alertController : AlertController) { }

  getLoginCount() {
    return this.storage.get("loginCount");
  }

  async presentRateUs(){
    this.getLoginCount().then(data => {
      this.loginCount = data;
    });
    if(this.loginCount == 30) {
      const alert = await this.alertController.create({
        header: "Enjoying Using Verboculary",
        subHeader: "Please rate us",
        buttons: [
          {
            text: 'Later',
            role: 'cancel',
          },
          {
            text: 'OK,Sure',
            handler: () => {
              window.location.href = "market://details?id=com.GREninja.GRE.vocabulary";
            }
          }
        ],
      });
      await alert.present();
    }
  }

  show(){
    this.alertController.create({
      header: "Enjoying Using Verboculary",
      subHeader: "Please rate us",
      buttons: [
        {
          text: 'Later',
          role: 'cancel',
        },
        {
          text: 'OK,Sure',
          handler: () => {
            window.location.href = "market://details?id=com.GREninja.GRE.vocabulary";
          }
        }
      ],
    }).then(res => res.present());
  }
}

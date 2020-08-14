import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Storage } from '@ionic/storage';
import { AdmobConfig } from '../interfaces/admob-config';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore'

const STORAGE_KEY_AdmobSessionData = "admobSettings";

@Injectable({
  providedIn: 'root'
})
export class AdmobSerService {

  /// modification needed 
  // old admob id was used so remove them
  // make the new id fetched from firebase for like once in a while..like one every day to reduce the call sizes
  // make an algorithm to tweak the add frequency on the go
  // like intense or slow based on the region and some logic..

  AdStatus;
  points;
  admobConfig = {} as AdmobConfig;
  admobIDsDetails: any;

  constructor(public admob: AdMobFree, public storage: Storage, public alertController: AlertController, private firestore: AngularFirestore) {
    this.getAdmobConfig().then(data => {
      if (data) {
        this.admobConfig = data;
        this.AdStatus = this.admobConfig.Adstatus;
        this.checkAdStatus();
      } else {
        this.admobConfig.Adstatus = true;
        this.admobConfig.expireDate = null;
        this.admobConfig.points = 0;
        this.setAdmobConfig(this.admobConfig);
      }
    });
  }

  fetchAdMobIdsFromFirebase() {
    return new Promise((resolve, reject) => {
      this.firestore.collection("adMobID").doc("GREninja").get().subscribe(firebaseData => {
        this.admobIDsDetails = firebaseData.data();
        resolve(true);
      })

    })
  }

  showInterstitialAds() {
    if (this.AdStatus) {
      const interstitialConfig: AdMobFreeInterstitialConfig = {
        id: this.admobIDsDetails.interstitial,
        autoShow: true,
        isTesting: false,

      }

      this.admob.interstitial.config(interstitialConfig);
      this.admob.interstitial.prepare().then((data) => {
        console.log("interstitial ads  SUCCESSFUL", data);
      }).then(e => console.log(e));
    }
  }

  showAdMobFreeRewardVideoAds() {
    if (true) {
      const rewardVideoConfig: AdMobFreeRewardVideoConfig = {
        id: this.admobIDsDetails.rewarded,
        autoShow: true,
        isTesting: false,
      }

      this.admob.rewardVideo.config(rewardVideoConfig);
      this.admob.rewardVideo.prepare().then(() => {
        console.log("SUCCESS")
        document.addEventListener(this.admob.events.REWARD_VIDEO_REWARD, (result) => {
          this.WatchedAd();
        });
      }).then(e => console.log(e));
    }
  }

  showBannerAdd() {
    if (this.AdStatus) {

      const bannerConfig: AdMobFreeBannerConfig = {
        id: this.admobIDsDetails.banner,
        autoShow: true,
        isTesting: false,
        bannerAtTop: false,
        overlap: false,
      }
      this.admob.banner.config(bannerConfig);
      this.admob.banner.prepare().then(() => {

      }).then(e => console.log(e));
    }
  }

  WatchedAd() {
    let today = new Date();
    this.admobConfig.expireDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    this.admobConfig.Adstatus = false;
    this.admobConfig.points = 0;
    this.setAdmobConfig(this.admobConfig);
  }

  checkAdStatus() {
    let today = new Date();

    if (today >= this.admobConfig.expireDate && this.admobConfig.expireDate != null) {
      this.admobConfig.Adstatus = true;
      this.admobConfig.expireDate = null;
      this.AdStatus = true;
      this.setAdmobConfig(this.admobConfig);
    }
  }

  setAdmobConfig(x) {
    this.storage.set(STORAGE_KEY_AdmobSessionData, x);
  }

  getAdmobConfig() {
    return this.storage.get(STORAGE_KEY_AdmobSessionData);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Reward',
      subHeader: 'Watching one Full Video Add will Disable all in-app Ads for 24 Hours! Would you like to continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes,Continue',
          handler: () => {
            this.showAdMobFreeRewardVideoAds();
          }
        }
      ]
    });
    await alert.present();
  }
}

import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig,AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
  providedIn: 'root'
})
export class AdmobSerService {

  AdStatus = true;

  constructor(public admob: AdMobFree) {}

   showInterstitialAds(){
     if (this.AdStatus){
      const interstitialConfig: AdMobFreeInterstitialConfig = {
        id:'ca-app-pub-7438833190046160/2766623438',
        autoShow: true,
        isTesting: false,

      }

      this.admob.interstitial.config(interstitialConfig);
      this.admob.interstitial.prepare().then(() =>
      {
        console.log("SUCCESSFUL");
      }).then(e => console.log(e));
      }
    }

  showAdMobFreeRewardVideoAds(){
    if (this.AdStatus){
      const rewardVideoConfig: AdMobFreeRewardVideoConfig = {
        id:'ca-app-pub-7438833190046160/3137609783',
        autoShow: true,
        isTesting: false,
      }

      this.admob.rewardVideo.config(rewardVideoConfig);
      this.admob.rewardVideo.prepare().then(() =>
      {
        
      }).then(e => console.log(e));
    }
  }

  showBannerAdd(){
    if (this.AdStatus){

      const bannerConfig: AdMobFreeBannerConfig = {
        id : 'ca-app-pub-7438833190046160/3972604334',
        autoShow: true,
        isTesting: false,
        bannerAtTop: false,
        overlap: false,
      }
      this.admob.banner.config(bannerConfig);
      this.admob.banner.prepare().then(() => 
      {  

      }).then(e => console.log(e));
    }
  }

}

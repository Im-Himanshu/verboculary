import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
  providedIn: 'root'
})
export class AdmobSerService {

  constructor(public admob: AdMobFree) {

   }

   showInterstitialAds(){
    const bannerConfig: AdMobFreeBannerConfig = {
      // id:'ca-app-pub-4352525331879046/7332741441',
      autoShow: true,
      isTesting: true,

    }

    this.admob.interstitial.config(bannerConfig);
    this.admob.interstitial.prepare().then(() =>
    {
      console.log("SUCCESSFUL");
    }).then(e => console.log(e));
  }

  showAdMobFreeRewardVideoAds(){
    const rewardVideoConfig: AdMobFreeRewardVideoConfig = {
      // id:'ca-app-pub-4352525331879046/2656763057',
      autoShow: true,
      isTesting: true,
    }

    this.admob.rewardVideo.config(rewardVideoConfig);
    this.admob.rewardVideo.prepare().then(() =>
    {

    }).then(e => console.log(e));
  }

  showBannerAdd(){

      const bannerConfig: AdMobFreeBannerConfig = {
        // id : 'ca-app-pub-4352525331879046/7332741441',
        autoShow: true,
        isTesting: true,
        bannerAtTop: false,
        overlap: false,
      }
      this.admob.banner.config(bannerConfig);
      this.admob.banner.prepare().then(() => 
      {

      }).then(e => console.log(e));
  }

}

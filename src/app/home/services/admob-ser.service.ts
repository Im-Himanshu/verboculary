import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
  providedIn: 'root'
})
export class AdmobSerService {

  AdStatus = true;

  constructor(public admob: AdMobFree) {}

   showInterstitialAds(){
     if (this.AdStatus){
      const bannerConfig: AdMobFreeBannerConfig = {
        id:'ca-app-pub-4352525331879046/7332741441',
        autoShow: true,
        isTesting: false,

      }

      this.admob.interstitial.config(bannerConfig);
      this.admob.interstitial.prepare().then(() =>
      {
        console.log("SUCCESSFUL");
        this.admob.interstitial.show();
      }).then(e => console.log(e));
      }
    }

  showAdMobFreeRewardVideoAds(){
    if (this.AdStatus){
      const rewardVideoConfig: AdMobFreeRewardVideoConfig = {
        id:'ca-app-pub-4352525331879046/2656763057',
        autoShow: true,
        isTesting: false,
      }

      this.admob.rewardVideo.config(rewardVideoConfig);
      this.admob.rewardVideo.prepare().then(() =>
      {
        this.admob.rewardVideo.show();
      }).then(e => console.log(e));
    }
  }

  showBannerAdd(){
    if (this.AdStatus){

      const bannerConfig: AdMobFreeBannerConfig = {
        id : 'ca-app-pub-4352525331879046/7332741441',
        autoShow: true,
        isTesting: false,
        bannerAtTop: false,
        overlap: false,
      }
      this.admob.banner.config(bannerConfig);
      this.admob.banner.prepare().then(() => 
      {  
        this.admob.banner.show();
      }).then(e => console.log(e));
    }
  }

}

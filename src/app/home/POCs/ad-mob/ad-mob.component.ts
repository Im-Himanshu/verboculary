import { Component, OnInit } from '@angular/core';

import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-ad-mob',
  templateUrl: './ad-mob.component.html',
  styleUrls: ['./ad-mob.component.scss'],
})
export class AdMobComponent implements OnInit {

  constructor(public admob: AdMobFree) { 
    const bannerConfig: AdMobFreeBannerConfig = {
      // id = '',
      autoShow: true,
      isTesting: true,
      bannerAtTop: false,
      overlap: true
    }
    this.admob.banner.config(bannerConfig);
    this.admob.banner.prepare().then(() => 
    {

    });
  }

  ngOnInit() {}


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
      // id:'',
      autoShow: true,
      isTesting: true,
    }

    this.admob.rewardVideo.config(rewardVideoConfig);
    this.admob.rewardVideo.prepare().then(() =>
    {

    }).then(e => console.log(e));
  }

}

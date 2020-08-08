import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { DatabaseService } from './data-base.service';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  currId;
  player: Howl = null;
  isPlayerActive: boolean = false; // is playeractive means whether to show the below popup or not 
  isPlayerPlaying = false;// means whether to show the below 
  progress = 0;
  iscontinousPlayer: boolean = false;
  isInTransition = false;
  isToStopLooping = false;
  isToSkipStartandEnd = true;
  introSkipTime = 15;
  EndSkipTime = 15;

  constructor(public musicControls: MusicControls, private db: DatabaseService, public toastController: ToastController) {
    this.currId = this.db.allSelectedWordIdsFiltered[0];
    this.startNewPlayer();
  }



  playPauseGivenId(wordId, isToPlay, isToPlayAll?) {
    // here goes all the logic of what need to be done and when it needs to be done
    if (!isToPlay) { // not to play means to pause
      this.pause();
      return;
    }
    if (!this.db.allWordsData[wordId][5] && isToPlayAll) {
      this.iscontinousPlayer = isToPlayAll;
      this.currId = wordId; // to make next run better
      this.next(); // if play all then 0th index is passed and the next availaible index is played
      return;
    }
    if (isToPlay && wordId == this.currId) {
      // desire state already running
      if (!this.isPlayerPlaying) {
        this.play();
        this.iscontinousPlayer = isToPlayAll
      }
      return;
    }

    this.currId = wordId;
    this.iscontinousPlayer = isToPlayAll;
    this.startNewPlayer();
    this.isInTransition = true
    this.play();
    this.createNotification();


  }




  prev() {
    let index = this.db.allSelectedWordIdsFiltered.indexOf(this.currId);
    index = index - 1;
    while (index > 0) {
      if (!this.db.allWordsData[index][5]) {
        index--; // if the podcast doesn't exist then move forward
      }
      else {
        this.playPauseGivenId(this.db.allSelectedWordIdsFiltered[index], true, this.iscontinousPlayer);
        return;
      }
    }
    console.log("No previous word was found, returning")
    this.presentToast("No Podcast found!!")


  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  next() {
    let index = this.db.allSelectedWordIdsFiltered.indexOf(this.currId);
    let i = index + 1;
    while (i < this.db.allSelectedWordIdsFiltered.length) {
      if (!this.db.allWordsData[i][5]) {
        i++; // if the podcast doesn't exist then move forward
      }
      else {
        //this.pause();
        this.playPauseGivenId(this.db.allSelectedWordIdsFiltered[i], true, this.iscontinousPlayer);
        this.isToStopLooping = false;
        //break;
        return;
      }
    }
    if (this.isToStopLooping) {
      this.presentToast("No Podcast found!!")
      this.isToStopLooping = false;
      return;
      // nothing was found nothing will be played
    }
    this.currId = -1; // select the first one
    this.isToStopLooping = true; // will stop playing
    this.next(); // this will retart the thing // but it will be prone to keep looping
  }


  // will play the current given id or podcast whatever it is....
  play() {
    this.isPlayerPlaying = true;
    this.isPlayerActive = true;
    this.musicControls.updateIsPlaying(true);
    this.musicControls.updateDismissable(false);
    this.player.play();
  }

  pause() {
    this.isPlayerPlaying = false;
    this.isInTransition = false; // for the cases when it was marked paused before it start
    this.musicControls.updateIsPlaying(false);
    this.musicControls.updateDismissable(true);
    this.player.pause();
  }


  closePodcast() {
    this.player.stop();
    this.player.unload();
    this.currId = 0; // so that it refreshes everytime 
    this.musicControls.destroy();
    this.isPlayerActive = false;
    this.isPlayerPlaying = false;
    this.isInTransition = false;
  }


  startNewPlayer() {
    if (this.player) {
      this.player.unload(); // get rid of current player first
    }
    let srcAdress = [this.db.allWordsData[this.currId][5]]
    this.player = new Howl({
      src: srcAdress,
      html5: true,
      onplay: () => {
        console.log("onPlay");
        this.isPlayerActive = true;
        this.isPlayerPlaying = true;
        this.updateProgress();
        this.isInTransition = false;
      },
      onend: () => {
        // this will get triggered when the current podcast ends
        console.log('onEnd');
        if (this.iscontinousPlayer) {
          this.next();
        }
        else {
          this.isPlayerPlaying = false;
        }
      }
    });

  }




  tooglePlayer() {
    if (this.isPlayerPlaying) {
      this.pause();
    }
    else {
      this.play();
    }
  }

  seek(range) {
    let newValue = +range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  updateProgress() {
    let seek = this.player.seek();
    let duration = this.player.duration()
    this.progress = (seek / duration) * 100 || 0;
    if (this.isToSkipStartandEnd) {
      let adjustement = Math.floor((duration - 130) / 3)
      if (seek < (this.introSkipTime + adjustement)) {
        console.log(duration, adjustement, this.introSkipTime);
        this.player.seek(this.introSkipTime + adjustement)
      }
      if (seek >= (duration - (this.EndSkipTime + adjustement))) {
        console.log(duration, adjustement, this.EndSkipTime);
        this.player.seek(duration);
      }

    }
    setTimeout(() => {
      this.updateProgress();
    }, 100)
  }





  createNotification() {
    //this.musicControls.destroy();
    this.musicControls.create({
      track: this.db.allWordsData[this.currId][1],
      artist: this.db.allWordsData[this.currId][2],
      cover: "/assets/appIcon.png",
      isPlaying: true,
      dismissable: false,
      hasPrev: true,
      hasNext: true,
      hasSkipForward: false,
      hasSkipBackward: false,
      skipForwardInterval: 0,
      skipBackwardInterval: 0,
      hasClose: true,
      album: "",
      duration: 0,
      elapsed: 0,
      ticker: this.db.allWordsData[this.currId][1],
    });
    console.log("Notification started");

    this.musicControls.subscribe().subscribe(action => {
      console.log(action);

      const message = JSON.parse(action).message;

      switch (message) {
        case 'music-controls-next':
          this.next();
          break;

        case 'music-controls-previous':
          this.prev();
          break;
        case 'music-controls-pause':
          this.tooglePlayer();
          break;
        case 'music-controls-play':
          this.tooglePlayer();
          break;
        case 'music-controls-destroy':
          // Do something
          this.closePodcast();
          break;
        default:
          break;
      }

    })
    this.musicControls.listen();
  }
}

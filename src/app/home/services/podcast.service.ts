import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { DatabaseService } from './data-base.service';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  currId = 5;
  player: Howl = null;
  isPlayerActive: boolean = false; // is playeractive means whether to show the below popup or not 
  isPlayerPlaying = false;// means whether to show the below 
  progress = 0;
  continousPlayer: boolean = false;
  isInTransition = true;

  constructor(public musicControls: MusicControls, private db: DatabaseService) {
    this.startNewPlayer();
  }

  playPauseGivenId(wordId, isToPlay, isToPlayAll?) {

    // here goes all the logic of what need to be done and when it needs to be done
    if (!isToPlay) { // not to play means to pause
      this.pause();
      return;
    }
    this.currId = wordId;
    this.continousPlayer = isToPlayAll;
    this.startNewPlayer();
    this.play();
    this.createNotification();


  }




  prev() {
    let index = this.db.allSelectedWordIds.indexOf(this.currId);
    if (index > 0) {
      this.playPauseGivenId(this.db.allSelectedWordIds[index - 1], true);
    } else {
      this.playPauseGivenId(this.db.allSelectedWordIds[0], true);
    }
  }

  next() {
    // prone to boundary cases
    let index = this.db.allSelectedWordIds.indexOf(this.currId);
    let i = index + 1;
    while (i < this.db.allSelectedWordIds.length) {
      if (!this.db.allWordsData[i][5]) {
        i++; // if the podcast doesn't exist then move forward
      }
      else {
        this.playPauseGivenId(this.db.allSelectedWordIds[i], true);
        break;
      }
    }
  }


  // will play the current given id or podcast whatever it is....
  play() {
    this.isPlayerPlaying = true;
    this.isPlayerActive = true;
    this.musicControls.updateIsPlaying(true);
    this.musicControls.updateDismissable(false);
    this.isInTransition = true
    this.player.play();
  }

  pause() {
    this.isPlayerPlaying = false;
    this.musicControls.updateIsPlaying(false);
    this.musicControls.updateDismissable(true);
    this.player.pause();
  }


  closePodcast() {
    this.player.stop();
    this.player.unload()
    this.musicControls.destroy();
    this.isPlayerActive = false;
    this.isPlayerPlaying = false;
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
        if (this.continousPlayer) {
          this.next();
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
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 100)
  }





  createNotification() {
    this.musicControls.destroy();
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
          if (this.isPlayerActive) {
            this.tooglePlayer();
            this.isPlayerPlaying = true;
            this.musicControls.updateIsPlaying(false);
            this.musicControls.updateDismissable(true);
            console.log("music pause");
          }
          else {
            this.tooglePlayer()
            this.isPlayerPlaying = false;
            this.musicControls.updateIsPlaying(true);
            this.musicControls.updateDismissable(false);
          }
          break;
        case 'music-controls-play':
          // Do something
          if (!this.isPlayerActive) {
            console.log('music play');
            this.tooglePlayer();
            this.isPlayerPlaying = false;
            this.musicControls.updateIsPlaying(true);
            this.musicControls.updateDismissable(false);
          }
          else {
            console.log("music pause");
            this.tooglePlayer();
            this.isPlayerPlaying = true;
            this.musicControls.updateIsPlaying(false);
            this.musicControls.updateDismissable(true);
          }
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

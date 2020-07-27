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
  srcAdress = []

  constructor(public musicControls: MusicControls, private db: DatabaseService) {
    this.srcAdress.push(this.db.allWordsData[this.currId][5])

    this.player = new Howl({
      src: this.srcAdress,
      html5: true,
      onplay: () => {
        console.log("onPlay");
        this.isPlayerActive = true;
        this.isPlayerPlaying = false;
        this.updateProgress();
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

  playGivenId(wordId, isToPlayAll) {
    this.currId = wordId;
    if (!this.db.allWordsData[wordId][5]) {
      this.next()
      return
    }

    this.srcAdress = [this.db.allWordsData[this.currId][5]]
    this.changeSource();
    // write code to change src here..
    this.player.play();
    this.createNotification();


  }

  changeSource() {
    let self = this.player;
    this.player.unload();
    this.player._src = this.srcAdress;
    this.player.load();

  }



  changePodcastWord(wordId, playNext) {
    this.currId = wordId;
    if (!this.db.allWordsData[wordId][5]) {
      this.next()
      return
    }

    this.srcAdress = [this.db.allWordsData[this.currId][5]]
    this.changeSource();
    // write code to change src here..
    this.player.play();
    this.createNotification();
  }

  prev() {
    let index = this.db.allSelectedWordIds.indexOf(this.currId);
    if (index > 0) {
      this.changePodcastWord(this.db.allSelectedWordIds[index - 1], true);
    } else {
      this.changePodcastWord(this.db.allSelectedWordIds[0], true);
    }
  }

  next() {
    let index = this.db.allSelectedWordIds.indexOf(this.currId);
    if (index < this.db.allSelectedWordIds.length) {
      this.changePodcastWord(this.db.allSelectedWordIds[index + 1], true);
    } else {
      this.changePodcastWord(this.db.allSelectedWordIds[0], true);
    }

  }

  play() {
    this.player.play();
    this.isPlayerActive = true;
  }

  pause() {
    this.isPlayerPlaying = false;
    this.player.pause();
  }

  tooglePlayer(pause) {
    this.isPlayerActive = !pause;
    this.isPlayerPlaying = pause;
    if (pause) {
      this.player.pause();
      this.musicControls.updateIsPlaying(false);
      this.musicControls.updateDismissable(true);
    } else {
      this.player.play();
      this.musicControls.updateIsPlaying(true);
      this.musicControls.updateDismissable(false);
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

  closePodcast() {
    this.player.stop();
    this.musicControls.destroy();
    this.isPlayerActive = false;
    this.isPlayerPlaying = true;
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
            this.tooglePlayer(true);
            this.isPlayerPlaying = true;
            this.musicControls.updateIsPlaying(false);
            this.musicControls.updateDismissable(true);
            console.log("music pause");
          }
          else {
            this.tooglePlayer(false)
            this.isPlayerPlaying = false;
            this.musicControls.updateIsPlaying(true);
            this.musicControls.updateDismissable(false);
          }
          break;
        case 'music-controls-play':
          // Do something
          if (!this.isPlayerActive) {
            console.log('music play');
            this.tooglePlayer(false);
            this.isPlayerPlaying = false;
            this.musicControls.updateIsPlaying(true);
            this.musicControls.updateDismissable(false);
          }
          else {
            console.log("music pause");
            this.tooglePlayer(true);
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

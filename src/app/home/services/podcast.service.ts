import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { DatabaseService } from './data-base.service';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  currId;
  player: Howl = null;
  isPlaying = false;
  onPause = true;
  miniPlayerVisible = false;
  currWord;
  currMeaning;
  progress = 0;

  constructor(public musicControls: MusicControls,private db: DatabaseService) { }

  startPodcast(wordId, playNext) {
    this.currId = wordId;
    if (!this.db.allWordsData[wordId][5]) {
      this.next()
      return
    }
    if (this.player) {
      this.player.stop();
    }

    this.player = new Howl({
      src: [this.db.allWordsData[wordId][5]],
      html5: true,
      onplay: () => {
        console.log("onPlay");
        this.isPlaying = true;
        this.onPause = false;
        this.miniPlayerVisible = true;
        this.currId = wordId;
        this.currWord = this.db.allWordsData[this.currId][1];
        this.currMeaning = this.db.allWordsData[this.currId][2];
        this.updateProgress();
      },
      onend: () => {
        console.log('onEnd');
        if (playNext) {
          this.next();
        } else {
          this.miniPlayerVisible = false;
        }
      }
    });
    this.player.play();
    this.createNotification();
  }

  prev() {
    let index = this.db.allSelectedWordIds.indexOf(this.currId);
    if (index > 0) {
      this.startPodcast(this.db.allSelectedWordIds[index - 1], true);
    } else {
      this.startPodcast(this.currId, true);
    }
  }

  next() {
    let index = this.db.allSelectedWordIds.indexOf(this.currId);
    if (index != this.db.allSelectedWordIds.length - 1) {
      this.startPodcast(this.db.allSelectedWordIds[index + 1], true);
    } else {
      this.startPodcast(this.db.allSelectedWordIds[0], true);
    }

  }

  play() {
    this.player.play();
  }

  pause() {
    this.onPause = true;
    this.player.pause();
  }

  tooglePlayer(pause) {
    this.isPlaying = !pause;
    this.onPause = pause;
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
    this.miniPlayerVisible = false;
    this.isPlaying = false;
    this.onPause = true;
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
          if (this.isPlaying) {
            this.tooglePlayer(true);
            this.onPause = true;
            this.musicControls.updateIsPlaying(false);
            this.musicControls.updateDismissable(true);
            console.log("music pause");
          }
          else {
            this.tooglePlayer(false)
            this.onPause = false;
            this.musicControls.updateIsPlaying(true);
            this.musicControls.updateDismissable(false);
          }
          break;
        case 'music-controls-play':
          // Do something
          if (!this.isPlaying) {
            console.log('music play');
            this.tooglePlayer(false);
            this.onPause = false;
            this.musicControls.updateIsPlaying(true);
            this.musicControls.updateDismissable(false);
          }
          else {
            console.log("music pause");
            this.tooglePlayer(true);
            this.onPause = true;
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

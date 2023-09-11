import { Component, OnInit } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { Platform, LoadingController, ToastController } from "@ionic/angular";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-audio",
  templateUrl: "./audio.component.html",
  styleUrls: ["./audio.component.scss"],
})
export class AudioComponent implements OnInit {
  constructor(
    private file: File,
    private transfer: FileTransfer,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private media: Media,
    private datePipe: DatePipe
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is("ios")) {
        this.storageDirectory = this.file.dataDirectory;
      } else if (this.platform.is("android")) {
        this.storageDirectory = this.file.externalDataDirectory;
      } else {
        this.storageDirectory = this.file.cacheDirectory;
      }
    });
  }
  curr_playing_file: MediaObject;
  title = "I Have a Dream";
  filename = "SoundHelix-Song-1.mp3";
  storageDirectory: any;

  is_playing: boolean = false;
  is_in_play: boolean = false;
  is_ready: boolean = false;
  allUrls: any;
  message: any;

  duration: any = -1;
  position: any = 0;
  current: any = 0;
  get_duration_interval: any;
  get_position_interval: any;

  ngOnInit() {
    this.getAllUrls();
  }
  getAllUrls() {
    this.allUrls = [
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    ];
    this.prepareAudioFile(this.allUrls[this.current]);
  }
  prepareAudioFile(url: string) {
    // let url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    this.platform.ready().then(() => {
      this.file
        .resolveDirectoryUrl(this.storageDirectory)
        .then((resolvedDirectory) => {
          // inspired by: https://github.com/ionic-team/ionic-native/issues/1711
          console.log("resolved  directory: " + resolvedDirectory.nativeURL);
          this.file
            .checkFile(resolvedDirectory.nativeURL, this.filename)
            .then((data) => {
              if (data == true) {
                // exist
                this.getDurationAndSetToPlay();
              } else {
                // not sure if File plugin will return false. go to download
                console.log("not found!");
                throw { code: 1, message: "NOT_FOUND_ERR" };
              }
            })
            .catch(async (err) => {
              console.log("Error occurred while checking local files:");
              console.log(err);
              if (err.code == 1) {
                // not found! download!
                console.log("not found! download!");
                let loadingEl = await this.loadingCtrl.create({
                  message: "Downloading the song from the web...",
                });
                loadingEl.present();
                const fileTransfer: FileTransferObject = this.transfer.create();
                fileTransfer
                  .download(url, this.storageDirectory + this.filename)
                  .then((entry) => {
                    console.log("download complete" + entry.toURL());
                    loadingEl.dismiss();
                    this.getDurationAndSetToPlay();
                  })
                  .catch((err_2) => {
                    console.log("Download error!");
                    loadingEl.dismiss();
                    console.log(err_2);
                  });
              }
            });
        });
    });
  }
  createAudioFile(pathToDirectory, filename): MediaObject {
    if (this.platform.is("ios")) {
      //ios
      return this.media.create(
        pathToDirectory.replace(/^file:\/\//, "") + "/" + filename
      );
    } else {
      // android
      return this.media.create(pathToDirectory + filename);
    }
  }

  getDurationAndSetToPlay() {
    this.curr_playing_file = this.createAudioFile(
      this.storageDirectory,
      this.filename
    );

    this.curr_playing_file.play();
    this.curr_playing_file.setVolume(0.0); // you don't want users to notice that you are playing the file
    let self = this;
    this.get_duration_interval = setInterval(function () {
      if (self.duration == -1) {
        self.duration = ~~self.curr_playing_file.getDuration(); // make it an integer
      } else {
        self.curr_playing_file.stop();
        self.curr_playing_file.release();
        self.setRecordingToPlay();
        clearInterval(self.get_duration_interval);
      }
    }, 100);
  }

  getAndSetCurrentAudioPosition() {
    let diff = 1;
    let self = this;
    this.get_position_interval = setInterval(function () {
      let last_position = self.position;
      self.curr_playing_file.getCurrentPosition().then((position) => {
        if (position >= 0 && position < self.duration) {
          if (Math.abs(last_position - position) >= diff) {
            // set position
            self.curr_playing_file.seekTo(last_position * 1000);
          } else {
            // update position for display
            self.position = position;
          }
        } else if (position >= self.duration) {
          self.stopPlayRecording();
          // self.setRecordingToPlay();
          if (self.current < self.allUrls.length - 1) {
            self.current += 1;
            self.prepareAudioFile(self.allUrls[self.current]);
          } else {
            self.setRecordingToPlay();
          }
        }
      });
    }, 100);
  }

  setRecordingToPlay() {
    this.curr_playing_file = this.createAudioFile(
      this.storageDirectory,
      this.filename
    );
    this.curr_playing_file.onStatusUpdate.subscribe((status) => {
      // 2: playing
      // 3: pause
      // 4: stop
      this.message = status;
      switch (status) {
        case 1:
          this.is_in_play = false;
          break;
        case 2: // 2: playing
          this.is_in_play = true;
          this.is_playing = true;
          break;
        case 3: // 3: pause
          this.is_in_play = true;
          this.is_playing = false;
          break;
        case 4: // 4: stop
        default:
          this.is_in_play = false;
          this.is_playing = false;
          break;
      }
    });
    console.log("audio file set");
    this.message = "audio file set";
    this.is_ready = true;
    this.getAndSetCurrentAudioPosition();
  }

  playRecording() {
    this.curr_playing_file.play();
    this.toastCtrl
      .create({
        message: `Start playing from ${this.fmtMSS(this.position)}`,
        duration: 2000,
      })
      .then((toastEl) => toastEl.present());
  }

  pausePlayRecording() {
    this.curr_playing_file.pause();
    this.toastCtrl
      .create({
        message: `Paused at ${this.fmtMSS(this.position)}`,
        duration: 2000,
      })
      .then((toastEl) => toastEl.present());
  }

  stopPlayRecording() {
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;
  }

  controlSeconds(action) {
    let step = 15;

    let number = this.position;
    switch (action) {
      case "back":
        this.position = number < step ? 0.001 : number - step;
        this.toastCtrl
          .create({
            message: `Went back ${step} seconds`,
            duration: 2000,
          })
          .then((toastEl) => toastEl.present());
        break;
      case "forward":
        this.position =
          number + step < this.duration ? number + step : this.duration;
        this.toastCtrl
          .create({
            message: `Went forward ${step} seconds`,
            duration: 2000,
          })
          .then((toastEl) => toastEl.present());
        break;
      default:
        break;
    }
  }

  fmtMSS(s) {
    return this.datePipe.transform(s * 1000, "mm:ss");

    /** The following has been replaced with Angular DatePipe */
    // // accepts seconds as Number or String. Returns m:ss
    // return (
    //   (s - // take value s and subtract (will try to convert String to Number)
    //     (s %= 60)) / // the new value of s, now holding the remainder of s divided by 60
    //     // (will also try to convert String to Number)
    //     60 + // and divide the resulting Number by 60
    //   // (can never result in a fractional value = no need for rounding)
    //   // to which we concatenate a String (converts the Number to String)
    //   // who's reference is chosen by the conditional operator:
    //   (9 < s // if    seconds is larger than 9
    //     ? ':' // then  we don't need to prepend a zero
    //     : ':0') + // else  we do need to prepend a zero
    //   s
    // ); // and we add Number s to the string (converting it to String as well)
  }
  // startAudio = () => {
  //   this.curr_playing_file = this.media.create(this.play_The_track);
  //   this.curr_playing_file.play();
  // };
}

import { Component, OnInit } from '@angular/core';
import { DrawerState } from '@fivethree/core';
import { DatabaseService } from '../services/data-base.service';
import { ThemeChangeService } from '../services/theme-change.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
enum DrawerState2 {
  Docked = 1,
  Top = 2
};
@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {


  shouldBounce = true;
  dockedHeight = 500;
  distanceTop = 90;
  drawerState = DrawerState.Docked;
  states = DrawerState2
  masterCard = [1, 2, 3]

  handle = true;
  float = true;
  rounded = true;
  constructor(private db: DatabaseService, public modalController: ModalController, public toastController: ToastController, public alertController: AlertController, private themeService: ThemeChangeService) { }
  selectedSetType = "Importance Based" // will come from session

  ngOnInit() {

    this.db.fetchingSetDataCompleted.asObservable().subscribe(data => {
      // this is behaviour subject so if the event is already publish will send the previous data
      // otherwise wiat for the new data to be send which will definetly occur at some point of time
      if (data) {
        this.saveData()
      }
    });
    if (this.db.allSetData) { // in case the even in already published and has set the data
      this.saveData();
    }


  }


  saveData() {


  }
}

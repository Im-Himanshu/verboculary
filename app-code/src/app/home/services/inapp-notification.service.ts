import { Injectable } from '@angular/core';

import { LocalNotifications, ELocalNotificationTriggerUnit } from "@ionic-native/local-notifications/ngx";

@Injectable({
  providedIn: 'root'
})
export class InappNotificationService {

  constructor(public localNotification : LocalNotifications) { }

  createPractiseNotification(){
    this.localNotification.schedule({
      title: "Get Back To Practise",
      trigger: { in: 2, unit: ELocalNotificationTriggerUnit.SECOND },
    })
  }

  createCustomNotification(Id,title,text){
    this.localNotification.schedule({
      id: Id,
      title: title,
      text: text,
      trigger: {in: 1,unit: ELocalNotificationTriggerUnit.DAY},
    })
  }

  dailyNotification(){
    this.localNotification.schedule({
      title: "Verboculary",
      text: "Get Back To Practise",
      trigger: {in: 1,unit: ELocalNotificationTriggerUnit.DAY},
    })
    console.log("LOCAL NOTIFICATION SCHEDULED");
  }
}

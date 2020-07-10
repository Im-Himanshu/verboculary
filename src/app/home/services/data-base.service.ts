import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { wordAppData } from "../interfaces/wordAppData.interface";
import { processedDataSharing } from "../interfaces/dropdown.interface";
import { Subject, forkJoin, Observable } from "rxjs";
import { appSessionData } from "../appSessionData.interface";
import { ToastController } from "@ionic/angular";
import { PRIMARY_OUTLET } from '@angular/router';

const STORAGE_KEY_AppData = "wordsAppData";
const STORAGE_KEY_SetData = "setData";
const STORAGE_KEY_WordData = "wordData";
const STORAGE_KEY_sessionData = "sessionData";
@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  public allSetData: processedDataSharing;

  allSelectedWordIDs: any;

  // for event when the word state is chnaged like marked, unmarked so to publish this to all
  // this is the only way to fetch starting with null to create a if condition
  public wordDynamicData: any; // this always need to in synced with the stored data;
  public allWordsData: any;
  isDataFetched: boolean = false;
  public allSelectedWordIds: any;
  public filteredSelectedWordIds: any;
  public selectedCategory;
  public appSessionData: appSessionData;



  constructor(
    public storage: Storage,
    public http: HttpClient,
    public toastController: ToastController
  ) {
  }

  // one time function, have to reset all the data if need to reset all the progress.

  isTheUserNew() {
    //just check if the user-session data exist if yes then redirect to the actual screen
    let isTheUserNew = true;
    let promise1 = new Promise((resolve1, reject) => {
      this.getAllWordsStateFromStorage().then(data => {
        if (!data) {
          this.reStartWordDynamicData().then(data => {
            resolve1(false);
          }

          ); // this will save the initiate the data in cache memory
        } else {
          this.wordDynamicData = data; // will save the data
          resolve1(true); // there was session data
        }
      });
    })

    let promise2 = new Promise((resolve2, reject) => {
      this.getSetDataFromStorage().then(data => {
        if (!data) {
          this.reStartSetDynamicData(); // this will create the set data in data-base
          resolve2(false);
        } else {
          this.allSetData = data;
          resolve2(true);
        }
      });

    })

    let promise3 = this.getAllWordsDataFromJSON();

    let allPromises: Observable<any> = forkJoin(promise1, promise2, promise3)
    return allPromises;



  }


  // to be executed only when no data is found in session
  private reStartSetDynamicData() {
    return new Promise((resolve, reject) => {
      let output: processedDataSharing = {} as processedDataSharing;
      let allCategoryType = [];
      let allSetOfcategory = {};
      let allWordOfSets = {};
      output.allCategoryType = allCategoryType; // here we only need to change the JSON to populate the dropDown no need of hardcoding
      output.allSetOfcategory = allSetOfcategory;
      output.allWordOfSets = allWordOfSets;
      this.getSetDataFromJSON().subscribe(data => {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var allSets = data[key];
            allCategoryType.push(key);
            allSetOfcategory[key] = Object.keys(allSets);
            for (var set in allSets) {
              allWordOfSets[set] = allSets[set];
            }
          }
        }
        this.allSetData = output;
        this.setSetDatainStorage(output);
        resolve("reset all the set Data");
      });
    })



  }

  //to be executed only when no data is found in session
  private reStartWordDynamicData() {
    return new Promise((resolve, reject) => {
      let allWords = {};
      let i = 0;
      this.getData().subscribe(data => {
        for (var key in data) {
          i++;
          if (data.hasOwnProperty(key)) {
            var val = data[key]; // all word data
            let wordData: wordAppData = {} as wordAppData;
            allWords[key] = wordData;
            wordData.id = key;
            wordData.word = val[1];
            wordData.isMarked = false;
            wordData.isSeen = false;
            wordData.isMastered = false;
            wordData.correctCount = 0;
          }
        }
        this.setAllWordsStateinStorage(allWords);
        this.wordDynamicData = allWords; // only first time the app is loaded
        resolve("restarted all words Dynamic Data");
      });

    })
  }

  private getAllWordsDataFromJSON() {
    return new Promise((resolve, reject) => {
      this.getData().subscribe((data: any) => {
        this.allWordsData = data;
        this.isDataFetched = true;
        resolve("fetched all words data");
        //this.fetchingWordDataCompleted.next(data);
        //this.fetchingWordDataCompleted.complete();
      });
    })

  }











  getData() {
    return this.http.get("assets/csvToJsonData.json");
  }

  getSetDataFromJSON() {
    return this.http.get("assets/setDivision.json");
  }

  getOneWordState(wordId) {
    // getting it from the RAM data only
    let oneWordData: wordAppData = this.wordDynamicData[wordId];
    return oneWordData;
  }
  getMultipleWordsState(wordIds: string[]) {
    let allWordData = {};
    if (!wordIds || wordIds.length == 0) {
      return {};
    }
    for (let wordId of wordIds) {
      let oneWordData: wordAppData = this.wordDynamicData[wordId];
      allWordData[wordId] = oneWordData;
    }
    return this.wordDynamicData; // giving it all it causing un-necassary trouble
  }

  saveCurrentStateofDynamicData() {
    return this.setAllWordsStateinStorage(this.wordDynamicData); // can only be stored from this function
  }

  setOneWordState(wordData: wordAppData) {
    return this.getAllWordsStateFromStorage().then(result => {
      if (result) {
        let id = wordData.id;
        result[id] = wordData; // update the word in the dynamic data;
        return this.setAllWordsStateinStorage(result);
      } else {
        this.reStartWordDynamicData();
        return this.setOneWordState(wordData);
      }
    });
  }

  public reSetApp() {
    this.storage.clear().then(data => {
      this.reStartSetDynamicData();
      this.reStartWordDynamicData();
      this.presentToast("All progress has been Reset."); // to save the session data from getting destroyed
    });
  }
  // only word by word state change is allowed
  private getAllWordsStateFromStorage() {
    return this.storage.get(STORAGE_KEY_AppData);
  }
  // not having a checker but should be checked before using it
  private setAllWordsStateinStorage(data) {
    return this.storage.set(STORAGE_KEY_AppData, data);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  // return a promise of type set Data type
  public getSetDataFromStorage(): Promise<processedDataSharing> {
    return this.storage.get(STORAGE_KEY_SetData);
  }
  // not having a checker but should be checked before using it
  private setSetDatainStorage(data) {
    return this.storage.set(STORAGE_KEY_SetData, data);
  }

  public getSessionDataFromStorage(): Promise<appSessionData> {
    return this.storage.get(STORAGE_KEY_sessionData);
  }
  // not having a checker but should be checked before using it
  public setSessionDatainStorage() {
    return this.storage.set(STORAGE_KEY_sessionData, this.appSessionData);
  }

  // this will shuffle the given array
  public shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  public sortIdsAlphabetically(WordIds: string[]) {
    if (!this.allWordsData) {
      return; // will call again after the data is set
    }

    let FeedListtoSort = [];
    for (let wordID of WordIds) {
      let crntData = {};
      crntData["word"] = this.allWordsData[wordID][1];
      crntData["id"] = wordID;
      FeedListtoSort.push(crntData);
    }
    FeedListtoSort.sort(this.compareForsortAlphabetically);
    let index = 0;
    for (let sortedList of FeedListtoSort) {
      WordIds[index] = sortedList["id"]; // this will updated the current object without removing the object
      index++;
    }
  }

  compareForsortAlphabetically(wordsData1, wordsData2) {
    if (wordsData1["word"] < wordsData2["word"]) {
      return -1;
    }
    if (wordsData1["word"] > wordsData2["word"]) {
      return 1;
    }
    return 0;
  }
}

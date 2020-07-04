import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { wordAppData } from "../interfaces/wordAppData.interface";
import { processedDataSharing } from "../interfaces/dropdown.interface";
import { Subject } from "rxjs";
import { appSessionData } from "../appSessionData.interface";
import { ToastController } from "@ionic/angular";

const STORAGE_KEY_AppData = "wordsAppData";
const STORAGE_KEY_SetData = "setData";
const STORAGE_KEY_WordData = "wordData";
const STORAGE_KEY_sessionData = "sessionData";
@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  public allSetData: processedDataSharing;

  // this is for the event when the sets data has been fetched from the localstorage
  public fetchingSetDataCompleted: Subject<any> = new Subject<any>();
  public fetchingWordDataCompleted: Subject<any> = new Subject<any>();
  allSelectedWordIDs: any;
  // thie is for the event, user changes the set from the dropdown and selected word changes
  public wordListChangeEvent: Subject<any> = new Subject<any>();

  // for event when the word state is chnaged like marked, unmarked so to publish this to all
  // this is the only way to fetch starting with null to create a if condition
  public wordDynamicData: any; // this always need to in synced with the stored data;
  public allWordsData: any;
  isDataFetched: boolean = false;
  public allSelectedWordIds: any;
  public filteredSelectedWordIds: any;
  public selectedCategory;
  public appSessionData: appSessionData;

  ///this have to be changed based on the dataset Name
  private defaultappSessionData: appSessionData = {
    selectedCategory: "Set Based",
    selectedSet: ["Set 1"],
    selectedFilter: "all",
    selectedSorting: "shuffle"
  };

  constructor(
    public storage: Storage,
    public http: HttpClient,
    public toastController: ToastController
  ) {
    this.processSetDataIfNotExist();
    this.ProcessWordDynamicDataIfNotExist(); //  this is the dynamic app data, to be fetched from the local storage and initiated only once in ap lifecycle
    // this need to be resave everytime in localstorage because it is dynamic
  }

  // one time function, have to reset all the data if need to reset all the progress.
  processSetDataIfNotExist() {
    return this.getSetDataFromStorage().then(data => {
      if (!data) {
        let output: processedDataSharing = {} as processedDataSharing;
        let allCategoryType = [];
        let allSetOfcategory = {};
        let allWordOfSets = {};
        output.allCategoryType = allCategoryType; // here we only need to change the JSON to populate the dropDown no need of hardcoding
        output.allSetOfcategory = allSetOfcategory;
        output.allWordOfSets = allWordOfSets;
        if (!data) {
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
            this.setSetDatainStorage(output).then(data => {
              this.fetchSetDataFromLocalStorage();
            }); // after the data is processed save it in the local storage, this could be retrived later and need not to be processed again and again
          });
        }
      } else {
        this.fetchSetDataFromLocalStorage();
        //return this.getSetDataFromStorage();
      }
    });
  }
  ProcessWordDynamicDataIfNotExist() {
    this.getAllWordsStateFromStorage().then(data => {
      if (!data) {
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
            }
          }
          this.setAllWordsStateinStorage(allWords);
          this.wordDynamicData = allWords; // only first time the app is loaded
          return this.getAllWordsDataFromJSON();
        });
      } else {
        this.wordDynamicData = data; // will save the data
        return this.getAllWordsDataFromJSON();
      }
    });
  }

  getAllWordsDataFromJSON() {
    this.getData().subscribe((data: any) => {
      this.allWordsData = data;
      this.isDataFetched = true;
      this.fetchingWordDataCompleted.next(data);
      //this.fetchingWordDataCompleted.complete();
    });
  }

  fetchSetDataFromLocalStorage() {
    this.getSetDataFromStorage().then(data => {
      this.allSetData = data;
      this.processAppSesionData(data);
    });
  }

  processAppSesionData(data2) {
    this.getSessionDataFromStorage().then((data: appSessionData) => {
      if (data) {
        this.appSessionData = data;
      } else {
        this.appSessionData = this.defaultappSessionData;
        this.setSessionDatainStorage();
      }
      this.fetchingSetDataCompleted.next(data2); // data2 otherwise null is send in the event
    });
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
        this.ProcessWordDynamicDataIfNotExist();
        return this.setOneWordState(wordData);
      }
    });
  }

  public reSetApp() {
    this.storage.clear().then(data => {
      this.processSetDataIfNotExist();
      this.ProcessWordDynamicDataIfNotExist();
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

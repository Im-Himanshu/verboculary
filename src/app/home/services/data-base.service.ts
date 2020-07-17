import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { Storage } from "@ionic/storage";
import { wordAppData } from "../interfaces/wordAppData.interface";
import { processedDataSharing, setLevelProgress } from "../interfaces/dropdown.interface";
import { Subject, forkJoin, Observable } from "rxjs";
import { appSessionData } from "../appSessionData.interface";
import { ToastController } from "@ionic/angular";
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';

const STORAGE_KEY_AppData = "wordsAppData";
const STORAGE_KEY_SetData = "setData";
const STORAGE_KEY_WordData = "wordData";
const STORAGE_KEY_sessionData = "sessionData";
@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  public allSetData: processedDataSharing;
  public wordsDynamicData: any; // this always need to in synced with the stored data;
  public allWordsData: any;
  isDataFetched: boolean = false;
  public allSelectedWordIds: any;
  public allSelectedWordIdsFiltered: any = [];
  public filteredSelectedWordIds: any;
  public selectedSet = "beginner-1";
  public selectedCategory: any = "Importance Based"; // by default will pick-up set from this...
  public allSetinSelectedCategory;
  public wordFilterChangeEvent: Subject<any> = new Subject();

  constructor(
    public storage: Storage,
    public http: HttpClient,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events.forEach((event: NavigationEvent) => {
      //After Navigation, because firstchild are populated only till navigation ends
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.startsWith("/mainmodule/base/wordSets")) {
          this.route.firstChild.firstChild.firstChild.paramMap.subscribe(params => {
            if (params.get('setName')) {
              this.selectedSet = params.get('setName');
              //this.selectedSet = "Begineer-1";
              if (!this.allSelectedWordIdsFiltered.length)
                //to make sure db doesn't change all the computed filters to default
                this.getAllwordsOfSelectedSet();
            }
          })
        }
      }
    });
  }


  getAllwordsOfSelectedSet() {
    // first process after all the data is laoded from the data base...
    if (this.allSetData) {
      this.allSelectedWordIds = this.allSetData.allWordOfSets[this.selectedSet];
      this.allSetinSelectedCategory = this.allSetData.allSetOfcategory[this.selectedCategory];
      for (var i = 0; i < this.allSelectedWordIds.length; i++) {
        this.allSelectedWordIdsFiltered.push(this.allSelectedWordIds[i]);
      }
      // this will save all the selected word IDs which will be displayed
    }
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
          this.wordsDynamicData = data; // will save the data
          resolve1(true); // there was session data
        }
      });
    })

    let promise2 = new Promise((resolve2, reject) => {
      this.getSetDataFromStorage().then(data => {
        if (!data) {
          this.reStartSetDynamicData().then(data => {
            resolve2(false); // this will create the set data in data-base
          });
        } else {
          this.allSetData = data;
          this.generateTotalProgressReportTillToday()
          resolve2(true);
        }
      });

    })

    let promise3 = this.getAllWordsDataFromJSON();

    let allPromises: Observable<any> = forkJoin(promise1, promise2, promise3)
    return allPromises;

  }


  generateTotalProgressReportTillToday() {

    // this function will run through all the sets progress and calculate progress report till today

    let setLevelProgress = this.allSetData.setLevelProgressData;
    let allSets = this.allSetData.allSetOfcategory[this.selectedCategory]; // all 
    let totalViewed = 0;
    let totalLearned = 0;
    let totalAllWords = 0;

    for (let oneSet of allSets) {
      let setViewed = setLevelProgress[oneSet]["totalViewed"];
      let setLearned = setLevelProgress[oneSet]["totalLearned"];
      let totalWords = setLevelProgress[oneSet]["totalWords"];
      totalViewed += setViewed;
      totalLearned += setLearned
      totalAllWords += totalWords
    }
    let newProgressReportEntry = {
      "viewed": totalViewed,
      "learned": totalLearned
    }
    let todaysDate = (new Date()).toLocaleDateString(); // MM/DD/YYYY format will be published

    //(new Date()).toLocaleString() -- >  "7/17/2020, 7:05:31 PM"

    // will keep only one entry for one date that is computed every time the applicaTION IS loaded for the first time itself
    this.allSetData.dateWiseTotalProgressReport[todaysDate] = newProgressReportEntry;
    this.saveCurrentStateofDynamicData();
    console.log("total words used for the chartign ; ", totalAllWords)
  }


  // to be executed only when no data is found in session
  private reStartSetDynamicData() {
    return new Promise((resolve, reject) => {
      let output: processedDataSharing = {} as processedDataSharing;
      let allCategoryType = [];
      let allSetOfcategory = {};
      let allWordOfSets = {};
      let setLevelProgressData = {}
      let todaysDate = new Date().toDateString();
      let dateWiseTotalProgressReport = {} // "date" :  #number of wordsword maping
      dateWiseTotalProgressReport[todaysDate] = { "viewed": 0, "learned": 0 };
      output.allCategoryType = allCategoryType; // here we only need to change the JSON to populate the dropDown no need of hardcoding
      output.allSetOfcategory = allSetOfcategory;
      output.allWordOfSets = allWordOfSets;
      output.setLevelProgressData = setLevelProgressData;
      output.dateWiseTotalProgressReport = dateWiseTotalProgressReport;
      this.getSetDataFromJSON().subscribe(data => {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var allSets = data[key];
            allCategoryType.push(key);
            allSetOfcategory[key] = Object.keys(allSets);
            for (var set in allSets) {
              allWordOfSets[set] = allSets[set];
              let setProgress = {} as setLevelProgress;
              setProgress.totalLearned = 0;
              setProgress.totalViewed = 0;
              setProgress.totalWords = allSets[set].length
              setLevelProgressData[set] = setProgress;
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
        this.wordsDynamicData = allWords; // only first time the app is loaded
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
      });
    })

  }


  changeSortingOfIds(sortingType) {
    if (sortingType == 'alpha') {
      this.allSelectedWordIdsFiltered.sort(function (a, b) {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      })
    }
    else {
      // randomly shuffled 
      var currentIndex = this.allSelectedWordIdsFiltered.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this.allSelectedWordIdsFiltered[currentIndex];
        this.allSelectedWordIdsFiltered[currentIndex] = this.allSelectedWordIdsFiltered[randomIndex];
        this.allSelectedWordIdsFiltered[randomIndex] = temporaryValue;
      }

    }
  }

  filterSelectedIDBasedOnGivenCriterion(filterName) {

    // reset all the given IDs
    this.allSelectedWordIdsFiltered.splice(0, this.allSelectedWordIdsFiltered.length);
    for (var i = 0; i < this.allSelectedWordIds.length; i++) {
      let crntId = this.allSelectedWordIds[i]

      if (filterName == 'all') {
        // push all of them
        this.allSelectedWordIdsFiltered.push(crntId);
      }
      if (filterName == 'viewed') {
        if (this.wordsDynamicData[crntId].isSeen) {
          this.allSelectedWordIdsFiltered.push(crntId)
        }
      }
      if (filterName == 'marked') {
        if (this.wordsDynamicData[crntId].isMarked) {
          this.allSelectedWordIdsFiltered.push(crntId)
        }
      }

    }
    this.wordFilterChangeEvent.next(true);

  }


  getData() {
    return this.http.get("assets/csvToJsonData.json");
  }

  getSetDataFromJSON() {
    return this.http.get("assets/setDivision.json");
  }

  getOneWordState(wordId) {
    // getting it from the RAM data only
    let oneWordData: wordAppData = this.wordsDynamicData[wordId];
    return oneWordData;
  }
  getMultipleWordsState(wordIds: string[]) {
    let allWordData = {};
    if (!wordIds || wordIds.length == 0) {
      return {};
    }
    for (let wordId of wordIds) {
      let oneWordData: wordAppData = this.wordsDynamicData[wordId];
      allWordData[wordId] = oneWordData;
    }
    return this.wordsDynamicData; // giving it all it causing un-necassary trouble
  }

  saveCurrentStateofDynamicData() {
    this.setSetDatainStorage(this.allSetData)
    return this.setAllWordsStateinStorage(this.wordsDynamicData); // can only be stored from this function

  }


  // these are the set created dynamically for keeping only either viewed/learned/marked words
  editWordIdInDynamicSet(setName, wordID, isToAdd: boolean) {
    // first check if it already exist or not...
    let oneSetData = this.allSetData.allWordOfSets[setName];
    if (!oneSetData) {
      oneSetData = [];
      this.allSetData.allWordOfSets[setName] = oneSetData;
    }
    if (!oneSetData.includes(wordID) && isToAdd) {
      oneSetData.push(wordID);
      this.editSetLevelProgress(setName, isToAdd) // increase only when it was not already availaible
    }
    else if (!isToAdd) {
      const index = oneSetData.indexOf(wordID);
      if (index > -1) {
        oneSetData.splice(index, 1);
        this.editSetLevelProgress(setName, isToAdd) // decrease count only when it was in the learned list
      }
    }

  }

  editSetLevelProgress(setName, isToAdd) {

    let setProgressData = this.allSetData.setLevelProgressData[this.selectedSet] as setLevelProgress;
    let statName;
    if (setName == "allViewed") {
      statName = "totalViewed"
    }
    else if (setName == "allLearned") {
      statName = "totalLearned"
    }
    else return;
    if (isToAdd) {
      setProgressData[statName] = setProgressData[statName] + 1
    }
    else {
      setProgressData[statName] = setProgressData[statName] - 1
    }

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

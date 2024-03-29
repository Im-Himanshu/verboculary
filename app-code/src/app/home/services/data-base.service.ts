import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { Storage } from "@ionic/storage";
import { wordAppData, appNameToUINameMapping } from "../interfaces/wordAppData.interface";
import { processedDataSharing, setLevelProgress } from "../interfaces/dropdown.interface";
import { Subject, forkJoin, Observable, BehaviorSubject } from "rxjs";
import { ToastController } from "@ionic/angular";
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { AdmobSerService } from './admob-ser.service';
import { AngularFirestore } from '@angular/fire/firestore'
import { FirebaseOperationsService } from "./firebase-operations.service"
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
  public selectedWordIDsChangeEvent: Subject<any> = new Subject();
  public activeTabIndex: number = 0;
  public isSearchBarVisible: boolean = false;
  public isToShowSearchBar = false;
  public isToRemoveCompleteSearch = false;
  public selectedFilter = 'all';
  public deleteMe;
  public isNavigationLoading = false;
  public appNametoUINameMapping = new appNameToUINameMapping().appNametoUINamemapping;
  public wordDataObservable = new BehaviorSubject([]);

  constructor(
    public storage: Storage,
    public http: HttpClient,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    public admob: AdmobSerService,
    public fireBaseService: FirebaseOperationsService
  ) {
    router.events.forEach((event: NavigationEvent) => {
      //After Navigation, because firstchild are populated only till navigation ends
      if (event instanceof NavigationEnd) {
        this.isNavigationLoading = false;
        if (event.urlAfterRedirects.startsWith("/mainmodule/base/dashboard")) {
          this.selectedFilter = 'all'
          this.selectedSet = "allWords" // resetting this here as in ngOndestroy it was causing bugs

        }
        if (event.urlAfterRedirects.startsWith("/mainmodule/base/wordSets")) {
          this.route.firstChild.firstChild.firstChild.paramMap.subscribe(params => {
            if (params.get('setName')) {
              this.selectedSet = params.get('setName');
              this.getAllwordsOfSelectedSet();
              if ((this.selectedSet !== "allWords")) {
                this.isToRemoveCompleteSearch = true;
              }
              else {
                this.allSelectedWordIdsFiltered.splice(0, this.allSelectedWordIdsFiltered.length);
              }
            }
          })
        }
      }
    });
  }




  onSearchQueryChange(searchQuery: string) {
    if (!this.isToShowSearchBar) {
      return; // not do anything if it is not shown
    }
    if (searchQuery.length <= 0) {
      return;
    }
    //console.log(searchQuery);
    this.allSelectedWordIdsFiltered.splice(0, this.allSelectedWordIdsFiltered.length);
    let count = 0;
    for (var i = 0; i < this.allSelectedWordIds.length; i++) {
      if (this.allWordsData[this.allSelectedWordIds[i]]['word'].indexOf(searchQuery) != -1) {
        this.allSelectedWordIdsFiltered.push(this.allSelectedWordIds[i]);
        count++
      }
      if (count > 10) {
        break; // showing max of 10
      }
    }
  }

  getAllwordsOfSelectedSet() {
    // first process after all the data is laoded from the data base...
    if (this.allSetData) {
      console.log(Object.keys(this.allSetData.dateWiseTotalProgressReport).length);
      this.allSelectedWordIds = this.allSetData.allWordOfSets[this.selectedSet];
      this.allSetinSelectedCategory = this.allSetData.allSetOfcategory[this.selectedCategory];
      this.allSelectedWordIdsFiltered.splice(0, this.allSelectedWordIdsFiltered.length);
      for (var i = 0; i < this.allSelectedWordIds.length; i++) {
        this.allSelectedWordIdsFiltered.push(this.allSelectedWordIds[i]);
      }
      this.filterSelectedIDBasedOnGivenCriterion(this.selectedFilter); // when routing is reverted then reset this
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
          resolve2(true);
        }
      });

    })

    let promise3 = this.getAllWordsDataFromJSON();
    let promise4 = this.admob.fetchAdMobIdsFromFirebase();

    let allPromises: Observable<any> = forkJoin(promise1, promise2, promise3, promise4)
    return allPromises;

  }


  generateTotalProgressReportTillToday() {
    // be very careful in triggering this function as this sets all the other

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
      let todaysDate = new Date().toLocaleDateString();
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
              setProgress.isAdShown = false;
              setProgress.totalWords = allSets[set].length
              setLevelProgressData[set] = setProgress;
            }
          }
        }
        for (let i = 0; i < 1209; i++) {
          allWordOfSets["allWords"].push(i);
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
            wordData.isViewed = false;
            wordData.isLearned = false;
            wordData.correctCount = 0;
            wordData.learnedDate = null;
            wordData.viewedDate = null;
            wordData.notes = null;
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


  // this function do an inplace insertionSort of the given array
  private customSortOfArray(array) {
    for (let outer = 1; outer < array.length; outer++) {
      for (let inner = 0; inner < outer; inner++) {
        let wordInner = this.allWordsData[array[inner]]['word'];
        let wordOuter = this.allWordsData[array[outer]]['word']
        //let isToReplace = this.allWordsData[array[outer]][1] < 
        if (wordOuter < wordInner) {
          const [element] = array.splice(outer, 1)
          array.splice(inner, 0, element)
        }
      }
    }
    //console.log(array.join(' '))
    return array
  }

  public sortDates(a: string, b: string) {
    // these string are expected to be dates
    let a2 = new Date(a);
    let b2 = new Date(b)
    return (a2.getTime() - b2.getTime());
  }


  changeSortingOfIds(sortingType) {
    if (sortingType == 'alpha') {
      this.customSortOfArray(this.allSelectedWordIdsFiltered);
      //this.allSelectedWordIdsFiltered.sort(this.compareTwoIds);
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
    this.afterSelectedWordIdsUpdated('sorting');
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
        if (this.wordsDynamicData[crntId].isViewed) {
          this.allSelectedWordIdsFiltered.push(crntId)
        }
      }
      else if (filterName == 'notViewed') {
        if (!this.wordsDynamicData[crntId].isViewed) {
          this.allSelectedWordIdsFiltered.push(crntId)
        }
      }
      if (filterName == 'marked') {
        if (this.wordsDynamicData[crntId].isMarked) {
          this.allSelectedWordIdsFiltered.push(crntId)
        }
      }
      else if (filterName == 'notMarked') {
        if (!this.wordsDynamicData[crntId].isMarked) {
          this.allSelectedWordIdsFiltered.push(crntId)
        }
      }
      if (filterName == 'learned') {
        if (this.wordsDynamicData[crntId].isLearned) {
          this.allSelectedWordIdsFiltered.push(crntId)
        }
      }
      else if (filterName == 'notLearned') {
        if (!this.wordsDynamicData[crntId].isLearned) {
          this.allSelectedWordIdsFiltered.push(crntId)
        }
      }

    }
    this.afterSelectedWordIdsUpdated('filter');



  }

  afterSelectedWordIdsUpdated(type: 'sorting' | 'filter') {
    if (type == 'filter') {
      this.wordFilterChangeEvent.next(true);
    }
    this.selectedWordIDsChangeEvent.next(true);

  }


  getData() {
    return this.http.get("assets/allWordsData.json");
  }

  getSetDataFromJSON() {
    return this.http.get("assets/setDivision.json");
  }

  checkForAdvertisement() {
    let x = (this.allSetData.allWordOfSets["allViewed"].length + 1) % 50;
    if (x == 0) {
      this.admob.showInterstitialAds();
    }
    let data = this.allSetData;
    let adTrigger = data.setLevelProgressData;
    if (!(adTrigger[this.selectedSet]["isAdShown"])) {
      if (adTrigger[this.selectedSet]["totalViewed"] >= adTrigger[this.selectedSet]["totalWords"] && adTrigger[this.selectedSet]["totalViewed"] != 0) {
        this.admob.showAdMobFreeRewardVideoAds();
        data.setLevelProgressData[this.selectedSet]["isAdShown"] = true;
        console.log("Reward Video Ad is Shown");
      }
    }

  }

  saveCurrentStateofDynamicData() {
    this.checkForAdvertisement(); // to check if a video or banner add can be shown to the user or not
    this.setSetDatainStorage(this.allSetData)
    return this.setAllWordsStateinStorage(this.wordsDynamicData); // can only be stored from this function

  }

  // all the process for syncing in this just pass the new state and property
  changeWordIdState(wordId, stateToEdit, newState: boolean) {
    // this function will sync all the task need to be done for any change...
    this.deleteMe = this.allSetData.setLevelProgressData[this.selectedSet];
    if (stateToEdit == 'isViewed') {
      this.updateSetLevelProgressCount(wordId, 'isViewed', newState);
      this.editDateinWordDynamicData(wordId, "viewedDate", newState); // data-1 is in sync till now
      this.updateDynamicSet(wordId, "allViewed", newState); // add/remove the id from the dynamic set
    }
    if (stateToEdit == 'isLearned') {
      this.updateSetLevelProgressCount(wordId, 'isLearned', newState);
      this.editDateinWordDynamicData(wordId, "learnedDate", newState)
      this.updateDynamicSet(wordId, "allLearned", newState);
    }
    if (stateToEdit == 'isMarked') {
      this.updateSetLevelProgressCount(wordId, 'isMarked', newState);
      //this.editDateinWordDynamicData(wordId, "markedDate", newState)
      this.updateDynamicSet(wordId, "allMarked", newState);
    }
    this.saveCurrentStateofDynamicData(); // this will save whatever be the state of progress

  }
  private updateSetLevelProgressCount(wordId, stateToEdit, newState) {
    let statName;
    if (stateToEdit == "isViewed") {
      statName = "totalViewed"
    }
    else if (stateToEdit == "isLearned") {
      statName = "totalLearned"
    }
    else {
      this.wordsDynamicData[wordId][stateToEdit] = newState;
      return; // for other cases returning for // "isMarked case"
    }
    if (stateToEdit != "isMarked") {

      // here this.selectedSet need to changed because sometime word is opened outside of its sets as well like in allWords.
      let setToBeUpdated = this.selectedSet; // have to change this afterwards for more accuracy
      let setProgressData = this.allSetData.setLevelProgressData[setToBeUpdated] as setLevelProgress;
      if (!this.wordsDynamicData[wordId][stateToEdit] && newState) {
        // if word is not viewed and newstate is true then update count;
        setProgressData[statName] = setProgressData[statName] + 1
      }
      else if (this.wordsDynamicData[wordId][stateToEdit] && !newState) {
        // if word is not viewed and newstate is true then update count;
        setProgressData[statName] = setProgressData[statName] - 1 // if removing
      }
      else {
        console.log("no state was updated!! as it was already there")
      }
    }

    this.wordsDynamicData[wordId][stateToEdit] = newState; // now update the wordDynamic data

  }

  runSyncOperationForSetLevelOperation() {
    let allWordIds = this.allSetData.allWordOfSets[this.selectedSet];
    let setLevelProgress = this.allSetData.setLevelProgressData[this.selectedSet];
    let totalViewed = 0;
    let totalLearned = 0;
    for (let oneId of allWordIds) {
      let oneWordData = this.wordsDynamicData[oneId];
      if (oneWordData["isViewed"]) {
        totalViewed++;
      }
      if (oneWordData["isLearned"]) {
        totalLearned++;
      }
    }
    setLevelProgress["totalViewed"] = totalViewed;
    setLevelProgress["totalLearned"] = totalLearned;
  }

  private editDateinWordDynamicData(wordId, dateTitle, newState) {
    // only update date if it is not availaible previously or has been unmarked -- null, and then marked
    if ((!this.wordsDynamicData[wordId][dateTitle]) && newState) {
      // if date is empty and newState is true edit the date
      this.wordsDynamicData[wordId][dateTitle] = (new Date()).toUTCString();
    }
    else {
      // if date is there or newState is false;
      this.wordsDynamicData[wordId][dateTitle] = null;
    }
  }

  private updateDynamicSet(wordID, dynamicSetName, isToAdd: boolean) {
    // first check if it already exist or not...
    let oneSetData = this.allSetData.allWordOfSets[dynamicSetName];
    if (!oneSetData) {
      // boundary cases
      oneSetData = [];
      this.allSetData.allWordOfSets[dynamicSetName] = oneSetData;
    }
    if (!(oneSetData.includes(wordID)) && isToAdd) {
      oneSetData.push(wordID);
    }
    else if (!isToAdd) {
      const index = oneSetData.indexOf(wordID);
      if (index > -1) {
        oneSetData.splice(index, 1);
      }
    }
  }

  public reSetApp() {
    this.storage.clear().then(data => {
      this.reStartSetDynamicData();
      this.reStartWordDynamicData();
      this.presentToast("All progress has been Reset."); // to save the session data from getting destroyed
      this.router.navigate(['/slides']);
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






}

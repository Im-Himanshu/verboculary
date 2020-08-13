import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { HttpClient, HttpParams } from '@angular/common/http';
import { dataMuseQuery, wordObject } from "../interfaces/datamuse"
import { forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirebaseOperationsService {

  allWordsData;

  wordsCollectionNameinFirebase = "wordsData"
  constructor(private firestore: AngularFirestore, public http: HttpClient) {
    this.http.get("assets/allWordsData.json").subscribe(data => {
      this.allWordsData = data;
    })
  }

  feedAllwordsDatainFirebase() {
    let allKeys = Object.keys(this.allWordsData);
    let previous = 0;
    for (let key of allKeys) {
      let current = parseInt(key);
      //previous = previous+1;
      if (previous != (current - 1)) {
        console.log("data not availaible for :", (current - 1))
      }
      let wordData = this.allWordsData[key];
      let wordDataRef = this.firestore.collection(this.wordsCollectionNameinFirebase).doc(key + "");
      wordDataRef.get().subscribe((docSnapshot) => {
        if (docSnapshot.exists) {
          console.log("word already exist :", wordData['word'])
        }
        else {
          wordDataRef.set(Object.assign({}, wordData)).then(res => {
            console.log("saved for : ", wordData['word']);
          })
        }
      })

      previous = current;
      //break;
    }

  }


  async processData() {
    let keys = Object.keys(this.allWordsData);
    let allData = {};
    let notProperWord = [];
    let maxL = 999;
    let index = 0;
    for (let key2 of keys) {
      let key = parseInt(key2 + "");
      let word = this.allWordsData[key][1];
      if (index > maxL) {
        break;
      }
      index++;
      let wordRef = this.firestore.collection(this.wordsCollectionNameinFirebase).doc(key2 + "");
      await wordRef.get().subscribe((docSnapshot) => {
        if (docSnapshot.exists) {
          index++;
          let selectedData = this.allWordsData[key];
          let dataMuseParms = new dataMuseQuery();
          dataMuseParms.sp = word // here goes the word
          let params = new HttpParams();
          for (let key of Object.keys(dataMuseParms)) {
            params = params.append(key, dataMuseParms[key]);
          }
          let promise1 = new Promise((resolve, reject) => {
            this.http.get("https://api.datamuse.com/words", { params: params }).subscribe(data => {
              //console.log(data[0]);
              resolve(data[0]);
            })

          });
          let promise2 = new Promise((resolve, reject) => {
            let merriamURL: string = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=f26e324a-8a14-4a65-a015-293095c16a70"

            this.http.get(merriamURL).subscribe(data => {
              let dataObj = {};
              dataObj['shortdef'] = data[0]['shortdef'];
              try {
                let allExample = data[0]['def'][0]['sseq'][0] // in the sense first, there will be multiple example in this
                let onlyExamples = []
                //console.log(allExample)
                for (let oneex of allExample) {
                  try {
                    if (oneex[0] !== 'sense') {
                      continue; //only process entry with sense in the starting
                    }
                    let exampleString = oneex[1]['dt']
                    exampleString = exampleString[1]
                    exampleString = exampleString[1]
                    exampleString = exampleString[0]
                    exampleString = exampleString['t'];
                    onlyExamples.push(exampleString.replace('{wi}', "").replace('{/wi}', ''))
                  } catch (error) {
                    continue;

                  }
                }
                //console.log();
                dataObj['examples'] = onlyExamples
                //console.log(dataObj);
                resolve(dataObj);

              } catch (error) {
                dataObj['examples'] = [];
                console.log("error occured in : " + word);
                console.error(error);
                resolve(dataObj);

              }
            })


          });
          let forkjoin_data = forkJoin(promise1, promise2);
          //await forkJoin
          forkjoin_data.subscribe((data: any) => {
            console.log(word);
            let wordData = new wordObject();
            wordData.id = key;
            wordData.word = word;
            wordData.pos = selectedData[3];
            wordData.defs = data[1]['shortdef'] ? data[1]['shortdef'] : []; // from merriam definitions 
            wordData.wordNetDef = data[0]['defs'] ? data[0]['defs'] : []; // from wordNet definations        
            wordData.shortExample = data[1]['examples']; // these are merriam examples in 2-3 words like very short and crisp example for every word...

            if (Array.isArray(selectedData[4])) {
              wordData.examples = []
              for (let oneExample of selectedData[4]) {
                let p: string = oneExample;
                if (p.includes(word)) {
                  wordData.examples.push(oneExample);
                }

              }

            }
            else {
              wordData.examples = [selectedData[4]];
            }

            wordData.synonyms = selectedData[6];
            wordData.podcastLink = selectedData[5];
            wordData.imageUrls = selectedData[7];
            wordData.nGramFreq = parseFloat(data[0]['tags'][(data[0]['tags'].length - 1)].split(":")[1]);
            if ((selectedData[4] == "" || selectedData[4] == null) || Array.isArray(selectedData[4])) {
              notProperWord.push(word)
            }

            let wordDatas: any = wordData
            allData[key] = wordData;  //wordsData
            let wordDataRef = this.firestore.collection(this.wordsCollectionNameinFirebase).doc(key2 + "");
            wordDataRef.set(Object.assign({}, wordData)).then(res => {
              console.log("saved for : ", word);
            })



            // if (crntIndex >= maxL) {
            //   console.log(JSON.stringify(allData));
            //   console.log(JSON.stringify(notProperWord));
            // }
          }
          )

        }
        else {
          console.log("word Already exsist :", word, key);
          index--;
        }

      })
    }


  }

  convertToCSV() {
    // THIS FUNtion is to remove all the ids in the json to convert it into csv convertiable json

    this.http.get("assets/allWordsData.json").subscribe(data => {
      let allData = []
      let ids = Object.keys(data);
      for (let id of ids) {
        allData.push(data[id]);
      }
      console.log(JSON.stringify(allData));
    })
  }

  saveFromFirestore() {


    const allWords = {};
    let usersRef = this.firestore.collection(this.wordsCollectionNameinFirebase).get().subscribe(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        let data = doc.data();
        allWords[data['id']] = data;
      });
      console.log(JSON.stringify(allWords));

    })

  }
}

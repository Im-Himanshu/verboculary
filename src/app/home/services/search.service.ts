import { Injectable } from '@angular/core';
import {wordToIdMap} from '../../wordToId'
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }
  searchQuery: string = '';

  convertWordMapToArray = () => {
    console.log(wordToIdMap);
    let wordArray = [];
    for(let key in wordToIdMap){
        wordArray.push({name: key, id: wordToIdMap[key]});
    }
    return wordArray;
  }
}

import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/data-base.service';
import { ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  allSelectedWordIDs: any;
  allWordsData: any;
  wordsDynamicData: any;
  selectedSet: string;
  selectedOption;
  noOptionSelected = true;

  questionTypes = ['synonyms', 'usageInExample blank fill up', 'meaning to word']

  crntQuestionType;
  crntQuestion;

  options = [] // {Label:'', isSelected : false, afterSubmit : ''}
  isSubmitted = false;
  alreadyGeneratedIds = [];
  crntScore;
  crntDone;
  maxScore = 10;
  sessionRunning = false;

  sessionStartTime;
  QuestionStartTime;

  totalTimeTaken;
  CrntQuestionTimeTaken;

  constructor(private db: DatabaseService, public toastController: ToastController, public sanitizer: DomSanitizer) {
    this.allSelectedWordIDs = this.db.allSelectedWordIdsFiltered;
    this.allWordsData = this.db.allWordsData;
    this.wordsDynamicData = this.db.wordsDynamicData;
    this.selectedSet = this.db.selectedSet;
  }

  startNewSession() {
    this.crntDone = 0;
    this.crntScore = 0;
    this.sessionRunning = true;
    this.next();
    this.sessionStartTime = new Date().getTime();

    // setInterval((data) => {
    //   var now = new Date().getTime();
    //   var timeleft = now - this.sessionStartTime;
    //   //var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //   var minutes = "" + Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    //   var seconds = "" + Math.floor((timeleft % (1000 * 60)) / 1000);
    //   if (minutes.length == 1) {
    //     minutes = "0" + minutes;
    //   }
    //   if (seconds.length == 1) {
    //     seconds = "0" + seconds;
    //   }
    //   this.totalTimeTaken = minutes + ":" + seconds
    //   var timeleft = now - this.QuestionStartTime;
    //   //var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //   var minutes = "" + Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    //   var seconds = "" + Math.floor((timeleft % (1000 * 60)) / 1000);
    //   if (minutes.length == 1) {
    //     minutes = "0" + minutes;
    //   }
    //   if (seconds.length == 1) {
    //     seconds = "0" + seconds;
    //   }
    //   this.CrntQuestionTimeTaken = minutes + ":" + seconds
    // }, 1000)
  }

  next() {
    this.QuestionStartTime = new Date().getTime();
    this.isSubmitted = false;
    this.noOptionSelected = true;
    let newWordid = this.allSelectedWordIDs[this.getRndInteger(0, this.allSelectedWordIDs.length)];
    let newType = this.getRndInteger(0, 10);
    if (newType > 5) {
      this.generateUsageinExampleQuestionForId(newWordid);
    }
    else {
      this.generateMeaningBasedQuestionForID(newWordid);
    }

  }

  verifyAnswer() {
    let isCorrect = true;
    for (let option of this.options) {
      if (option['isCorrect'] !== option['isSelected']) {
        isCorrect = false;
      }
      if (option['isSelected']) {
        if (option['isCorrect'] === option['isSelected']) {
          option['color'] = '#51df32'
        }
        else {
          option['color'] = '#fe805d'
        }
      }
      if (option['isCorrect']) {
        option['color'] = '#51df32';
      }
    }
    if (isCorrect) {
      this.crntScore = this.crntScore + 1;
    }
    return isCorrect;
  }

  SubmitAnswer() {
    if (this.noOptionSelected) {
      this.presentToast("Please select one of the given options.")
    }
    else {
      this.isSubmitted = true;
      this.crntDone = this.crntDone + 1;
      this.verifyAnswer();
    }

    if (this.crntDone >= this.maxScore) {
      //this.sessionRunning = false;
    }

  }



  generateMeaningBasedQuestionForID(wordId) {
    try {

      let index = this.allSelectedWordIDs.indexOf(wordId);
      let selectedWordData = this.allWordsData[wordId];
      let word = selectedWordData['word'];
      let question: string = selectedWordData['defs'][0];
      if (question.includes(word) && selectedWordData['defs'].length > 1) {
        question = selectedWordData['defs'][1];
      }
      this.crntQuestionType = "Which of the following best suits the meaning : "
      //let QuestionText = question;
      this.crntQuestion = question;
      // generate options 
      let options = [];
      this.alreadyGeneratedIds = [];
      this.alreadyGeneratedIds.push(index);
      for (let i = 0; i < 3; i++) {
        let option = {};
        let totalLength = this.allSelectedWordIDs.length;
        let wordId = this.allSelectedWordIDs[this.getRndInteger(0, totalLength)];
        option['label'] = this.allWordsData[wordId]['word'];
        option['isSelected'] = false;
        option['isCorrect'] = false;
        option['afterSubmit'] = this.allWordsData[wordId]['defs'][0]
        options.push(option);
      }
      let option = {};
      option['label'] = word
      option['isSelected'] = false;
      option['isCorrect'] = true;
      option['afterSubmit'] = selectedWordData['defs'][0]
      options.push(option);
      this.options = options;
      this.shuffleArray(this.options);

    } catch (error) {
      this.next()

    }
  }

  generateUsageinExampleQuestionForId(wordId) {
    try {
      let index = this.allSelectedWordIDs.indexOf(wordId);
      let selectedWordData = this.allWordsData[wordId];
      let word = selectedWordData['word'];
      let question: string = selectedWordData['examples'][0];
      let allStrings = question.split(" ");
      question = ""
      for (let oneString of allStrings) {
        if (oneString.startsWith(word)) {
          question = question + "  _____________  "
        }
        else {
          question = question + " " + oneString
        }
      }
      question.trim();
      this.crntQuestionType = "Select word which is best suited in the given blank."
      //let QuestionText = question;
      this.crntQuestion = question;
      // generate options 
      let options = [];
      this.alreadyGeneratedIds = [];
      this.alreadyGeneratedIds.push(index);
      for (let i = 0; i < 3; i++) {
        let option = {};
        let totalLength = this.allSelectedWordIDs.length;
        let wordId = this.allSelectedWordIDs[this.getRndInteger(0, totalLength)];
        option['label'] = this.allWordsData[wordId]['word'];
        option['isSelected'] = false;
        option['isCorrect'] = false;
        option['afterSubmit'] = this.allWordsData[wordId]['defs'][0]
        options.push(option);
      }
      let option = {};
      option['label'] = word
      option['isSelected'] = false;
      option['isCorrect'] = true;
      option['afterSubmit'] = selectedWordData['defs'][0]
      options.push(option);
      this.options = options;
      this.shuffleArray(this.options);
    } catch (error) {
      this.next();

    }

  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }


  // will give in range [min, max)
  getRndInteger(min = 0, max) {
    let rank = Math.floor(Math.random() * (max - min)) + min;
    if (this.alreadyGeneratedIds.indexOf(rank) > -1) {
      return this.getRndInteger(min, max);
    }

    this.alreadyGeneratedIds.push(rank)
    return rank
  }

  afterOptionSelected(selectedOption) {
    if (!selectedOption['isSelected']) {
      this.noOptionSelected = true;
    }
    else {
      this.noOptionSelected = false;
    }
    for (let option of this.options) {
      if (option !== selectedOption) {
        option['isSelected'] = false;
      }
    }

  }


  ngOnInit() {

  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}

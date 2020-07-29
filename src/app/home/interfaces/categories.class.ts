import { dropdownData, processedDataSharing } from './dropdown.interface'
import { DatabaseService } from '../services/data-base.service'

export class ProcessorData {
    data: any;

}

export class basedOnsetSubcategory {
    allSets: dropdownData[]
    constructor() {
        let i = 0;
        let j = 0;
        this.allSets = [];
        for (; i < 21; i++) {
            let oneSet: dropdownData = {} as dropdownData;
            oneSet.id = i;
            j = i + 1
            oneSet.name = 'Set ' + j;
            this.allSets.push(oneSet);
        }
    }
}

export class basedOnAlphabetSubcategory {
    allSets: dropdownData[]
    alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    constructor() {
        let i = 0;
        this.allSets = [];
        for (; i < this.alphabet.length; i++) {
            let oneSet: dropdownData = {} as dropdownData;
            oneSet.id = i;
            oneSet.name = 'Alphabet ' + this.alphabet[i];
            this.allSets.push(oneSet);
        }
    }
}
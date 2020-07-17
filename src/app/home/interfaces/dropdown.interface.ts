export interface dropdownData {
    id: number;
    name: string;
    childs: any[];
}

export interface processedDataSharing {

    allCategoryType: string[]
    allSetOfcategory: any;
    allWordOfSets: any;
    setLevelProgressData: any;
    dateWiseTotalProgressReport: any;

}


export interface setLevelProgress {
    totalLearned: number;
    totalViewed: number;
    totalWords: number;
}
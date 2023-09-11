export interface wordAppData {
    id: string;
    word: string;
    isMarked: boolean;
    isViewed: boolean;
    isLearned: boolean;
    learnedDate: String;
    viewedDate: String;
    correctCount: number;
    notes: string;
}

export class appNameToUINameMapping {

    appNametoUINamemapping = {
        "beginner-1": "Beginner - Level 1",
        "beginner-2": "Beginner - Level 2",
        "beginner-3": "Beginner - Level 3",
        "beginner-4": "Beginner - Level 4",
        "beginner-5": "Beginner - Level 5",
        "beginner-6": "Beginner - Level 6",
        "beginner-7": "Beginner - Level 7",
        "transitional-1": "Transitional - Level 1",
        "transitional-2": "Transitional - Level 2",
        "transitional-3": "Transitional - Level 3",
        "transitional-4": "Transitional - Level 4",
        "transitional-5": "Transitional - Level 5",
        "transitional-6": "Transitional - Level 6",
        "transitional-7": "Transitional - Level 7",
        "pro-1": "Pro - Level 1",
        "pro-2": "Pro - Level 2",
        "pro-3": "Pro - Level 3",
        "pro-4": "Pro - Level 4",
        "pro-5": "Pro - Level 5",
        "pro-6": "Pro - Level 6",
        "pro-7": "Pro - Level 7"

    }


    constructor() {

    }
}
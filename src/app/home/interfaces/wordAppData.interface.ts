export interface wordAppData{
    id : string;
    word : string;
    isMarked : boolean;
    isSeen : boolean;
    allSetPropoerty :setProperty[];

}

export interface setProperty{
    setName : string;
    isCompleted : boolean;

}
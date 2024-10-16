export interface Post {
    id?: string;
    bodyPost: string;
    UserPhoto: string;
    DisplayName: string;
    creationDate: Date;
    comments: any[];
    likes: string[];
    itLikeForMe: boolean;
    Uid: string
    isComment: boolean
}


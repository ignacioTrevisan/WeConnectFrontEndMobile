import { create } from "zustand";
import { Post } from "../../../core/entities/post-entities";

export interface alterState {
    post: Post | undefined,
    setPost: (postParam: Post) => void;
    clearPost: () => void;
}

export const AlterPostStore = create<alterState>()((set, get) => ({
    post: undefined,
    setPost: (postParam) => {
        set({ post: postParam });
    },
    clearPost: () => {
        set({ post: undefined })
    }
}));
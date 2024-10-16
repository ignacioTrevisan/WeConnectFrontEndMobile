import { create } from "zustand";
import { User } from "../../../core/entities/user-entities";

export interface alterState {
    isAlter: Boolean;
    user: User | undefined
    ErrorMessage: string | undefined,
    toogleIsAlter: () => void;
    IsAlterTrue: () => void;
    IsAlterFalse: () => void;
    setUserAlterated: (NewUser: User) => void
}

export const AlterStore = create<alterState>()((set, get) => ({
    isAlter: false,
    user: undefined,
    ErrorMessage: undefined,
    toogleIsAlter: () => {
        const currentIsAlter = get().isAlter;
        set({ isAlter: !currentIsAlter });
    },
    setUserAlterated: (NewUser: User) => {
        set({ user: NewUser });

    },
    IsAlterTrue: () => {
        set({ isAlter: true })
    },
    IsAlterFalse: () => {
        set({ isAlter: false })
    },

}));
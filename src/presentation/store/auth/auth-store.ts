import { create } from "zustand";
import { User } from "../../../core/entities/user-entities";

export interface authState {
    status: 'Logged' | 'Unlogged' | 'Loading';
    user: User | undefined
    ErrorMessage: string | undefined,
    setLogged: (user: User) => void;
    unlogue: (error?: string) => void;
    isLoading: () => void;
    getUser: () => User | undefined;  // Cambia el tipo de retorno
}

export const authStore = create<authState>()((set, get) => ({
    user: undefined,
    status: 'Loading',
    ErrorMessage: undefined,
    setLogged: (user: User) => { set({ user: user, status: 'Logged' }) },
    unlogue: (error?: string) => {
        set({ user: undefined, status: 'Unlogged', ErrorMessage: error ? error : undefined })
    },
    isLoading: () => { set({ status: 'Loading' }) },
    getUser: (): User | undefined => {
        const userReturn = get().user;
        return userReturn;
    }
}));
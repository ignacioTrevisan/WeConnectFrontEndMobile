import { create } from "zustand";
import { User } from "../../../core/entities/user-entities";
import { PasswordModal } from '../../components/passwordModal';

export interface uiState {
    PasswordModalIsOpen: boolean,
    PhotoPickerModalIsOpen: boolean,
    dateModalIsOpen: boolean,
    snackBarMode: { visible: boolean, msg: string }
    dialogMode: { visible: boolean, msg: string },
    configDialogMode: (visible: boolean, msg: string) => void;
    TooglePasswordModal: () => void;
    visibleSnackBar: (mensaje: string) => void;
    invisibleSnackBar: () => void;
    TooglePhotoPickerModal: () => void;
    ToogleDateModal: () => void;
    isLoading: boolean;
    setIsLoading: (b: boolean) => void;
}

export const uiStore = create<uiState>()((set, get) => ({
    PasswordModalIsOpen: false,
    PhotoPickerModalIsOpen: false,
    dateModalIsOpen: true,
    snackBarMode: { visible: false, msg: '' },
    isLoading: false,
    dialogMode: { visible: false, msg: '' },
    configDialogMode: (visible: boolean, msg: string) => {
        set({ dialogMode: { visible, msg } })
    },
    TooglePasswordModal: () => {
        const currentPasswordMode = get().PasswordModalIsOpen;
        set({ PasswordModalIsOpen: !currentPasswordMode });
    },
    visibleSnackBar: (mensaje: string) => {

        set({ snackBarMode: { visible: true, msg: mensaje } });
    },
    invisibleSnackBar: () => {

        set({ snackBarMode: { visible: false, msg: '' } });
    },

    TooglePhotoPickerModal: () => {

        const currentPhotoPicker = get().PhotoPickerModalIsOpen;
        set({ PhotoPickerModalIsOpen: !currentPhotoPicker });
    },
    ToogleDateModal: () => {

        const CurrentStateDateModal = get().dateModalIsOpen;
        set({ dateModalIsOpen: !CurrentStateDateModal });
    },
    setIsLoading: (b: boolean) => {
        set({ isLoading: b });

    },
}));
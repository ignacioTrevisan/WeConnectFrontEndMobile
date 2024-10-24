import { create } from "zustand";

export interface uiState {
    PasswordModalIsOpen: boolean,
    PhotoPickerModalIsOpen: boolean,
    dateModalIsOpen: boolean,
    postModalEditIsOpen: boolean,
    snackBarMode: { visible: boolean, msg: string }
    dialogMode: { visible: boolean, msg: string },
    isLoading: boolean;
    configDialogMode: (visible: boolean, msg: string) => void;
    TooglePasswordModal: () => void;
    visibleSnackBar: (mensaje: string) => void;
    invisibleSnackBar: () => void;
    TooglePhotoPickerModal: () => void;
    ToogleDateModal: () => void;
    setIsLoading: (b: boolean) => void;
    tooglePostModalEditIsOpen: () => void;
}

export const uiStore = create<uiState>()((set, get) => ({
    PasswordModalIsOpen: false,
    PhotoPickerModalIsOpen: false,
    dateModalIsOpen: true,
    postModalEditIsOpen: false,
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
    tooglePostModalEditIsOpen: () => {
        const CurrentPostModalEditIsOpen = get().postModalEditIsOpen;
        set({ postModalEditIsOpen: !CurrentPostModalEditIsOpen });
    },
}));
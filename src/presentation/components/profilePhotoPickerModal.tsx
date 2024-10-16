import React, { useContext, useState } from 'react'
import { Modal, View, useWindowDimensions, Alert, Image, ActivityIndicator } from 'react-native'
import { uiStore } from '../store/ui/ui-store';
import { Buttons } from './buttons';
import { authStore } from '../store/auth/auth-store';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ChangePersonalConfiguraton } from '../../core/use-cases/users/change-personal-configuration';
import { WeConnectFetcher } from '../../config/adapters/weConnectFetcher';
import { ThemeContext } from '../context/themeContext';

export const ProfilePhotoPickerModal = () => {
    const { colors } = useContext(ThemeContext);

    const PhotoPickerModalIsOpen = uiStore(state => state.PhotoPickerModalIsOpen);
    const TooglePhotoPickerModal = uiStore(state => state.TooglePhotoPickerModal)
    const user = authStore(state => state.user)
    const [fotoDePerfil, setFotoDePerfil] = useState(user?.UserPhoto)
    const toogle = () => {
        if (user?.UserPhoto) {
            setImageIsDeleted(false)
            setFotoDePerfil(user?.UserPhoto)
        }
        TooglePhotoPickerModal();
    }

    const [newSelectedImage, setNewSelectedImage] = useState(false)
    const { height, width } = useWindowDimensions();
    const [isLoading, setIsLoading] = useState(false)
    const ShowAlert = (ok: boolean, msg: string) =>
        Alert.alert(ok === true ? '¡Listo!' : 'Ups...', msg, [

            { text: 'OK', onPress: ok === true ? () => TooglePhotoPickerModal() : () => { } },
        ]);
    const setLogged = authStore(state => state.setLogged)

    const setNewPhoto = async () => {
        if (!user) return;
        if (fotoDePerfil === user.UserPhoto) {
            console.log('no hay foto seleccionada') //#TODO transofmrar esto a mensaje snackbar
            return;
        }
        setIsLoading(true);
        if (fotoDePerfil === 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg') {
            user.UserPhoto = fotoDePerfil;
            const resp = await ChangePersonalConfiguraton(WeConnectFetcher, user, user.uid);
            if (resp.ok) {
                setIsLoading(false);
                ShowAlert(true, 'Imagen subida correctamente')
            }
            return;
        }
        if (fotoDePerfil) {
            const data = new FormData();
            data.append('file', {
                uri: fotoDePerfil,
                type: 'image/jpeg', // Tipo de imagen
                name: `ProfilePhotoUser=${user.uid}.jpg`, // Nombre del archivo
            });
            data.append('upload_preset', 'weConnectPresset');
            data.append('cloud_name', 'nachotrevisan');

            try {
                const res = await fetch('https://api.cloudinary.com/v1_1/nachotrevisan/image/upload', {
                    method: 'POST',
                    body: data,
                });
                const json = await res.json();
                user.UserPhoto = json.secure_url;
                const resp = await ChangePersonalConfiguraton(WeConnectFetcher, user, user.uid);
                setLogged(user);
                if (resp.ok) {
                    setIsLoading(false);
                    ShowAlert(true, 'Imagen modificada correctamente')
                }
            } catch (error) {
                console.log('Error al subir la imagen a Cloudinary: ', error); //TODO: TRANSOFRMAR A SNACKBAR
                setIsLoading(false);

            }
        }
    }
    const selectOther = () => {

        Alert.alert('Seleccione', ' ¿Desea usar la camara o escoger de la galeria?', [
            {
                text: 'Camara',
                onPress: () => abrirCamara(),
                style: 'cancel',
            },
            { text: 'Galeria', onPress: () => abrirGaleria() },
        ]);

    }

    const abrirGaleria = async () => {
        try {
            const result = await launchImageLibrary({ mediaType: 'photo', maxWidth: 500, maxHeight: 500 });

            if (result.didCancel) {
                console.log('User cancelled image picker');
            } else if (result.errorCode) {
                console.log('Error: ', result.errorMessage);
            } else {
                if (result.assets) {
                    const selectedImage = result.assets[0].uri;
                    setFotoDePerfil(selectedImage);
                    setNewSelectedImage(true)
                    setImageIsDeleted(false)
                    console.log(selectedImage);
                }
            }
        } catch (error) {
            console.log('Error al seleccionar imagen: ', error);
        }
    }
    const abrirCamara = async () => {


        try {
            const result = await launchCamera({ mediaType: 'photo', saveToPhotos: true, maxWidth: 500, maxHeight: 500 });

            if (result.didCancel) {
                console.log('User cancelled image picker');
            } else if (result.errorCode) {
                console.log('Error: ', result.errorMessage);
            } else {
                if (result.assets) {

                    const capturedImage = result.assets[0].uri;
                    if (!capturedImage) return;
                    setFotoDePerfil(capturedImage);
                    setNewSelectedImage(true)
                    setImageIsDeleted(false)
                    console.log(capturedImage);
                }
            }
        } catch (error) {
            console.log('Error al capturar imagen: ', error);
        }
    }
    const [imageIsDeleted, setImageIsDeleted] = useState(false)
    const deleteImage = () => {
        setImageIsDeleted(true)
        setFotoDePerfil('https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg')
    }
    return (
        <Modal visible={PhotoPickerModalIsOpen}
            animationType='fade'
            style={{ backgroundColor: 'red', flex: 1, width, height }}

        >
            {isLoading ?
                <ActivityIndicator style={{ position: 'absolute', width, height }} />

                :
                <>
                    <View style={{ flexDirection: 'column', flex: 1, backgroundColor: colors.background, paddingLeft: 10, paddingRight: 10, alignItems: 'center' }}>

                        <View style={{ flex: 1 }} >

                            <View style={{ width: width * 0.8, height: width * 0.8, borderRadius: 50, marginTop: 150 }}>
                                <Image source={{ uri: fotoDePerfil !== user?.UserPhoto ? fotoDePerfil : user?.UserPhoto }} style={{ width: '100%', height: '100%', borderRadius: 200 }} />
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'column', backgroundColor: colors.background, gap: 20, marginTop: 20 }}>

                                <Buttons
                                    text='Eliminar'
                                    onPress={() => deleteImage()}
                                    styles={{
                                        height: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 20,
                                        width: width * 0.6,
                                        backgroundColor: imageIsDeleted || fotoDePerfil === 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg' ? colors.SecondaryButtonsBackGround : 'red'

                                    }}
                                />
                                <Buttons
                                    text='Seleccionar otra'
                                    onPress={() => selectOther()
                                    }
                                    styles={{
                                        height: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 20,
                                        width: width * 0.6,
                                        backgroundColor: colors.primary
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ justifyContent: 'center', flexDirection: 'row', backgroundColor: colors.background, gap: 20, marginBottom: 20 }}>

                            <Buttons
                                text='Cancelar'
                                onPress={() => toogle()}
                                styles={{
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 20,
                                    width: width * 0.4,
                                    backgroundColor: colors.SecondaryButtonsBackGround
                                }}
                            />
                            <Buttons
                                text='Confirmar'
                                onPress={() => setNewPhoto()}
                                styles={{
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 20,
                                    width: width * 0.4,
                                    backgroundColor: fotoDePerfil === user?.UserPhoto ? colors.SecondaryButtonsBackGround : colors.primary
                                }}
                            />
                        </View>
                    </View>

                </>
            }
        </Modal>
    )
}

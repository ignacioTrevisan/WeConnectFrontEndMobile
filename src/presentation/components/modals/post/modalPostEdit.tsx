import React, { useContext, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { ThemeContext } from '../../../context/themeContext';
import { PersonalPostCard } from '../../personalPost';
import { UsePost } from '../../../../hooks/usePost';
import { authStore } from '../../../store/auth/auth-store';
import { AlterPostStore } from '../../../store/alter/alterPost';
import { uiStore } from '../../../store/ui/ui-store';
import { Buttons } from '../../buttons';
import { ActivityIndicator } from 'react-native';
import { Snackbar } from 'react-native-paper';

interface Props {
    GetAllPostScreen: () => void
}

export const ModalPostEdit = ({ GetAllPostScreen }: Props) => {

    const { RefreshAllPost, PutPost, setIsLoading, isLoading, deletePost } = UsePost();
    const tooglePostModalEditIsOpen = uiStore(state => state.tooglePostModalEditIsOpen)
    const clearPost = AlterPostStore(state => state.clearPost)
    const { colors } = useContext(ThemeContext);
    const user = authStore(state => state.user);
    const post = AlterPostStore(state => state.post)
    const visibleSnackBar = uiStore(state => state.visibleSnackBar)
    const [isAlter, setIsAlter] = useState(false)


    const alterPost = async (bodyPost: string, idPost?: string) => {
        if (!idPost || !user || !user.uid) return;
        setIsLoading(true)
        const resp = await PutPost({ uid: user.uid, idPost, bodyPost })

        if (resp.ok) {
            setIsLoading(false)
            visibleSnackBar('Post modificado correctamnte')
            setIsAlter(true)
        } else {
            setIsLoading(false)
            visibleSnackBar(resp.msg ? resp.msg : 'Ocurrio un error al modificar el post, por favor, vuelva a intentarlo más tarde. ')
        }
    }
    const StartDeletePost = async () => {
        if (!post || !post.id || !user || !user.uid) return;

        setIsLoading(true)
        const resp = await deletePost(post.id, user?.uid)
        let actualizar = true
        if (resp.ok) {
            setIsLoading(false)
            visibleSnackBar('Post eliminado correctamnte')
            setIsAlter(true)
            cancelar(actualizar)

        } else {
            if (resp.msg) {

                visibleSnackBar(resp.msg)
            }

        }
    }

    const cancelar = (actualizar?: boolean) => {
        clearPost()
        console.log(isAlter)
        if (actualizar || isAlter) {
            GetAllPostScreen()
        }
        tooglePostModalEditIsOpen()
    }
    const snackBarMode = uiStore(state => state.snackBarMode)
    const invisibleSnackBar = uiStore(state => state.invisibleSnackBar)

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 20 }}>
            <Snackbar
                visible={snackBarMode.visible}
                onDismiss={invisibleSnackBar}
                duration={5000} // Duración en milisegundos
                action={{
                    label: 'Cerrar',
                    onPress: invisibleSnackBar,
                }}
                style={{ zIndex: 2 }}
            >{snackBarMode.msg}</Snackbar>
            <PersonalPostCard GetAllPost={RefreshAllPost} DisplayName={user!.DisplayName} initialText={post?.bodyPost && post?.bodyPost} Method={alterPost} buttonText='Editar' />
            {isLoading && <ActivityIndicator />}
            <View style={{ flex: 1 }} />


            <View style={{ justifyContent: 'center', flexDirection: 'row', backgroundColor: colors.background, gap: 20, marginBottom: 20 }}>
                <Buttons
                    text='Cancelar'
                    onPress={() => cancelar()}
                    styles={{
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        width: 200,
                        backgroundColor: colors.SecondaryButtonsBackGround
                    }}
                />
                <Buttons
                    text='Eliminar'
                    onPress={() => StartDeletePost()}
                    styles={{
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        width: 200,
                        backgroundColor: colors.primary
                    }}
                />
            </View>
        </View>
    )
}

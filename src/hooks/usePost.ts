import { useState } from "react"
import { Post } from "../core/entities/post-entities";
import { GetPostByUser } from "../core/use-cases/post/get-by-user";
import { WeConnectFetcher } from '../config/adapters/weConnectFetcher';
import { PutPersonalPost } from "../core/use-cases/post/put-personal-comment";
import { ApiResponse } from "../infraestructure/interfaces/api-response";
import { OrderPostByDate } from "../helpers/orderPostByDate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../core/entities/user-entities";
import { SubmitPost } from "../core/use-cases/post/submit-post";
import { GetAllPost } from "../core/use-cases/post/get-all-post";
import { AlterPostStore } from "../presentation/store/alter/alterPost";
import { DeletePersonalPost } from "../core/use-cases/post/delete-personal.post";


interface PutPost {
    uid: string,
    idPost: string,
    bodyPost: string
}
export const UsePost = () => {
    const [postByUser, setPostByUser] = useState<Post[]>();
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const clearPost = AlterPostStore(state => state.clearPost)

    const GetByUser = async (id: string) => {
        const resp = await GetPostByUser(WeConnectFetcher, id)
        if (resp.ok && resp.data) {
            console.log('data')
            setPostByUser(resp.data)
        }
    }

    const PutPost = async ({ uid, idPost, bodyPost }: PutPost): Promise<ApiResponse> => {
        try {
            const resp = await PutPersonalPost(WeConnectFetcher, uid, idPost, bodyPost);

            if (resp.ok) {
                clearPost()
                return {
                    ok: true,
                }
            } else {
                return {

                    ok: false,
                    data: resp.data
                }
            }
        } catch (error) {
            throw new Error(`Ocurrio un error: ${error}`)
        }
    }

    const RefreshAllPost = async () => {
        setPosts([])
        let resp = await GetAllPost(WeConnectFetcher)
        resp = OrderPostByDate(resp);
        const postClear = resp.filter((p) => p.isComment === false)
        setPosts(postClear);
    }

    const NewPost = async (user: User, bodyPost: string): Promise<ApiResponse> => {
        const token = await AsyncStorage.getItem('@token');
        if (!user.UserPhoto || !token) {
            return {
                ok: false,
                msg: 'No se pudo encontrar el token. '
            }
        }
        const post = {
            bodyPost,
            UserPhoto: user.UserPhoto,
            DisplayName: user.DisplayName,
            creationDate: new Date(),
            comments: [],
            likes: [],
            itLikeForMe: false,
            Uid: user.uid,
            isComment: false

        }
        const resp = await SubmitPost(WeConnectFetcher, post, token)
        return resp;

    }


    const deletePost = async (idPost: string, uid: string) => {
        const resp = await DeletePersonalPost(WeConnectFetcher, idPost, uid);
        return resp
    }
    return {
        postByUser,
        posts,
        isLoading,


        //methods


        GetByUser,
        PutPost,
        RefreshAllPost,
        NewPost,
        setIsLoading,
        deletePost
    }
}
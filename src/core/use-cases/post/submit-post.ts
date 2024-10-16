import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { Post } from "../../entities/post-entities";

export const SubmitPost = async (fetcher: HttpAdapter, post: Post, token: string): Promise<ApiResponse> => {
    try {
        const resp = await fetcher.post<ApiResponse>(`post/post`,
            {
                DisplayName: post.DisplayName,
                Cuerpo_de_post: post.bodyPost,
                uid: post.Uid,
                token,
                esComentario: post.isComment,

            });
        console.log(resp)
        return {
            ok: true,
            msg: 'Post subido correctamente',
            data: resp.data
        };
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
            return {
                ok: false,
                msg: error.response.data
            }
        }
        console.log(error);
        throw new Error('Error submit post');

    }
};
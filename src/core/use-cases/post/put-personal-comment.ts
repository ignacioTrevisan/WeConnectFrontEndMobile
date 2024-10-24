import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { PostApi } from "../../../infraestructure/interfaces/post-response";

export const PutPersonalPost = async (fetcher: HttpAdapter, uid: string, idPost: string, bodyPost: string): Promise<ApiResponse<string>> => {
    try {
        const resp = await fetcher.put<ApiResponse<PostApi>>(`post/editar`, { uid, idPost, bodyPost });
        console.log('uid', uid)
        console.log('idPost', idPost)

        if (resp.ok) {

            return {
                ok: true,
            };
        } else {
            console.log(resp.msg)
            return {
                ok: false,
                msg: resp.msg
            }
        }

    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
        }
        console.log(error);
        throw new Error('Error geting all post');

    }
};
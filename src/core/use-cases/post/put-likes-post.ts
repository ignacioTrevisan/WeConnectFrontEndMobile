import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { Post } from "../../entities/post-entities";
import { PostResponse } from "../../../infraestructure/interfaces/post-response";
import { PostMapper } from "../../../infraestructure/mapper/postMapper";

export const PutLikesPosts = async (fetcher: HttpAdapter, uid: string, idPost: string): Promise<ApiResponse> => {
    try {
        const resp = await fetcher.put<PostResponse>(`post/darLike`, { uid, idPost });
        return { ok: true };
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
        }
        console.log(error);
        throw new Error('Error geting all post');

    }
};
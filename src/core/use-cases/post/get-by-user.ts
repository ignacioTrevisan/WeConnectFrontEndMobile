import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from '../../../infraestructure/interfaces/api-response';
import { Post } from "../../entities/post-entities";
import { PostApi, PostResponse, PostResponseUnique } from "../../../infraestructure/interfaces/post-response";
import { PostMapper } from "../../../infraestructure/mapper/postMapper";

export const GetPostByUser = async (fetcher: HttpAdapter, id: string): Promise<ApiResponse<Post[]>> => {
    try {
        const resp = await fetcher.get<ApiResponse<PostApi[]>>(`post/traerPorUsuario`, { params: { idUsuario: id } });
        if (resp.data) {

            const post = resp.data.map((p) => PostMapper.fromPostToEntities(p))
            return { ok: true, data: post };
        } else {
            throw new Error('Error geting post by user');

        }
    } catch (error: any) {
        console.log(error)
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
        }
        throw new Error('Error geting post by user');

    }
};
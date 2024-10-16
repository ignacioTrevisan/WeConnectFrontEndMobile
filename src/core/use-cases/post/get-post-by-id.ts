import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { Post } from "../../entities/post-entities";
import { PostResponse, PostResponseUnique } from "../../../infraestructure/interfaces/post-response";
import { PostMapper } from "../../../infraestructure/mapper/postMapper";

export const GetPostByid = async (fetcher: HttpAdapter, id: string): Promise<Post> => {
    try {
        const resp = await fetcher.get<PostResponseUnique>(`post/traerPorId`, { params: { postId: id } });
        const post = PostMapper.fromPostToEntities(resp.post)
        return post;
    } catch (error: any) {
        console.log(`error ${id}`)
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
        }
        throw new Error('Error geting post by id');

    }
};
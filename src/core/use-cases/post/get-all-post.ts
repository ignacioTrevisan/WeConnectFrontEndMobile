import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { Post } from "../../entities/post-entities";
import { PostResponse } from "../../../infraestructure/interfaces/post-response";
import { PostMapper } from "../../../infraestructure/mapper/postMapper";

export const GetAllPost = async (fetcher: HttpAdapter): Promise<Post[]> => {
    try {
        const resp = await fetcher.get<PostResponse>(`post/traerTodos`);
        const post = resp.posts.map((p) => PostMapper.fromPostToEntities(p))
        return post;
    } catch (error: any) {
        console.log(error)
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
        }
        throw new Error('Error geting all post');

    }
};
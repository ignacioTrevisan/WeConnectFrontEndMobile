import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { Post } from "../../entities/post-entities";
import { PostResponse } from "../../../infraestructure/interfaces/post-response";
import { PostMapper } from "../../../infraestructure/mapper/postMapper";

export const AddComent = async (fetcher: HttpAdapter, idPost: string, idComment: string): Promise<ApiResponse> => {
    try {
        const resp = await fetcher.put<PostResponse>(`post/agregarComentario`, {
            idPost: idPost,
            idComentario: idComment
        });
        return {
            ok: true,
            msg: 'Comentario agregado correctamente'
        };
    } catch (error: any) {
        console.log(error)
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
        }
        throw new Error('Error geting all post');

    }
};
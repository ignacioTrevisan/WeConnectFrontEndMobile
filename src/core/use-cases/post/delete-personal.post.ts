import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";

export const DeletePersonalPost = async (fetcher: HttpAdapter, idPost: string, uid: string): Promise<ApiResponse> => {
    try {
        const resp = await fetcher.delete<ApiResponse>(`post/borrar`, { params: { idPost, uid } })
        console.log(resp)
        return {
            ok: true
        }
    } catch (error: any) {

        console.log('2')
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
        }
        console.log(error);
        return {
            ok: false,
            msg: 'No se pudo borrar el post, por favor vuelve a intentarlo más tarde. '
        }

    }
}
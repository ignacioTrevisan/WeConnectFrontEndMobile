import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";



export const FindAllDisplayNamesByUsers = async (fetcher: HttpAdapter): Promise<string[]> => {
    try {
        console.log('hola')
        const resp = await fetcher.get<ApiResponse<string[]>>(`usuario/traerTodos`);
        console.log(resp);

        return resp.data ? resp.data : []


    } catch (error: any) {
        console.log(error)
        throw new Error(`Error finding displayNames ${error}`);

    }
};
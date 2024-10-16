import { User } from "../../core/entities/user-entities";
import { Usuario } from "../interfaces/login-response";

export class UserMapper {

    static fromUserToEntities(user: Usuario): User {
        console.log('en mapper', user)
        return {
            uid: user._id,
            DisplayName: user.DisplayName,
            Name: user.Nombre,
            LastName: user.Apellido,
            UserPhoto: user.FotoUrl,
            creationDate: user.fecha_creacion,
            Email: user.Email,
            genero: user.genero,
            fechaNacimiento: user.fecha_nacimiento,
            numeroDeTelefono: user.numero_telefono
        }
    }
}
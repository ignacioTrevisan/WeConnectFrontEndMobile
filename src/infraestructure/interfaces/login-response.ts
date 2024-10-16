export interface UserLoggedResponse {
    ok: boolean;
    usuario: Usuario;
    uid: string;
    token: string;
}

export interface Usuario {
    _id: string;
    DisplayName: string;
    Nombre?: string;
    Apellido?: string
    Email?: string;
    FotoUrl: string;
    genero?: string;
    fecha_nacimiento?: Date;
    fecha_creacion: Date;
    ultimaActualizacionDeContraseña: Date;
    numero_telefono: string;
    __v: number;
}

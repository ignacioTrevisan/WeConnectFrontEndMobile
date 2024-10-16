export const transformDateUTC = (fecha: Date | string, sinHoras: boolean = false): string => {
    const fechaObj = (typeof fecha === 'string') ? new Date(fecha) : fecha;

    if (!(fechaObj instanceof Date) || isNaN(fechaObj.getTime())) {
        throw new Error('Fecha inválida');
    }

    // Obtener los componentes en UTC
    const day = fechaObj.getUTCDate();
    const month = fechaObj.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' });
    const year = fechaObj.getUTCFullYear();
    const hours = fechaObj.getUTCHours();
    const minutes = fechaObj.getUTCMinutes().toString().padStart(2, '0');
    if (sinHoras) {
        return `${day} de ${month} de ${year}`;
    }
    return `${day} de ${month} de ${year}, ${hours}:${minutes}`;

}

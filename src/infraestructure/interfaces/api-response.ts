export interface ApiResponse<T = unknown> {
    ok: boolean;
    msg?: string;
    data?: T;
}
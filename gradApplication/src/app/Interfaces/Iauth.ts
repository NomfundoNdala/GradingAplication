export interface ApiResponse {
    status: boolean,
    message: string,
    data: any
}

export interface ILoggedUserData {
    name: string,
    surname: string,
    stuffNumber: string,
    jwt: string
}
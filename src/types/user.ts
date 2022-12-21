export interface User {
    id: string|null,
    firstname: string | null,
    lastname?: string,
    photoURL?: string,
    email: string | null,
    password: string | null,
    phone?:string
    role:string
    status:string,
    roleId:number,
}

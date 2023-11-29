
export interface Login {
    email: string;
    password: string;
}


export interface Registration {
    name: string;
    email: string;
    role: string;
    password: string;
}

export interface JWTEncryptedData {
    id: string;
    email: string;
    name: string;
    role: string;
    joinDate:Date;
}
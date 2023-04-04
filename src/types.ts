import { Document } from "mongoose";

export interface User extends Document {
    username: string;
    password: string;
    salt: string;
    isAdmin: boolean;
}

export interface Games extends Document {
    name: string;
}

export interface Speedrun extends Document {
    name: string;
    game: string;
    url: string;
    bugs: string;
    author: string;
    date: string;
    status: string;
}
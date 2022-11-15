import { Gender } from "../enums/gender.enum";

export namespace UserModel{
  export interface Account{
    id: string;
    username: string;
    password: string;
  }
  export interface User{
    id: string;
    name: string;
    avatar: string;
    gender: Gender;
    dateOfBirth: Date;
    address: string;
  }
}


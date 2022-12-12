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
    gender: Gender;
    dateOfBirth: Date;
    email: string;
    address: string;
    phoneNumber: string;
    followers: string;
    followings: string;
    avatar: string;
  }
}


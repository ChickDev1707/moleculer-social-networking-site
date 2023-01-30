import { AccountStatus } from "../enums/account-status.enum";
import { Gender } from "../enums/gender.enum";

export namespace UserModel{
  export interface Account{
    id: string;
    username: string;
    password: string;
    status: AccountStatus;
  }
  export interface User{
    id: string;
    name: string;
    gender: Gender;
    dateOfBirth: Date;
    email: string;
    address?: string;
    phoneNumber?: string;
    followers?: number;
    followings?: number;
    avatar?: string;
  }
}


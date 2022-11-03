import { Gender } from "../enums/gender.enum"

export type CreateUserDto = {
  name: string
  avatar: string
  gender: Gender
  dateOfBirth: Date
  address: string
}
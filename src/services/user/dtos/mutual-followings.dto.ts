import { UserModel } from "../types/models";

export interface MutualFollowingsPayload{
  user: UserModel.User;
  mutualFollowings: number;
}

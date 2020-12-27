import { Role } from "user";

// please check this is an old one probably
export interface TokenPayload {
  _id: string;
  username: string;
  role: Role;
}
import { TokenOwner } from "../auth";

export interface TokenObj {
  user: TokenOwner;
  token: Buffer | string;
  expiresIn: number | string;
  created?: {
    ip: string;
    date?: string;
  }
}
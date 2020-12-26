import { Secret } from "jsonwebtoken";

export interface JwtData {
  token: Secret;
  expiresIn: number;
}
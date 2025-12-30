import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// Custom JWT payload shape
export interface AccessTokenPayload extends JwtPayload {
  id: number;
  role: string;
}
export interface AuthenticatedRequest extends Request {
  id?: number;
  role?: string;
}

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccessTokenPayload, AuthenticatedRequest } from "types/middleware.type";

/**
 * Middleware
 */
export function authorizeRole(allowedRoles: string[]) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthenticated, No token provided" });
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as AccessTokenPayload;

      req.id = decoded.id;
      req.role = decoded.role;

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          message:
            "Access Denied, failed to qualify the required role qualification.",
        });
      }

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: error.name });
      }

      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  };
}

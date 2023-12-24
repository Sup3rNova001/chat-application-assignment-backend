// import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { RequestWithUserId } from "../types/express";

const secret =
  process.env.ACCESS_TOKEN_SECRET ??
  "d9c88113b44bc263987cac0c544ef3ea8c97c14811b50bbe24f91528a8e7c2f447754105852849b1dc18fc48e8e4add3466e6eaee9640278c219f743dc8d955f";

export const generateToken = (user: any) => {
  const token = jwt.sign({ id: user._id, email: user.email }, secret, {
    algorithm: "HS256",
    expiresIn: "30d",
  });
  return token;
};

export async function securityCheck(
  request: RequestWithUserId,
  response: Response,
  next: NextFunction
) {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return response
      .status(401)
      .json({ message: "Unauthorized: Token missing or invalid" });
  }
  const token = authorizationHeader.slice(7);
  try {
    const decodedToken = jwt.verify(token, secret) as { id: string; email: string };;
    request.userId = decodedToken.id;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return response
        .status(401)
        .json({ message: "Unauthorized: Token expired" });
    }
    return response
      .status(401)
      .json({ message: "Unauthorized: Invalid token" });
  }
}

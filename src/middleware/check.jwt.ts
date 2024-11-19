import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv/config"

export const cekJwt = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.cookies.token;
  
    if (!token || token == undefined) return res.status(401).json({ message: "Please login into your account" });

    jwt.verify(token, String(process.env.SECRET), (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Access denied" });
      }
      return next();
    });

  };
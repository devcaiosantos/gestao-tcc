import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: "Token not provided" });
      return;
    }

    try {
      await this.jwt.verify(token, {
        secret: this.config.get("JWT_SECRET"),
      });
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
}

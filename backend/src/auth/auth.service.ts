import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { AuthData, LoginProps } from "./interfaces";
import * as bcrypt from "bcrypt";
// import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    // private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(data: LoginProps): Promise<AuthData> {
    const administrador = await this.prisma.administrador.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!administrador) {
      throw {
        statusCode: 400,
        message: "Email ou senha inválidos",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      data.senha,
      administrador.senha,
    );

    if (!isPasswordValid) {
      throw {
        statusCode: 400,
        message: "Email ou senha inválidos",
      };
    }

    const payload = {
      email: administrador.email,
      nome: administrador.nome,
      id: administrador.id,
    };

    const jwt = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES,
    });
    return {
      access_token: jwt,
      expires_in: Number(process.env.JWT_EXPIRES),
    };
  }
}

import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";

interface LoginData {
  email: string;
  senha: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() data: LoginData) {
    return this.authService.login(data);
  }
}

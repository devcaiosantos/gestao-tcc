import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./constants";
import { LoginDataDTO } from "./dto/login-data.dto";
import { AuthDataDTO } from "./dto/auth-data.dto";
import { ApiResponse } from "@nestjs/swagger";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: "Retorna informações do usuário e token de acesso",
    type: AuthDataDTO,
  })
  @Public()
  @Post()
  async login(@Body() data: LoginDataDTO) {
    return this.authService.login(data);
  }
}

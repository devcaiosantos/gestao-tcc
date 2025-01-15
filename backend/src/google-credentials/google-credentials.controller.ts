import { Controller, Post, Body, Req, Get, Delete, Put } from "@nestjs/common";
import { GoogleCredentialsService } from "./google-credentials.service";
import { IGoogleCredentials } from "./interfaces";
@Controller("google-credentials")
export class GoogleCredentialsController {
  constructor(private readonly googleAuthService: GoogleCredentialsService) {}

  @Post()
  async create(@Body() credentials: IGoogleCredentials, @Req() req) {
    const adminId = req.admin.id;
    return this.googleAuthService.create({
      adminId: adminId,
      credentials: credentials,
    });
  }

  @Get()
  async get(@Req() req) {
    const adminId = req.admin.id;
    return this.googleAuthService.get(adminId);
  }

  @Delete()
  async delete(@Req() req) {
    const adminId = req.admin.id;
    return this.googleAuthService.delete(adminId);
  }

  @Put()
  async update(@Body() credentials: IGoogleCredentials, @Req() req) {
    const adminId = req.admin.id;
    return this.googleAuthService.update({
      adminId: adminId,
      credentials: credentials,
    });
  }
}

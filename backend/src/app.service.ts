import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "BACKEND GESTÃO TCC!";
  }
}

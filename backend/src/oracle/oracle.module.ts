import { Module } from "@nestjs/common";
import { OracleController } from "./oracle.controller";
import { OracleService } from "./oracle.service";
import { PrismaService } from "../prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [OracleController],
  providers: [OracleService, PrismaService],
  exports: [OracleService],
})
export class OracleModule {}

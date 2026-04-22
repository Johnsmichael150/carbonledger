import { Module, Controller, Get } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ProjectsModule } from "./projects/projects.module";
import { CreditsModule } from "./credits/credits.module";
import { RetirementsModule } from "./retirements/retirements.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { OracleModule } from "./oracle/oracle.module";
import { StatsModule } from "./stats/stats.module";
import { PrismaService } from "./prisma.service";

@Controller("health")
class HealthController {
  @Get()
  check() {
    return {
      status: "ok",
      stellar_network: process.env.STELLAR_NETWORK || "testnet",
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    CreditsModule,
    RetirementsModule,
    MarketplaceModule,
    OracleModule,
    StatsModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}

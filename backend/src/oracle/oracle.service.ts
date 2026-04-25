import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { IsString, IsInt, IsPositive, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class SubmitMonitoringDto {
  @IsString() projectId: string;
  @IsString() period: string;
  @IsInt() @IsPositive() @Type(() => Number) tonnesVerified: number;
  @IsInt() @Type(() => Number) methodologyScore: number;
  @IsString() satelliteCid: string;
  @IsString() submittedBy: string;
}

export class UpdatePriceDto {
  @IsString() methodology: string;
  @IsInt() @Type(() => Number) vintageYear: number;
  @IsString() priceUsdc: string;
}

export class FlagProjectDto {
  @IsString() projectId: string;
  @IsString() reason: string;
}

export class HoldPriceUpdateDto {
  @IsString() methodology: string;
  @IsInt() @Type(() => Number) vintageYear: number;
  @IsString() priceStroops: string;
  @IsNumber() @Type(() => Number) deviation: number;
}

@Injectable()
export class OracleService {
  constructor(private readonly prisma: PrismaService) {}

  async submitMonitoring(dto: SubmitMonitoringDto) {
    return this.prisma.monitoringData.upsert({
      where:  { projectId_period: { projectId: dto.projectId, period: dto.period } },
      update: { tonnesVerified: dto.tonnesVerified, methodologyScore: dto.methodologyScore, satelliteCid: dto.satelliteCid },
      create: {
        projectId:        dto.projectId,
        period:           dto.period,
        tonnesVerified:   dto.tonnesVerified,
        methodologyScore: dto.methodologyScore,
        satelliteCid:     dto.satelliteCid,
        submittedBy:      dto.submittedBy,
      },
    });
  }

  async getStatus(projectId: string) {
    const latest = await this.prisma.monitoringData.findFirst({
      where:   { projectId },
      orderBy: { submittedAt: "desc" },
    });

    const FRESHNESS_MS = 365 * 24 * 60 * 60 * 1000;
    const isCurrent = latest
      ? Date.now() - latest.submittedAt.getTime() <= FRESHNESS_MS
      : false;

    return {
      projectId,
      lastSubmittedAt: latest?.submittedAt ?? null,
      isCurrent,
      latestScore: latest?.methodologyScore ?? null,
    };
  }

  async flagProject(dto: FlagProjectDto) {
    await this.prisma.carbonProject.update({
      where: { projectId: dto.projectId },
      data:  { status: "Suspended" },
    });
    return { flagged: true, projectId: dto.projectId, reason: dto.reason };
  }

  async holdPriceUpdate(dto: HoldPriceUpdateDto) {
    return this.prisma.priceApproval.create({
      data: {
        methodology:  dto.methodology,
        vintageYear:  dto.vintageYear,
        priceStroops: dto.priceStroops,
        deviation:    dto.deviation,
        status:       "Pending",
      },
    });
  }

  async getPriceApprovals() {
    return this.prisma.priceApproval.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async approvePriceUpdate(id: string) {
    return this.prisma.priceApproval.update({
      where: { id },
      data:  { status: "Approved" },
    });
  }

  async rejectPriceUpdate(id: string, reason?: string) {
    return this.prisma.priceApproval.update({
      where: { id },
      data:  { status: "Rejected", reason },
    });
  }
}

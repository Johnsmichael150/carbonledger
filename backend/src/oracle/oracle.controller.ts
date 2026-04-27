import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import {
  OracleService,
  SubmitMonitoringDto,
  UpdatePriceDto,
  FlagProjectDto,
  HoldPriceUpdateDto,
} from './oracle.service';
import { Public, Roles } from '../auth/decorators';

@Controller('oracle')
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}

  @Get('status/:projectId')
  @Public()
  getStatus(@Param('projectId') projectId: string) {
    return this.oracleService.getStatus(projectId);
  }

  @Post('monitoring')
  @Roles('verifier', 'admin')
  submitMonitoring(@Body() dto: SubmitMonitoringDto) {
    return this.oracleService.submitMonitoring(dto);
  }

  @Post('flag')
  @Roles('verifier', 'admin')
  flagProject(@Body() dto: FlagProjectDto) {
    return this.oracleService.flagProject(dto);
  }

  @Post('price')
  @Roles('admin')
  updatePrice(@Body() dto: UpdatePriceDto) {
    return { received: true, ...dto };
  }

  @Post('price-approvals/hold')
  @Roles('admin')
  holdPriceUpdate(@Body() dto: HoldPriceUpdateDto) {
    return this.oracleService.holdPriceUpdate(dto);
  }

  @Get('price-approvals')
  @Roles('admin')
  getPriceApprovals() {
    return this.oracleService.getPriceApprovals();
  }

  @Post('price-approvals/:id/approve')
  @Roles('admin')
  approvePriceUpdate(@Param('id') id: string) {
    return this.oracleService.approvePriceUpdate(id);
  }

  @Post('price-approvals/:id/reject')
  @Roles('admin')
  rejectPriceUpdate(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.oracleService.rejectPriceUpdate(id, reason);
  }
}

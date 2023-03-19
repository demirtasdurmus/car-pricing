import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EURole, User } from '../user/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportDto } from './dto/report-dto';
import { Report } from './report.entity';
import { ReportService } from './report.service';
import { UpdateApprovalDto } from './dto/updateApprovalDto';
import { GetEstimateDto } from './dto/get-estimate.dto';
import { Roles } from '../../guards/role.guard';

@Controller('reports')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  getEstimate(@Query() getEstimateDto: GetEstimateDto): Promise<Report[]> {
    return this.reportService.getEstimate(getEstimateDto);
  }

  @Post()
  @Serialize(ReportDto)
  createReport(
    @CurrentUser() user: User,
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    return this.reportService.create(user, createReportDto);
  }

  @Patch(':id')
  @Roles(EURole.ADMIN, EURole.DEVELOPER, EURole.USER)
  updateApproval(
    @Param('id') id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
  ): Promise<Report> {
    return this.reportService.updateApproval(id, updateApprovalDto);
  }
}

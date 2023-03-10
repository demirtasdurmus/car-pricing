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
import { User } from '../user/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportDto } from './dto/report-dto';
import { Report } from './report.entity';
import { ReportService } from './report.service';
import { UpdateApprovalDto } from './dto/updateApprovalDto';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @UseGuards(AuthGuard)
  getEstimate(@Query() getEstimateDto: GetEstimateDto): Promise<Report[]> {
    return this.reportService.getEstimate(getEstimateDto);
  }

  @Post()
  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  createReport(
    @CurrentUser() user: User,
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    console.log('ddd', user);
    return this.reportService.create(user, createReportDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateApproval(
    @Param('id') id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
  ): Promise<Report> {
    return this.reportService.updateApproval(id, updateApprovalDto);
  }
}

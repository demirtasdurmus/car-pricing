import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { CreateReportDto } from './dto/createReportDto';
import { ReportDto } from './dto/report-dto';
import { Report } from './report.entity';
import { ReportService } from './report.service';
import { UpdateApprovalDto } from './dto/updateApprovalDto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Post()
  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  createReport(
    @CurrentUser() user: User,
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
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

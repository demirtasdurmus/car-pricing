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
  approveReport(@Param('id') id: string): Promise<Report> {
    return this.reportService.approve(id);
  }
}

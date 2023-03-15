import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateReportDto } from './dto/createReportDto';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportRepo.find();
  }

  async create(user: User, createUserDto: CreateReportDto): Promise<Report> {
    const report = this.reportRepo.create({ user, ...createUserDto });
    return this.reportRepo.save(report);
  }

  async approve(id: string): Promise<Report> {
    const report = await this.reportRepo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = true;
    return this.reportRepo.save(report);
  }
}

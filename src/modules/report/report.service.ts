import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';
import { UpdateApprovalDto } from './dto/updateApprovalDto';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
  ) {}

  async getEstimate(getEstimateDto: GetEstimateDto): Promise<Report[]> {
    return this.reportRepo
      .createQueryBuilder()
      .select('AVG(price)', 'estimatedPrice')
      .where('make = :make', { make: getEstimateDto.make })
      .andWhere('model = :model', { model: getEstimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: getEstimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: getEstimateDto.lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: getEstimateDto.year })
      .andWhere('approved = TRUE')
      .orderBy('ABS(km - :km)', 'DESC')
      .setParameters({ km: getEstimateDto.km })
      .limit(3)
      .getRawOne();
  }

  async create(user: User, createUserDto: CreateReportDto): Promise<Report> {
    const report = this.reportRepo.create({ user, ...createUserDto });
    return this.reportRepo.save(report);
  }

  async updateApproval(
    id: string,
    updateApprovalDto: UpdateApprovalDto,
  ): Promise<Report> {
    const report = await this.reportRepo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = updateApprovalDto.approved;
    return this.reportRepo.save(report);
  }
}

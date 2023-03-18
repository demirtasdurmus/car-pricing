import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('ReportController', () => {
  let controller: ReportController;
  let fakeReportService: Partial<ReportService>;

  beforeEach(async () => {
    fakeReportService = {
      async create(user: User, createReportDto: CreateReportDto) {
        return {
          id: Math.random().toString().split('.')[1],
          make: createReportDto.make,
          model: createReportDto.model,
          year: createReportDto.year,
          km: createReportDto.km,
          lat: createReportDto.lat,
          lng: createReportDto.lng,
          price: createReportDto.price,
          createdAt: new Date(),
          updatedAt: new Date(),
          approved: false,
          user: user,
        };
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: fakeReportService,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

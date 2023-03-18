import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let mockRepository: any;

  beforeEach(async () => {
    const reports: Report[] = [];
    mockRepository = jest.fn(() => ({
      metadata: {
        columns: [],
        relations: [],
      },
      async create(createReportDto: CreateReportDto) {
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
          user: '1',
        };
      },
      async save(report: Report) {
        reports.push(report);
        return report;
      },
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: getRepositoryToken(Report), useClass: mockRepository },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

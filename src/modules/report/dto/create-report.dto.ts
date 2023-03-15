import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Max(2050)
  @Min(1930)
  @IsNumber()
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @Max(1000000)
  @Min(0)
  @IsNumber()
  km: number;

  @Max(1000000)
  @Min(0)
  @IsNumber()
  price: number;
}

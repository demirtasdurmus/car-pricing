import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform((data: TransformFnParams) => parseInt(data.value))
  @Max(2050)
  @Min(1930)
  @IsNumber()
  year: number;

  @Transform((data: TransformFnParams) => parseFloat(data.value))
  @IsLongitude()
  lng: number;

  @Transform((data: TransformFnParams) => parseFloat(data.value))
  @IsLatitude()
  lat: number;

  @Transform((data: TransformFnParams) => parseInt(data.value))
  @Max(1000000)
  @Min(0)
  @IsNumber()
  km: number;
}

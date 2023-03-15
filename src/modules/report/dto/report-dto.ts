import { Expose, Transform, TransformFnParams } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: string;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  km: number;

  @Expose()
  price: number;

  @Expose()
  approved: boolean;

  @Transform((params: TransformFnParams) => params.obj.user.id)
  @Expose()
  userId: string;
}

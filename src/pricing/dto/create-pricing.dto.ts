import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePricingDto {
  @IsInt()
  @IsNotEmpty()
  modelId!: number;

  @IsInt()
  @IsNotEmpty()
  engineId!: number;

  @IsInt()
  @IsNotEmpty()
  transmissionId!: number;

  @IsInt()
  @IsNotEmpty()
  serviceId!: number;
}

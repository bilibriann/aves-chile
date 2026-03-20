import { IsOptional, IsString } from 'class-validator';

export class BuscarAveDto {
  @IsOptional()
  @IsString()
  nombre?: string;
}

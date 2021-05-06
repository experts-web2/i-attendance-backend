import { ApiPropertyOptional } from '@nestjs/swagger';

export class CenterDto {
  _id?: string;
  name: string;
  city: string;
  managers: string[];
}

export class GetCentersQueryParams {
  @ApiPropertyOptional()
  city: string;
}

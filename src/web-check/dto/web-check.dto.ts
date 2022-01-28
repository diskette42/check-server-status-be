import { IsNotEmpty } from 'class-validator';

export class AllWebDataDto {
  name: string;
  data: WebDataDto[];
}

export class WebDataDto {
  @IsNotEmpty()
  owner: string;
  @IsNotEmpty()
  webURL: string;
  @IsNotEmpty()
  webName: string;
}

export class DeleteDataDto {
  // @IsNotEmpty()
  owner: string;
  // @IsNotEmpty()
  webName: string;
}

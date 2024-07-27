import { IsNumber } from 'class-validator';

export class WriteMessageDto {
  @IsNumber()
  chatId: number;
}

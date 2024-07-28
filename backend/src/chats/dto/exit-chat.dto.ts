import { IsNumber } from 'class-validator';

export class ExitChatDto {
  @IsNumber()
  chatId: number;
}

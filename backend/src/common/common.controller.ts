import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigService } from '@nestjs/config';

import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';

import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../users/decorator/user.decorator';

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  postImage(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }

  @Post('image/user')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  async postUserImage(
    @User('id') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.commonService.uploadUserImage(
      userId,
      file.path,
      file.filename,
    );
  }
}

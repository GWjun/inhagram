import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';

import { extname } from 'path';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MulterModule.register({
      limits: { fileSize: 10000000 },

      fileFilter(req, file, callback) {
        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext != '.png')
          return callback(
            new BadRequestException('jpg/jpeg/png file only'),
            false,
          );
        return callback(null, true);
      },

      storage: multer.diskStorage({
        destination: function (req, res, callback) {
          callback(null, TEMP_FOLDER_PATH);
        },
        filename(req, file, callback) {
          callback(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}

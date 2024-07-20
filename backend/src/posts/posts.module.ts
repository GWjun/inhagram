import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsModel } from './entities/posts.entity';
import { ImageModel } from '../common/entity/image.entity';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from '../common/common.module';

import { PostsImagesService } from './image/images.service';
import { CloudStorageService } from '../common/cloud/cloud-storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsModel, ImageModel]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsImagesService, CloudStorageService],
})
export class PostsModule {}

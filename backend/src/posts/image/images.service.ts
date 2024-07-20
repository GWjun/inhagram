import { QueryRunner, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ImageModel } from '../../common/entity/image.entity';
import { CreatePostImageDto } from './dto/create-image.dto';
import { CloudStorageService } from '../../common/cloud/cloud-storage.service';

import { join } from 'path';
import { TEMP_FOLDER_PATH } from '../../common/const/path.const';
import { promises } from 'fs';

@Injectable()
export class PostsImagesService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempFilePath);
    } catch (error) {
      throw new BadRequestException('File does not exist');
    }

    try {
      await this.cloudStorageService.uploadFile(tempFilePath);

      const result = await repository.save({
        ...dto,
      });

      await promises.unlink(tempFilePath);

      return result;
    } catch (error) {
      throw new BadRequestException('Failed to upload image');
    }
  }
}

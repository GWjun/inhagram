import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { Bucket, Storage } from '@google-cloud/storage';

import { basename } from 'path';

@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get('PROJECT_ID'),
      credentials: {
        client_email: this.configService.get('CLIENT_EMAIL'),
        private_key: this.configService
          .get('PRIVATE_KEY')
          .split(String.raw`\n`)
          .join('\n'),
      },
    });

    this.bucket = this.storage.bucket(configService.get('STORAGE_BUCKET'));
  }

  async uploadFile(filePath) {
    try {
      const fileName = basename(filePath);

      await this.bucket.upload(filePath, {
        destination: fileName,
      });
    } catch (error) {
      throw new Error('cloud image error');
    }
  }

  async deleteFile(filename: string) {
    try {
      await this.bucket.file(filename).delete();
    } catch (error) {
      throw new Error('cloud image error');
    }
  }
}

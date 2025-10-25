import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary';

export const uploadImage = async (
  file: Buffer | string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'civic-issues',
      resource_type: 'image' as const,
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (err, result) => {
        if (err) {
          console.error('Cloudinary upload error:', err);
          reject(err);
        } else {
          resolve(result as UploadApiResponse);
        }
      }
    );

    if (Buffer.isBuffer(file)) {
      stream.end(file);
    } else {
      const fs = require('fs');
      const readStream = fs.createReadStream(file);
      readStream.pipe(stream);
    }
  });
};

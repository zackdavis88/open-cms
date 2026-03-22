import { Request, Response } from 'express';
import { ImageData } from 'src/types';
import { uploadImages, MAX_FILE_COUNT, MAX_FILE_SIZE } from 'src/controllers/image/utils';
import { MulterError } from 'multer';
import { ValidationError } from 'src/server/utils/errors';

let BASE_STATIC_URL = '/static';
if (
  typeof process.env.BASE_STATIC_URL === 'string' &&
  process.env.BASE_STATIC_URL.startsWith('/')
) {
  BASE_STATIC_URL = process.env.BASE_STATIC_URL;
}

type CreateImagesResponseBody = {
  images: ImageData[];
};

const createImagesFlow = async (req: Request, res: Response) => {
  try {
    uploadImages(req, res, (err) => {
      if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        throw new ValidationError(`cannot upload more than ${MAX_FILE_COUNT} files`);
      } else if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
        throw new ValidationError(
          `file size cannot be larger than ${MAX_FILE_SIZE} bytes`,
        );
      } else if (err) {
        throw err;
      }

      // Shouldnt hit this condition but for type safety its here.
      // It will throw a FatalError.
      if (!req.files || !Array.isArray(req.files) || !req.files.length) {
        throw new Error('failed to upload files');
      }

      const responseBody: CreateImagesResponseBody = {
        images: req.files?.map(({ originalname, filename }) => ({
          originalFileName: originalname,
          fileName: filename,
          url: new URL(
            `${BASE_STATIC_URL}/${req.params.projectId}/${filename}`,
            `${req.protocol}://${req.host}`,
          ).toString(),
        })),
      };

      return res.success('images successfully uploaded', responseBody);
    });
  } catch (error) {
    return res.sendError(error);
  }
};

export default createImagesFlow;

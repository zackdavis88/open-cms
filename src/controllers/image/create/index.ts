import { Request, Response } from 'express';
import { ImageData, ProjectData, UserData } from 'src/types';
import {
  uploadImages,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
  getImageUrl,
} from 'src/controllers/image/utils';
import { MulterError } from 'multer';
import { ValidationError } from 'src/server/utils/errors';
import { Image } from 'src/models';
import path from 'path';
import { getImageData, getPublicUserData } from 'src/controllers/utils';

type CreateImagesResponseBody = {
  project: Pick<ProjectData, 'id' | 'name'>;
  createdBy: UserData;
  images: Omit<ImageData, 'project' | 'createdBy'>[];
};

// Note:
// This code's pattern is a little different because of the way Multer works, following
// the same pattern as other controllers w.r.t validation isnt the very clean to do.
const createImagesFlow = async (req: Request, res: Response) => {
  uploadImages(req, res, async (err) => {
    try {
      const { project, user, host, protocol } = req;
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

      // Save records of the images to the db.
      const newImages = await Image.bulkCreate(
        req.files.map(({ originalname, filename }) => {
          const filePathData = path.parse(filename);
          return {
            id: filePathData.name,
            originalFileName: path.parse(originalname).name,
            extension: filePathData.ext,
            projectId: project.id,
            createdById: user.id,
          };
        }),
      );

      const imagesResponseData = newImages.map((image) => {
        return {
          ...getImageData(
            Object.assign(image, {
              url: getImageUrl({
                host,
                image,
                project,
                protocol,
              }),
              project,
              createdBy: user,
            }),
          ),
          createdBy: undefined,
          project: undefined,
        };
      });
      const responseBody: CreateImagesResponseBody = {
        project: {
          id: project.id,
          name: project.name,
        },
        createdBy: getPublicUserData(user),
        images: imagesResponseData,
      };

      return res.success('images successfully uploaded', responseBody);
    } catch (error) {
      res.sendError(error);
    }
  });
};

export default createImagesFlow;

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ValidationError } from 'src/server/utils/errors';
const FIVE_MEGABYTES = 5 * 1024 * 1024;

export let MAX_FILE_COUNT = Number(process.env.MAX_FILE_COUNT);
if (
  !process.env.MAX_FILE_COUNT ||
  isNaN(MAX_FILE_COUNT) ||
  !Number.isInteger(MAX_FILE_COUNT) ||
  MAX_FILE_COUNT <= 0
) {
  MAX_FILE_COUNT = 5;
}

export let MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE);
if (
  !process.env.MAX_FILE_SIZE ||
  isNaN(MAX_FILE_SIZE) ||
  !Number.isInteger(MAX_FILE_SIZE) ||
  MAX_FILE_SIZE <= 0
) {
  MAX_FILE_SIZE = FIVE_MEGABYTES;
}

export let MAX_FILENAME_LENGTH = Number(process.env.MAX_FILENAME_LENGTH);
if (
  !process.env.MAX_FILENAME_LENGTH ||
  isNaN(MAX_FILENAME_LENGTH) ||
  !Number.isInteger(MAX_FILENAME_LENGTH) ||
  MAX_FILENAME_LENGTH <= 0
) {
  MAX_FILENAME_LENGTH = 100;
}

const storage = multer.diskStorage({
  destination: async function (req, _file, callback) {
    const desitinationPath = path.join(
      path.resolve(__dirname, '..', '..', '..', '..'),
      'public',
      req.params.projectId,
    );
    try {
      await fs.promises.mkdir(desitinationPath, { recursive: true });
    } catch {
      callback(new Error(`failed to create destination folder: ${desitinationPath}`), '');
    }
    callback(null, desitinationPath);
  },
  filename: function (_req, file, callback) {
    const extension = path.extname(file.originalname);
    callback(null, `${crypto.randomUUID() + extension}`);
  },
});

const uploadImages = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: function (_req, file, callback) {
    const allowedFileTypes = /jpeg|jpg|png|webp|gif/;
    const isValidExtension = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const isValidMimeType = allowedFileTypes.test(file.mimetype);
    if (!isValidExtension || !isValidMimeType) {
      return callback(new ValidationError('image files must be jpeg|jpg|png|webp|gif'));
    }

    if (file.originalname.length > MAX_FILENAME_LENGTH) {
      return callback(
        new ValidationError(`filename must be ${MAX_FILENAME_LENGTH} characters or less`),
      );
    }

    callback(null, true);
  },
}).array('images', MAX_FILE_COUNT);

export default uploadImages;

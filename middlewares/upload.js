import multer from "multer";
import path from "path";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const filePrefix = `${Date.now()}`;
    const fileName = `${filePrefix}_${file.originalname}`;
    callback(null, fileName);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 2,
};

export const upload = multer({ storage, limits });

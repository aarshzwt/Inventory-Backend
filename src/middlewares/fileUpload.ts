import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";

/**
 * Create upload directories
 */
const createUploadDir = (dir: string): string => {
  const uploadDir = path.join(__dirname, "..", "..", "uploads", dir);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return uploadDir;
};

/**
 * Image Storage
 */
const imageStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const imageDir = createUploadDir("image");
    cb(null, imageDir);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

/**
 * Image Filter
 */
const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only Images are allowed (jpeg, jpg, png)"));
  }
};

/**
 * Image Upload Handler
 */
export const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: imageFilter,
});

/**
 * Multer Error Handling Middleware
 */
export const handleMulterError = (
  err: unknown,
  req: Request,
  res: any,
  next: Function
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size exceeds the 2MB limit.",
      });
    }

    return res.status(400).json({
      error: err.message || "File upload error",
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      error: err.message || "Something went wrong!",
    });
  }

  next();
};

import { Request, Response, NextFunction } from "express";
import extractSkills from "../service/extractSkills.js";
import { upload } from "../middlleware/multerConfig.js";

const uploadSingle = upload.single("resume");

export const fileUploader = (req: Request, res: Response, next: NextFunction) => {
  uploadSingle(req, res, async (err: any) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // use the local path for processing
      const filePath = req.file.path;

      return res.status(200).json({
        message: "Resume processed successfully",
      });
    } catch (error) {
      console.error("Error processing resume:", error);
      next(error);
    }
  });
};

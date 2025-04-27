import path from "path";
import { prisma } from "../DB/db.config.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { imageValidator } from "../utils/helper.js";
import fs from "fs";
import { logger } from "../config/logger.js";

export class ProfileController {
  static async index(req, res) {
    try {
      const user = req.user;
      logger.info("Request was successful")
      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      logger.error(error?.message || error)
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const authuser = req.user;


  
      if (!req.file || Object.keys(req.file)?.length === 0) {
        return res.status(400).json({
          message: "Profile image is required",
        });
      }
  
      const profile = req.file;
      const message = imageValidator(profile?.size, profile?.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            profile: message,
          },
        });
      }
  
      const result = await uploadOnCloudinary(req.file.path);
  
      fs.unlinkSync(req.file.path);
  
      const updatedUser = await prisma.user.update({
        data: {
          profile_img: result.secure_url,
        },
        where: {
          id: Number(authuser.id),
        },
      });

      logger.info("Request was successful")
  
      return res.status(200).json({
        message: "Profile image uploaded successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);
      logger.error(error?.message || error)
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}

import vine, { errors } from "@vinejs/vine";
import fs from "fs";

import { newsSchema } from "../validation/newsValidation.js";
import { clearNewsCache, imageValidator } from "../utils/helper.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { prisma } from "../DB/db.config.js";
import { redis } from "../DB/redis.config.js";
import { logger } from "../config/logger.js";

export class NewsController {
  static async index(req, res) {
    try {
      let pages = Number(req.query.pages) || 1;
      let limit = Number(req.query.limit) || 10;

      if (pages < 0) {
        pages = 1;
      }

      if (limit < 0 || limit >= 100) {
        limit = 10;
      }
      const skip = (pages - 1) * limit;

      const cachedKey = `news:page:${pages}:limit:${limit}`;

      const cachedData = await redis.get(cachedKey);

      if (cachedData) {
        return res.status(200).json({
          news: JSON.parse(cachedData),
        });
      }

      const news = await prisma.news.findMany({
        take: limit,
        skip: skip,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_img: true,
            },
          },
        },
      });
      const totalNews = await prisma.news.count();
      const totalPages = Math.ceil(totalNews / limit);

      const responseData = {
        news,
        metaData: {
          totalPages,
          currentPages: pages,
          currentLimit: limit,
        },
      };

      await redis.set(cachedKey, JSON.stringify(responseData), "EX", 60);
      logger.info("Request was successful");

      return res.status(200).json({
        news: responseData,
      });
    } catch (error) {
      console.log(error);
      logger.error(error?.message || error);
      return res.status(500).json({
        errors: "Something went wrong, Please try again",
      });
    }
  }

  static async store(req, res) {
    try {
      const body = req.body;
      const { id } = req.params;
      const validator = vine.compile(newsSchema);
      const data = await validator.validate(body);
      
      if (!req.file || Object.keys(req.file)?.length === 0) {
        return res.status(400).json({
          message: "Image is required",
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

      const newNews = await prisma.news.create({
        data: {
          title: body.title,
          content: body.content,
          image: result.secure_url,
          user_id: Number(id),
        },
      });
      await clearNewsCache();
      logger.info("Request was successful");

      return res.status(200).json({
        message: "News added successfully",
        news: newNews,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        console.log(error);
        logger.error(error?.error || error);
        return res.status(500).json({
          errors: "Something went wrong, Please try again",
        });
      }
    }
  }

  static async show(req, res) {
    try {
      const { id } = req.params;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!news) {
        return res.status(400).json({
          message: "News not found!",
        });
      }
      logger.info("Request was successful");

      return res.status(200).json({
        message: "News fetched successfully",
        news,
      });
    } catch (error) {
      console.log(error);
      logger.error(error?.message || error);
      return res.status(500).json({
        errors: "Something went wrong, Please try again",
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      const body = req.body;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: true,
        },
      });

      if (!news) {
        return res.status(400).json({
          message: "News not found!",
        });
      }

      body.title = body.title || news.title;
      body.content = body.content || news.content;

      const validator = vine.compile(newsSchema);
      const data = await validator.validate(body);
      let imageResult = undefined;

      if (user.id !== news.user_id) {
        return res.status(400).json({
          message: "Unauthorized",
        });
      }

      const image = req?.file;

      if (image) {
        const message = imageValidator(image?.size, image?.mimetype);

        if (message !== null) {
          return res.status(400).json({
            errors: {
              image: message,
            },
          });
        }
        imageResult = await uploadOnCloudinary(req.file.path);

        fs.unlinkSync(req.file.path);
      }

      const updatedNews = await prisma.news.update({
        data: {
          image: image ? imageResult.secure_url : news.image,
          content: body.content ? body.content : news.content,
          title: body.title ? body.title : news.title,
        },
        where: {
          id: Number(id),
        },
      });

      await clearNewsCache();
      logger.info("Request was successful");

      return res.status(200).json({
        message: "news updated successfully",
        news: updatedNews,
      });
    } catch (error) {
      console.log(error);
      logger.error(error?.message || error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        console.log(error);
        return res.status(500).json({
          errors: "Something went wrong, Please try again",
        });
      }
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (user.id !== news.user_id) {
        return res.status(400).json({
          message: "Unauthorized",
        });
      }

      await prisma.news.delete({
        where: {
          id: Number(id),
        },
      });

      await clearNewsCache();
      logger.info("Request was successful");

      return res.status(200).json({
        message: "News deleted successfully",
      });
    } catch (error) {
      logger.error(error?.message || error);
      return res.status(500).json({
        errors: "Something went wrong, Please try again",
      });
    }
  }
}

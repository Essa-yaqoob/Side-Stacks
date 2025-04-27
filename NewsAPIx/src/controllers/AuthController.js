import vine, { errors } from "@vinejs/vine";
import * as argon2 from "argon2";
import { prisma } from "../DB/db.config.js";

import { logger } from "../config/logger.js";
import { emailQueue, emailQueueName } from "../jobs/sendEmailsJob.js";
import { generateJwt } from "../utils/jwtToken.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";

export class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const data = await validator.validate(body);

      const isUserExist = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (isUserExist) {
        return res.status(400).json({
          errors: {
            email:
              "User already exisit with this email, Please try with new one",
          },
        });
      }

      const hashedPassword = await argon2.hash(data.password);

      const user = await prisma.user.create({
        data: {
          name: data.email,
          email: data.email,
          password: hashedPassword,
        },
      });

      logger.info("Request was successful");
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      logger.error(error?.message || error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        return res.status(500).json({
          errors: "Something went wrong, Please try again",
        });
      }
    }
  }

  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const data = await validator.validate(body);

      const isUserExist = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (!isUserExist) {
        return res.status(400).json({
          errors: {
            user: "User does not exist, Please register",
          },
        });
      }

      const verifyPassword = await argon2.verify(
        isUserExist.password,
        data.password
      );

      if (!verifyPassword) {
        return res.status(400).json({
          errors: {
            user: "Invalid credential",
          },
        });
      }

      const token = generateJwt(
        isUserExist.id,
        isUserExist.email,
        isUserExist.name
      );

      logger.info("Request was successful");

      await emailQueue.add(
        emailQueueName,
        {
          userName: isUserExist.name,
          userEmail: isUserExist.email,
        },
        { priority: 2, jobId: `send-email-${isUserExist.id}` }
      );

      return res.status(200).json({
        message: "Login successfully",
        token: `Bearer ${token}`,
        user: isUserExist,
      });
    } catch (error) {
      console.log(error);
      logger.error(error?.message || error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        return res.status(500).json({
          errors: "Something went wrong, Please try again",
        });
      }
    }
  }
}

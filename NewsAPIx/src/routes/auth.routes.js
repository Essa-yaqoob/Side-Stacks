import {Router} from "express"

import { AuthController } from "../controllers/AuthController.js"
import { authentication } from "../middlewares/authentication.js"
import { upload } from "../utils/multer.js"
import { ProfileController } from "../controllers/ProfileController.js"

const router = Router()

router.post("/register", AuthController.register)

router.post("/login", AuthController.login)


router.get("/profile", authentication,ProfileController.index);

router.post("/profile/:id", authentication, upload.single("profile"), ProfileController.update)

export default router
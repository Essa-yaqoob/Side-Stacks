import {Router} from "express"

import { NewsController } from "../controllers/NewsController.js"
import { authentication } from "../middlewares/authentication.js"
import { upload } from "../utils/multer.js"

const router = Router()

router.use(authentication)

router.get("/", NewsController.index)

router.post("/:id",upload.single("image") ,NewsController.store)

router.get("/:id", NewsController.show)

router.put("/:id",upload.single("image") ,NewsController.update)

router.delete("/:id", NewsController.destroy)

export default router
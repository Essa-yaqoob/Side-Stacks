import multer from "multer"
import path from "path"

const storage  = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(process.cwd(), "./src/public/images"))
    },
    filename : (req, file , cb) => {
        cb(null, (Math.floor(Math.random()) / 100) + `${file.originalname}`)
    }
})

export const upload = multer({storage})
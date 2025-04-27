import vine from "@vinejs/vine"
import { CustomErrorReporter } from "../utils/customErrorReporter.js"

//* globally
vine.errorReporter = () => new CustomErrorReporter()

export const registerSchema = vine.object({
    name : vine.string().minLength(2).maxLength(200),
    email : vine.string().email(),
    password : vine.string().minLength(8).maxLength(34).confirmed()
})
export const loginSchema = vine.object({
    email : vine.string().email(),
    password : vine.string().confirmed()
})
import * as argon2 from "argon2"

export const hashedPassword = async (password) => {
    return await argon2.hash(password)
}

export const verifyPassword = async (password, hashedPassword) => {
    try {
        return await argon2.verify(hashedPassword, password)
    } catch (error) {
        console.log("Hashing failed : ",error)
        throw new Error("Password hashed failed")
    }
}
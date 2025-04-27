import { supportMims } from "../config/filesystem.js"
import { redis } from "../DB/redis.config.js"

export const imageValidator = (size, mime) => {
    if(bytesToMb(size) > 2){
        return "Image size must be less than 2 MB"
    } else if (!supportMims.includes(mime)){
        return "Image must be type of png,jpg,jpeg,svg,webp,gif..."
    }

    return null
}

export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024)
}


export async function clearNewsCache() {
    const keys = await redis.keys('news:page:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log('News cache cleared!');
    }
  }
import Redis from "ioredis"

export const redis = new Redis({
    host : process.env.REDIS_HOST || "localhost",
    port : process.env.REDIS_PORT || 6379
})

redis.on("connect", () => {
    console.log(`Redis connected successfully`)
})

redis.on("error",(err) => {
    console.log(`Redis error : ${err}`)
})
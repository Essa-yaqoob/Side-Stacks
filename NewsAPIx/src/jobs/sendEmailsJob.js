import { Queue, Worker } from "bullmq";

import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import { sendMailer } from "../config/mailer.js";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

export const handler = new Worker(
  emailQueueName,
  async (job) => {
    console.log(`The Email worker job id is ${job.id}`);
    const {userName, userEmail } = job.data
    sendMailer(userName, userEmail)
  },
  { connection: redisConnection }
);


handler.on("completed", (job) => {
    console.log(`the job ${job.id} is completed`)
})

handler.on("failed", (job) => {
    console.log(`the job ${job.id} is failed`)
})
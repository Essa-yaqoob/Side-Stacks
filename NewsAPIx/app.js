import express from "express";
import helmet from "helmet";

import { limit } from "./src/config/rateLimiter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(limit);

import authRoutes from "./src/routes/auth.routes.js";
import newsRoutes from "./src/routes/news.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/news", newsRoutes);

//* import queue

import "./src/jobs/index.js"

export default app;

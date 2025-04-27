import { rateLimit } from "express-rate-limit";

export const limit = rateLimit({
  windowMs: 60 * 60 * 1000,    
  limit: 100,                  
  standardHeaders: 'draft-8', 
  legacyHeaders: false,
});

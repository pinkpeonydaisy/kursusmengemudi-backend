import rateLimit from "express-rate-limit";
const NODE_ENV = ( process.env.NODE_ENV || "PROD" ).toUpperCase();
export const limiter = rateLimit( {
  windowMs: 60 * 1000,
  limit: NODE_ENV !== "PROD" ? 5000 : 120,
  standardHeaders: "draft-7",
  legacyHeaders: false
} );
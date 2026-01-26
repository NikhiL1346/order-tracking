import rateLimit from "express-rate-limit";
import { env } from "../config/env.config";
import { Request, Response } from "express";

export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
    errorCode: "RATE_LIMIT_EXCEEDED",
    statusCode: 429,
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
    errorCode: "RATE_LIMIT_EXCEEDED",
    statusCode: 429,
    timestamp: new Date().toISOString(),
  },
  skipSuccessfulRequests: true,
});

export const orderRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 order requests per minute
  message: {
    success: false,
    message: "Too many order requests, please slow down",
    errorCode: "RATE_LIMIT_EXCEEDED",
    statusCode: 429,
    timestamp: new Date().toISOString(),
  },
});
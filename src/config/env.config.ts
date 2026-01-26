import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar("PORT", "5000"), 10),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  DATABASE_URL: getEnvVar("DATABASE_URL", "file:./dev.db"),
  JWT_SECRET: getEnvVar("JWT_SECRET", "change-this-secret"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "24h"),
  CORS_ORIGIN: getEnvVar("CORS_ORIGIN", "*"),
  EMAIL_HOST: getEnvVar("EMAIL_HOST", "smtp.gmail.com"),
  EMAIL_PORT: parseInt(getEnvVar("EMAIL_PORT", "587"), 10),
  EMAIL_USER: getEnvVar("EMAIL_USER", ""),
  EMAIL_PASS: getEnvVar("EMAIL_PASS", ""),
  EMAIL_FROM: getEnvVar("EMAIL_FROM", ""),
  RATE_LIMIT_WINDOW_MS: parseInt(
    getEnvVar("RATE_LIMIT_WINDOW_MS", "900000"),
    10
  ),
  RATE_LIMIT_MAX_REQUESTS: parseInt(
    getEnvVar("RATE_LIMIT_MAX_REQUESTS", "100"),
    10
  ),
};
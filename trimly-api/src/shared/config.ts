import dotenv from "dotenv";
dotenv.config();

export const config = {
	cors: {
		ALLOWED_ORIGIN:
			process.env.CORS_ALLOWED_ORIGIN || "http://localhost:5173",
	},

	server: {
		PORT: process.env.PORT || 5000,
		NODE_ENV: process.env.NODE_ENV || "development",
	},

	database: {
		URI: process.env.DATABASE_URI || "",
	},

	nodemailer: {
		EMAIL_USER: process.env.EMAIL_USER,
		EMAIL_PASS: process.env.EMAIL_PASS,
	},

	jwt: {
		ACCESS_SECRET_KEY: process.env.JWT_ACCESS_KEY || "access-secret-key",
		REFRESH_SECRET_KEY: process.env.JWT_REFRESH_KEY || "refresh-secret-key",
		RESET_SECRET_KEY: process.env.JWT_RESET_KEY || "reset-secret-key",
		ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
		REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
		RESET_EXPIRES_IN: process.env.JWT_RESET_EXPIRES_IN || "5m",
	},

	redis: {
		REDIS_USERNAME: process.env.REDIS_USERNAME || "default",
		REDIS_PASS: process.env.REDIS_PASS,
		REDIS_HOST: process.env.REDIS_HOST,
		REDIS_PORT: process.env.REDIS_PORT || "16807"
	},

	OtpExpiry: process.env.OTP_EXPIRY_IN_MINUTES || "2",

	loggerStatus: process.env.LOGGER_STATUS || "dev",

	bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
};

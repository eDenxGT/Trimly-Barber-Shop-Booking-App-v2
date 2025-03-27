import fs from "fs";
import path from "path";
import morgan from "morgan";
import { config } from "../../shared/config.js";
import { NextFunction, Request, Response } from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.resolve(__dirname, "../../../logs");

if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory, { recursive: true });
}

const accessLogStream = fs.createWriteStream(
	path.join(logDirectory, "requests.log"),
	{ flags: "a" }
);

morgan.token("date", () => new Date().toISOString());
morgan.token("custom-status", (req, res) => `\x1b${res.statusCode}\x1b[0m`);
morgan.token("customDate", () => {
	return new Date().toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
	});
});

const customFormat = `:remote-addr - :method :url :status :response-time ms - :res[content-length] bytes [:customDate]`;

const logFormat = config.loggerStatus || "combined";

const morganLogger = (req: Request, res: Response, next: NextFunction) => {
	if (logFormat) {
		morgan(customFormat, { stream: accessLogStream })(req, res, () => {});

		morgan(logFormat)(req, res, next);
	} else {
		next();
	}
};
(req: Request, res: Response, next: NextFunction) => {
	if (logFormat) {
		morgan(logFormat, { stream: accessLogStream })(req, res, () => {});

		morgan(logFormat)(req, res, next);
	} else {
		next();
	}
};

export default morganLogger;

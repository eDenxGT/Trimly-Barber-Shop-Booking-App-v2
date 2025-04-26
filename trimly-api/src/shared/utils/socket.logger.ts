import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.resolve(__dirname, "../../../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const socketLogFormat = winston.format.printf(
  ({ timestamp, level, message, socketId, event, userId }) => {
    const formattedTimestamp = new Date(timestamp as string).toLocaleString(
      "en-US",
      {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

    return `[${formattedTimestamp}] [${level}] [Socket ID: ${
      socketId || "N/A"
    }] [Event: ${event || "N/A"}] [User ID: ${userId || "N/A"}] - ${message}`;
  }
);

const socketLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    socketLogFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDirectory, "socket-events.log"),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

export default socketLogger;

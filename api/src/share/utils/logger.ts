// eslint-disable-next-line hexagonal-architecture/enforce
import { createLogger, format, transports } from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const fileFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json({ deterministic: true, space: 2 })
);

const consoleFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack, ...meta }) => {
        return (
            `[${timestamp}] ${level}: ${message}` +
            (stack ? `\n${stack}` : "") +
            (Object.keys(meta).length
                ? `\nMeta: ${JSON.stringify(meta, null, 2)}`
                : "")
        );
    })
);

export const logger = createLogger({
    level: LOG_LEVEL,
    transports: [
        new transports.File({
            filename: "logs/combine.log",
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
            format: fileFormat,
        }),
        new transports.File({
            filename: "logs/errors.log",
            level: "error",
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
            format: fileFormat,
        }),
        new transports.Console({ format: consoleFormat }),
    ],
});

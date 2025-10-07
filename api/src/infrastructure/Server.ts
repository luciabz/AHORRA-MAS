import {Server as http} from "http";
import express, {Application} from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import {logger} from "../share/utils/logger";

export default class Server {
    public readonly http: http;
    public readonly application: Application;

    constructor(private readonly PORT: number) {
        this.http = new http();
        this.application = express();

        this.application.use(express.json());
        this.application.use(express.urlencoded({extended: true}));
        this.application.use(cors());
        this.application.use(
            morgan(
                ":remote-addr :method :url :status :response-time ms - :res[content-length]",
                {
                    stream: {
                        write: (message: string) => {
                            logger.info(message.trim());
                        },
                    },
                }
            )
        );
        this.application.use(
            helmet({
                contentSecurityPolicy: false, // Disable CSP for simplicity, adjust as needed
                crossOriginEmbedderPolicy: false, // Disable COEP for simplicity, adjust as needed
                crossOriginOpenerPolicy: false, // Disable COOP for simplicity, adjust as needed
                crossOriginResourcePolicy: false, // Disable CORP for simplicity, adjust as needed
                referrerPolicy: {policy: "no-referrer"}, // Set a default referrer policy
                xssFilter: true, // Enable XSS filter
                xPoweredBy: false,
            })
        );
        logger.debug(`Server initialized on port ${this.PORT}`);
    }

    public start(): Promise<void> {
        logger.debug(`Starting server on port ${this.PORT}`);
        let resolve: () => void;

        const promise = new Promise<void>((res) => {
            resolve = res;
        });

        this.http.on("request", this.application);
        this.http.listen(this.PORT, () => {
            logger.info(`Server is listening on port ${this.PORT}`);
            resolve();
        });

        return promise;
    }

    public stop(): Promise<void> {
        logger.debug(`Stopping server on port ${this.PORT}`);
        let resolve: () => void;
        const promise = new Promise<void>((res) => {
            resolve = res;
        });

        this.http.close(() => {
            logger.info(`Server has stopped on port ${this.PORT}`);
            resolve();
        });

        return promise;
    }
}

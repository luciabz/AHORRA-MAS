// eslint-disable-next-line hexagonal-architecture/enforce
import {logger} from "./logger";
import ApplicationModule from "../interfaces/ApplicationModule";

export function CloseProcessCallback(applicationModule: ApplicationModule) {
    return async (err?: Error | unknown) => {
        logger.info("Closing process...");

        if (err && err instanceof Error)
            logger.error("An error occurred:", err);

        try {
            await applicationModule.stop();
        } catch (error) {
            logger.error("Error while stopping the application:", error);
            process.exit(1);
        }

        process.exit(0);
    };
}

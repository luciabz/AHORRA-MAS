import "reflect-metadata"
import "dotenv/config"
import Application from "./infrastructure/Application";
import Server from "./infrastructure/Server";
import Database from "./infrastructure/database/Database";


const application = Application.instance

const PORT = process.env.PORT
const POSTGRES_URL = process.env.POSTGRES_URL

if (!POSTGRES_URL) throw new Error("environment required: POSTGRES_URL")
if (!PORT) throw new Error("environment required: PORT")

const server = new Server(parseInt(PORT))
const database = new Database(POSTGRES_URL)

application.Server = server
application.database = database

import {CloseProcessCallback} from "./share/utils/closeProcess";

process.on("unhandledRejection", CloseProcessCallback(application));
process.on("uncaughtException", CloseProcessCallback(application));
process.on("SIGINT", CloseProcessCallback(application));
process.on("SIGTERM", CloseProcessCallback(application));


import notFoundController from "./infrastructure/http/NotFound.controller";
import IndexRouter from "./infrastructure/http/index.router";

application.Server.application.use("/api/v1", IndexRouter)
application.Server.application.use(notFoundController)

application.start().catch(console.error)
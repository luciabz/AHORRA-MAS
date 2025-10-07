import "reflect-metadata"
import {DataSource} from "typeorm"
import ApplicationModule from "../../share/interfaces/ApplicationModule";
import {logger} from "../../share/utils/logger";
import User from "../../modules/user/domain/entity/User";
import Transaction from "../../modules/transactions/domain/entity/Transaction";
import Goal from "../../modules/goal/domain/entity/Goal";
import Category from "../../modules/category/domain/entity/Category";
import ScheduleTransaction from "../../modules/scheduleTransactions/domain/entity/ScheduleTransaction";

export default class Database implements ApplicationModule {
    constructor(url: string) {
        this.datasource = new DataSource({
            type: "postgres",
            url: url,
            synchronize: true,
            logging: false,
            entities: [User, Transaction, Goal, Category, ScheduleTransaction],
            migrations: [],
            subscribers: [],
        })
    }

    public datasource: DataSource

    async start(): Promise<void> {
        await this.datasource.initialize()
        logger.info("Database connected")
    }

    async stop(): Promise<void> {
        await this.datasource.destroy()
        logger.info("Database disconnected")
    }
}

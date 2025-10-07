import {Router} from "express";


const indexRouter = Router();

indexRouter.get("/", (_, res) => {
    res.status(200).json({
        status: true,
        message: "Hello world",
        body: null,
    });
});

import userRoutes from "../../modules/user/infrastructure/http/user.routes";

indexRouter.use("/auth", userRoutes)

import {tokenMiddleware} from "../../modules/token/infrastructure/http/token.middleware";

indexRouter.use(tokenMiddleware)

import categoryRouter from "../../modules/category/infrastructure/http/category.router";

indexRouter.use("/category", categoryRouter)


import goalRouter from "../../modules/goal/infrastructure/http/goal.route";

indexRouter.use("/goal", goalRouter)

import scheduleTransactionRouter
    from "../../modules/scheduleTransactions/infrastructure/http/scheduleTransaction.route";

indexRouter.use("/schedule-transaction", scheduleTransactionRouter)

import transactionRouter from "../../modules/transactions/infrastructure/http/transaction.router";

indexRouter.use("/transaction", transactionRouter)

export default indexRouter;

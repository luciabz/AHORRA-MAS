import {Router} from "express";
import {
    createScheduleTransactionsController, deleteScheduleTransactionsController, detailScheduleTransactionsController,
    listScheduleTransactionsController, updateScheduleTransactionsController
} from "./scheduleTransaction.controller";

const scheduleTransactionRoute = Router({mergeParams: true});

scheduleTransactionRoute.route("/")
    .get(listScheduleTransactionsController)
    .post(createScheduleTransactionsController)

scheduleTransactionRoute.route("/:id")
    .get(detailScheduleTransactionsController)
    .patch(updateScheduleTransactionsController)
    .delete(deleteScheduleTransactionsController)

export default scheduleTransactionRoute;
import {Router} from "express";
import {
    createTransactionsController, deleteTransactionsController,
    detailTransactionsController,
    listTransactionsController, updateTransactionsController
} from "./transaction.controller";

const transactionRouter = Router({mergeParams: true});

transactionRouter.route("/")
    .post(createTransactionsController)
    .get(listTransactionsController)

transactionRouter.route("/:id")
    .get(detailTransactionsController)
    .delete(deleteTransactionsController)
    .patch(updateTransactionsController)

export default transactionRouter;
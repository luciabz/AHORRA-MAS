import {Router} from "express";
import {
    createGoalController,
    deleteGoalController,
    getGoalController,
    listGoalController,
    updateGoalController
} from "./Goal.controllers";

const goalRouter = Router({mergeParams: true});

goalRouter.route("/").get(listGoalController).post(createGoalController)

goalRouter.route("/:id").get(getGoalController).patch(updateGoalController).delete(deleteGoalController)

export default goalRouter;
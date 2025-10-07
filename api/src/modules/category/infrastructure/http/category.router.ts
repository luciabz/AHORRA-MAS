import {Router} from "express";
import {
    createCategoryController, deleteCategoryController,
    detailCategoryController,
    listCategoriesController,
    updateCategoryController
} from "./category.controller";

const categoryRouter = Router({mergeParams: true});

categoryRouter.route("/").get(listCategoriesController).post(createCategoryController)

categoryRouter.route("/:id").get(detailCategoryController).delete(deleteCategoryController).patch(updateCategoryController)

export default categoryRouter;
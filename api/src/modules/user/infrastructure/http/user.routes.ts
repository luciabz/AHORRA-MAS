import {Router} from "express";
import {loginController, registerController, selfUserInfoController} from "./user.controller";
import {loginMiddleware, registerMiddleware} from "./userMiddleware";
import {tokenMiddleware} from "../../../token/infrastructure/http/token.middleware";

const userRoutes = Router({mergeParams: true});

userRoutes.post("/register", registerMiddleware, registerController);
userRoutes.post("/login", loginMiddleware, loginController);

userRoutes.get("/me", tokenMiddleware, selfUserInfoController)

export default userRoutes
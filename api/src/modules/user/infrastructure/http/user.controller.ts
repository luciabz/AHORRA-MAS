import controllerBuilder from "../../../../share/utils/controllerBuilder";
import {loginUseCase, registerUseCase, userDetailUseCase} from "../../config/di.container";

export const loginController = controllerBuilder(async (req) => {
    const name = req.body.name;
    const password = req.body.password;

    return loginUseCase.execute(name, password);
})

export const registerController = controllerBuilder(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    await registerUseCase.execute(name, email, password);

    res.statusCode = 201;

    return "Usuario creado exitosamente";
})

export const selfUserInfoController = controllerBuilder(async (_, {locals}) => {
    const userId = locals.token!.sub

    return await userDetailUseCase.execute(Number(userId));
})
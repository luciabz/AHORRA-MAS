import {body} from "express-validator";

export const loginMiddleware = [
    body("name")
        .notEmpty({ignore_whitespace: true})
        .withMessage("es requerido el nombre de usuario")
        .isString()
        .withMessage("el nombre de usuario debe ser un texto")
        .isLength({min: 3, max: 50})
        .withMessage("el nombre de usuario debe tener entre 3 y 50 caracteres"),
    body("password")
        .notEmpty({ignore_whitespace: true})
        .withMessage("La contraseña es requerida")
        .isString()
        .withMessage("La contraseña debe ser un texto")
        .isLength({min: 8})
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .bail()
        .matches(/[a-z]/)
        .withMessage("La contraseña debe tener al menos una letra minúscula")
        .matches(/[A-Z]/)
        .withMessage("La contraseña debe tener al menos una letra mayúscula")
        .matches(/[0-9]/)
        .withMessage("La contraseña debe tener al menos un número")
]

export const registerMiddleware = [
    ...loginMiddleware,
    body("email")
        .notEmpty({ignore_whitespace: true})
        .withMessage("El email es requerido")
        .isEmail()
        .withMessage("El email debe ser un email válido")
        .isLength({max: 100})
        .withMessage("El email debe tener como máximo 100 caracteres"),
]
import Token from "../modules/token/domain/Token";

declare module "express" {
    export interface Response {
        locals: {
            token?: Token
        };
    }
}

import {Request, Response, NextFunction} from 'express';
import {jwtProviderImpl} from "../../config/di.container";

export const tokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).send('No token provided')
        }

        const decoded = jwtProviderImpl.verify(token);

        if (!decoded) {
            return res.status(401).send('Invalid token')
        }

        res.locals.token = decoded

        next();
    } catch (error) {
        return res.status(401).send('No token provided')
    }
}
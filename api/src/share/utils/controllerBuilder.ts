// eslint-disable-next-line hexagonal-architecture/enforce
import { NextFunction, Request, Response } from "express";

const ControllerBuilder =
    (controller: (req: Request, res: Response) => Promise<unknown> | unknown) =>
    async (req: Request, res: Response, next: NextFunction) => {
        let response = null;

        try {
            response = await controller(req, res);
        } catch (e) {
            next(e);
        }
        if (res.headersSent) return;

        if (response === undefined || response === null) {
            res.status(204).end(); // No Content
            return;
        }

        if (typeof response === "object") {
            res.status(res.statusCode || 200).json(response); // OK
        } else if (typeof response === "string") {
            res.status(res.statusCode || 200).send(response); // OK with string response
        } else {
            res.status(500).json({ error: "Unexpected response type" }); // Internal Server Error
        }

        return;
    };

export default ControllerBuilder;

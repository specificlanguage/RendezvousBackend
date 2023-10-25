import { Request, Response, NextFunction } from "express";

/**
 * Excepts a list of paths and methods to be parsed by middleware.
 * Each paths[i] and methods[i] acts as one pair.
 * @param paths - prefix without params to be excepted
 * @param methods - method that corresponds to each path to be excepted
 * @param middleware - middleware that is supposed to be normally used
 */
export function except(
    paths: string[],
    methods: string[],
    middleware: (req: Request, res: Response, next: NextFunction) => void,
) {
    return function (req: Request, res: Response, next: NextFunction) {
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const method = methods[i];
            if (req.path.startsWith(path) && req.method == method) {
                return next();
            }
        }
        return middleware(req, res, next);
    };
}

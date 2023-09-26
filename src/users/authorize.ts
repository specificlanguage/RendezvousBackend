import * as admin from "firebase-admin";
import * as serviceAccount from "../../firebase-account-keys.json";
import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const auth = getAuth();

export function AuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log(req.headers);
    const idToken = req.headers.authorization?.split(" ")[1] ?? "";
    auth.verifyIdToken(idToken)
        .then((decodedToken) => {
            res.locals.userID = decodedToken.uid;
            next();
        })
        .catch(() => {
            res.status(401).json({
                message: "Invalid credentials",
            });
        });
}

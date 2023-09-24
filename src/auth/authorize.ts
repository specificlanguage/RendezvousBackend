import * as admin from "firebase-admin";
import * as serviceAccount from "../../firebase-account-keys.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

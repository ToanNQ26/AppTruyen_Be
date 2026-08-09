import { googleClient } from "../config/googleauth.js";

// utils/google.ts
export async function verifyGoogleCredential(credential) {
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
        throw new AppError("Invalid Google token", 401);
    }

    return payload;
}
import Subscription from "../models/Subscription";
import User from "../models/User";
import webpush from "../config/vapis";
import { JwtPayload } from "types/utils.types";
import jwt from "jsonwebtoken";

// PAGINATION UTILITY FUNCTIONS
export const getPagination = (page: string, limit: string) => {
    const _page = Math.max(parseInt(page) || 1, 1);
    const _limit = Math.max(parseInt(limit) || 10, 1);
    const offset = (_page - 1) * _limit;

    return { _page, _limit, offset };
};

export const getPagingData = (count: number, page: number, itemsPerPage: number) => ({
    pagination: {
        total: count,
        page,
        itemsPerPage,
        totalPages: Math.ceil(count / itemsPerPage),
    }
});

// FUNCTION TO VERIFY THE REFRESH TOKEN
export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
    } catch {
        throw new Error("Invalid refresh token");
    }
};

// FUNCTION TO NOTIFY THE USER THROUGH PUSH NOTIFICATION
export const notify = async (role: string, payload: string) => {
    const subscription = await Subscription.findAll({
        include: [
            {
                model: User,
                as: "user",
                where: { role },
            }
        ]
    });

    for (const sub of subscription) {
        webpush.sendNotification(
            {
                endpoint: sub.endpoint,
                keys: { auth: sub.auth, p256dh: sub.p256dh }
            },
            payload
        ).catch(err => {
            console.error("Error sending notification", err);
        });
    }
}
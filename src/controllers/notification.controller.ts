import { Request, Response } from "express";
import Subscription from "../models/Subscription";

export const notification = async (req: Request, res: Response) => {
    const { user_id, endpoint, keys } = req.body;

    try {
        const [subscription, created] = await Subscription.findOrCreate({
            where: { user_id, endpoint },
            defaults: {
                p256dh: keys.p256dh,
                auth: keys.auth
            }
        });

        // If it already exists, you might want to update keys if they changed
        if (!created) {
            await subscription.update({
                p256dh: keys.p256dh,
                auth: keys.auth
            });
        }

        return res.json({ success: true, created });
    } catch (err) {
        console.error("Error saving subscription:", err);
        return res.status(500).json({ error: "server error" });
    }
}
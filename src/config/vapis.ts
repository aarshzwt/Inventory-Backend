import webpush from "web-push";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY as string;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY as string;

webpush.setVapidDetails(
    "mailto:admin@yourapp.com",
    vapidPublicKey,
    vapidPrivateKey
);

export default webpush;
require(`dotenv`).config();
const webpush = require(`web-push`);
const Subscription = require(`../app/models/subscription`);


const vapidKeys = {
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
};

webpush.setVapidDetails(
    `mailto:example@yourdomain.org`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

(async () => {
    try {
        const peremptionProducts = await Subscription.countPeremptionProductsByEndpoint();
        for(endpoint of peremptionProducts) {
            const pushSubscription = {
                endpoint: endpoint.endpoint,
                keys: {
                    auth: endpoint.keys_auth,
                    p256dh: endpoint.keys_p256dh
                }
            };
            try {
                await webpush.sendNotification(pushSubscription, JSON.stringify({ count: endpoint.count }));
            } catch (error) {
                if (error.statusCode === 404 || error.statusCode === 410) {
                    console.log('Subscription has expired or is no longer valid: ', error);
                    await Subscription.deleteSubscriptionFromDatabase(error.endpoint);
                  } else {
                    console.log(error);
                  }
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
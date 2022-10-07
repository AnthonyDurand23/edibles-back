const Subscription = require(`../models/subscription`);

const pushNotificationController = {
    subscribe: async (request, response) => {
        try {
            request.body.userId = request.payload.id;
            request.body.keysAuth = request.body.keys.auth;
            request.body.keysP256dh = request.body.keys.p256dh;
            delete request.body.keys;
            delete request.body.expirationTime;
            await new Subscription(request.body).insert();
            console.log(`Subscription created`);
            response.status(201).json(`Subscription created`);
        } catch (error) {
            console.log(error);
            response.status(500).send(error.message);
        }
    }
};

module.exports = pushNotificationController;
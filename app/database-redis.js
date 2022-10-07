const redis = require('redis');

let redisClient = {};

if(process.env.NODE_ENV === `production`) {
    redisClient = redis.createClient(process.env.REDIS_URL);
} else {
    redisClient = redis.createClient();
}

module.exports = redisClient;
const redis = require('redis');

class RedisStore {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    increment(key, windowMs) {
        return new Promise((resolve, reject) => {
            const currentTime = Date.now();
            const resetTime = Math.floor((currentTime + windowMs) / 1000); // Expire in seconds

            this.redisClient.multi()
                .incr(key) // Increment the key
                .expireat(key, resetTime) // Set an expiration time on the key
                .exec((err, replies) => {
                    if (err) return reject(err);
                    resolve(replies[0]); // Return the current count
                });
        });
    }
}

module.exports = RedisStore;

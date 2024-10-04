class RateLimiter {
    constructor(options = {}) {
        this.windowMs = options.windowMs || 60000; // default 1 minute
        this.maxRequests = options.max || 100; // default 100 requests per windowMs
        this.message = options.message || "Too many requests, please try again later.";
        this.store = options.store || new MemoryStore(); // use in-memory store by default
    }

    // Middleware function
    limit() {
        return async (req, res, next) => {
            try {
                const key = req.ip; // Default key is IP. You can change this to user ID or something else
                const requestCount = await this.store.increment(key, this.windowMs);

                if (requestCount > this.maxRequests) {
                    res.status(429).send(this.message);
                } else {
                    res.setHeader('X-RateLimit-Limit', this.maxRequests);
                    res.setHeader('X-RateLimit-Remaining', this.maxRequests - requestCount);
                    next();
                }
            } catch (err) {
                next(err);
            }
        };
    }
}

// Memory store implementation
class MemoryStore {
    constructor() {
        this.hits = {};
    }

    increment(key, windowMs) {
        return new Promise((resolve) => {
            const currentTime = Date.now();
            const resetTime = currentTime + windowMs;

            if (!this.hits[key]) {
                this.hits[key] = { count: 1, resetTime: resetTime };
                return resolve(1);
            }

            const data = this.hits[key];

            if (currentTime > data.resetTime) {
                // Reset counter if the window has passed
                this.hits[key] = { count: 1, resetTime: resetTime };
                return resolve(1);
            } else {
                this.hits[key].count++;
                return resolve(this.hits[key].count);
            }
        });
    }
}

module.exports = RateLimiter;

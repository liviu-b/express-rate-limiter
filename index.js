class RateLimiter {
    constructor(options = {}) {
        this.windowMs = options.windowMs || 60000;
        this.maxRequests = options.max || 100;
        this.message = options.message || "Too many requests, please try again later.";
        this.store = options.store || new MemoryStore();  // Update to use ESM import
    }

    limit() {
        return async (req, res, next) => {
            try {
                const key = req.ip;
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

// Use ESM export
export default RateLimiter;

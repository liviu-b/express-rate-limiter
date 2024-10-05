# Express-rate-limiter

A customizable and flexible middleware for Express.js to limit repeated requests to your API endpoints. Supports memory-based or Redis-based storage to keep track of request counts, providing a way to rate-limit clients per IP or other identifiers.

## Features
- Configurable rate limits per window (time window in milliseconds).
- Multiple storage options (in-memory or Redis).
- Customizable messages and responses when rate limits are exceeded.
- Includes headers for rate-limit status (X-RateLimit-Limit, X-RateLimit-Remaining).

## Installation

```bash
npm install express-rate-limiter
```
If you want to use Redis for storage, you’ll need to install the Redis client as well:
```bash
npm install redis
```

## Usage
### Basic Usage with In-Memory Store
Here’s how to set up the rate limiter using the default in-memory store.
```bash
import express from 'express';
import RateLimiter from 'express-rate-limiter';

const app = express();

const rateLimiter = new RateLimiter({
    windowMs: 60000,  // 1 minute window
    max: 100,  // Limit each IP to 100 requests per windowMs
});

app.use(rateLimiter.limit());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

### Using Redis for Storage
If you’re running multiple instances of your app or want to persist the rate-limit data, you can use Redis as the storage backend.

```bash
import express from 'express';
import RateLimiter from 'express-rate-limiter';
import RedisStore from 'express-rate-limiter/lib/redisStore.js';
import redis from 'redis';

// Set up Redis client
const redisClient = redis.createClient();

const rateLimiter = new RateLimiter({
    windowMs: 60000,  // 1 minute window
    max: 100,  // Limit each IP to 100 requests per windowMs
    store: new RedisStore(redisClient),  // Use Redis store
});

const app = express();

app.use(rateLimiter.limit());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

## Configuration Options
- windowMs: Duration of the rate-limiting window in milliseconds (default: 60000 ms or 1 minute).
- max: Maximum number of requests allowed per window per IP (default: 100).
- store: Storage backend to use for keeping track of request counts. By default, it uses in-memory storage, but you can use Redis by providing a RedisStore.
- message: Custom message to send when the rate limit is exceeded (default: "Too many requests, please try again later.").
- headers: If true, includes X-RateLimit-Limit and X-RateLimit-Remaining headers in responses.

## Example of Custom Response
You can customize the response message when the rate limit is exceeded.
```bash
const rateLimiter = new RateLimiter({
    windowMs: 60000,
    max: 5,
    message: 'You have exceeded the number of requests allowed. Please wait before trying again.'
});
```

## License
MIT License

This version is fully ready for publishing in plain text and uses code blocks for clarity. Let me know if you'd like any further modifications!
 

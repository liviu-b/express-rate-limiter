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
                this.hits[key] = { count: 1, resetTime: resetTime };
                return resolve(1);
            } else {
                this.hits[key].count++;
                return resolve(this.hits[key].count);
            }
        });
    }

    resetAll() {
        this.hits = {};
    }
}

// Use ESM export
export default MemoryStore;

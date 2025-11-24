require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { LRUCache } = require('lru-cache');

const app = express();
const PORT = process.env.PORT || 5000;
const NASA_URL = 'https://api.nasa.gov/planetary/apod';

// Middleware
app.use(cors());
app.use(express.json());

// Cache Configuration (Req: Max size + Expiry)
const cache = new LRUCache({
    max: 100, // Max 100 items in cache
    ttl: 1000 * 60 * 60, // 1 hour time-to-live
});

// Helper to generate cache key
const getCacheKey = (req) => `${req.query.date || 'today'}-${req.query.start_date || ''}`;

// Route: Get APOD (Single or Range)
app.get('/api/apod', async (req, res) => {
    const { date, start_date, end_date, count } = req.query;
    const cacheKey = getCacheKey(req);

    // 1. Check Cache
    if (cache.has(cacheKey)) {
        console.log('Serving from cache:', cacheKey);
        return res.json(cache.get(cacheKey));
    }

    try {
        // 2. Fetch from NASA
        const params = {
            api_key: process.env.NASA_API_KEY,
            thumbs: true, // Get video thumbnails
            ...(date && { date }),
            ...(start_date && { start_date }),
            ...(end_date && { end_date }),
            ...(count && { count }),
        };

        const response = await axios.get(NASA_URL, { params });

        // 3. Store in Cache
        cache.set(cacheKey, response.data);

        console.log('Fetched from NASA API:', cacheKey);
        res.json(response.data);
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.msg : error.message;
        res.status(status).json({ error: message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

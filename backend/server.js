require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { LRUCache } = require('lru-cache');

const app = express();
const PORT = process.env.PORT || 5000;
const NASA_URL = 'https://api.nasa.gov/planetary/apod';

app.use(cors());
app.use(express.json());

const cache = new LRUCache({
    max: 100,
    ttl: 1000 * 60 * 60,
});

const getCacheKey = (req) => `${req.query.date || 'today'}-${req.query.start_date || ''}`;

app.get('/api/apod', async (req, res) => {
    const { date, start_date, end_date, count } = req.query;
    const cacheKey = getCacheKey(req);


    if (cache.has(cacheKey)) {
        console.log('Serving from cache:', cacheKey);
        return res.json(cache.get(cacheKey));
    }

    try {
        const params = {
            api_key: process.env.NASA_API_KEY,
            thumbs: true,
            ...(date && { date }),
            ...(start_date && { start_date }),
            ...(end_date && { end_date }),
            ...(count && { count }),
        };

        const response = await axios.get(NASA_URL, { params });

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

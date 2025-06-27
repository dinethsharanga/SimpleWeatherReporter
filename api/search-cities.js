// api/search-cities.js

// This function acts as a proxy to weatherapi.com's search endpoint for city suggestions.
// It securely uses the API key stored as an environment variable in Vercel.

module.exports = async (req, res) => {
    // Set CORS headers to allow requests from frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    const { q } = req.query; // Get the search query from the URL

    // Ensure a query is provided
    if (!q) {
        return res.status(400).json({ message: 'Query parameter (q) is required.' });
    }

    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

    if (!WEATHER_API_KEY) {
        console.error('WEATHER_API_KEY environment variable is not set.');
        return res.status(500).json({ message: 'Server configuration error: API key missing.' });
    }

    const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(q)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching city suggestions:', error);
        res.status(500).json({ message: 'Failed to fetch city suggestions from external API.' });
    }
};
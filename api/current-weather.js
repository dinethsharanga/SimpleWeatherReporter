// api/current-weather.js

// This function acts as a proxy to weatherapi.com's current weather endpoint.
// It securely uses the API key stored as an environment variable in Vercel.

module.exports = async (req, res) => {
    // Set CORS headers to allow requests from frontend
    // In production, replace '*' with your specific frontend domain for better security.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests from the browser
    if (req.method === 'OPTIONS') {
        res.status(204).end(); // Respond with 204 No Content for preflight success
        return;
    }

    const { q } = req.query; // Get the city query from the URL (e.g., ?q=Colombo)

    // Ensure a city query is provided
    if (!q) {
        return res.status(400).json({ message: 'City query parameter (q) is required.' });
    }

    // Access the API key from Vercel's environment variables
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

    if (!WEATHER_API_KEY) {
        console.error('WEATHERAPI_API_KEY environment variable is not set.');
        return res.status(500).json({ message: 'Server configuration error: API key missing.' });
    }

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(q)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Pass the status code from weatherapi.com directly to the frontend
        if (!response.ok) {
            // Forward error messages from weatherapi.com
            return res.status(response.status).json(data);
        }

        // Send the successful weather data back to the client
        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ message: 'Failed to fetch weather data from external API.' });
    }
};
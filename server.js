const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const API_KEY = '0e8b68bb5b2e4923aba625b1b0b26fa5';

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch news
app.get('/api/news', async (req, res) => {
  const { country, state, language } = req.query;

  try {
    let query = state || 'India';
    let apiUrl = `https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&apiKey=${API_KEY}&language=${language}`;

    if (country) {
      apiUrl += `&country=${country}`;
    }

    // console.log(`Requesting: ${apiUrl}`);

    const response = await axios.get(apiUrl);

    // console.log(`Response:`, response.data);

    const uniqueArticles = Array.from(new Set(response.data.articles.map(a => a.title)))
      .map(title => response.data.articles.find(a => a.title === title));

    res.json({ articles: uniqueArticles });
  } catch (error) {
    console.error(`Error fetching news: ${error.message}`); // Log the error message
    res.status(500).json({ error: 'Error fetching news. Please try again later.' });
  }
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


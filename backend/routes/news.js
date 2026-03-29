const express = require("express");
const router = express.Router();
const axios = require("axios");


router.get("/", async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        

        // This searches specifically for "Economic Times" articles in India
    const url = `https://newsapi.org/v2/everything?q="Economic Times"&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
        const response = await axios.get(url);
        console.log("NewsAPI Response Status:",response.status);
        console.log("Articles Found:", response.data.articles.length);

      
        res.json({
            success: true,
            totalResults: response.data.totalResults,
            articles: response.data.articles 
        });

    } catch (error) {
        console.error("NewsAPI Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch news. Check your API key or internet connection." 
        });
    }
});

module.exports = router;
   

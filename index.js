import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const PORT = 3000;
const app = express();

const news = []; // Array to store fetched news items
const baseUrl = 'https://www.bbc.com'; // Base URL for BBC news website

// Array of news categories and their corresponding paths
const paths = [
    {
        title:"climate",
        path:"/science-environment-56837908"
    },
    {
        title:"War in Ukraine",
        path:"/world-60525350"
    },
    {
        title:"coronavirus",
        path:"/coronavirus"
    },
    {
        title:"word",
        path:"/world"
    },
    {
        title:"asia",
        path:"/asia"
    },
    {
        title:"uk",
        path:"/uk"
    },
    {
        title:"business",
        path:"/business"
    },
    {
        title:"tech",
        path:"/technology"
    },
    {
        title:"science",
        path:"/science_and_environment"
    },
    {
        title:"health",
        path:"/health"
    },

]

async function fetchNews(path = '',res ) {
    try {
        const response = await axios.get(`${baseUrl}/news${path}`);
        const html = response.data;
        const $ = cheerio.load(html);
        $('div.gs-c-promo', html).each(function () {
            // Extract relevant information from the HTML using Cheerio selectors
            const title = $(this).find('h3').text().trim();
            const summary = $(this).find('p').text().trim();
            const url = baseUrl + $(this).find('a').attr('href');
            const imageUrl = $(this).find('img').attr('src');
            const id = $(this).find('a').attr('href').split('/').pop();
            const timeStamp = $(this).find('time').attr('datetime');
            const from = $(this).find('li>a>span').text().trim();
            // Add the news item to the array
            news.push({ title, summary, url, imageUrl, id, timeStamp, from });
        });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

app.get('/', (req, res) => {
    res.json({ message: 'Hello World🌏' });
});

app.get('/news', async (req, res) => {
    // Fetch all news by calling fetchNews with an empty path
    fetchNews('',res);
});

app.get('/news/:newsId',async(req,res)=>{
    const newsId = req.params.newsId;
    const path = paths.filter((path=>path.title === newsId.toLowerCase()))[0]?.path;
    if (!path) {
        // Return 404 if the provided newsId is not found in the paths array
        res.status(404).json({message:"Not found"});
        return;
    }
    // Fetch news based on the provided newsId's path
    fetchNews(path,res);
})

app.listen(PORT, () => console.log(`Server running on 🚀 http://localhost:${PORT}`));
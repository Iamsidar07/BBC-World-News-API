import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const PORT = 3000;
const app = express();

const baseUrl = 'https://www.bbc.com';

const newspaths = [
    { title: "climate", path: "/news/science-environment-56837908" },
    { title: "War in Ukraine", path: "/news/world-60525350" },
    { title: "coronavirus", path: "/news/coronavirus" },
    { title: "world", path: "/news/world" },
    { title: "uk", path: "/news/uk" },
    { title: "business", path: "/news/business" },
    { title: "tech", path: "/news/technology" },
    { title: "science", path: "/science_and_environment" },
    { title: "health", path: "/news/health" },
    { path: "/news/world/africa", title: "africa" },
    { path: "/news/world/australia", title: "australia" },
    { path: "/news/world/europe", title: "europe" },
    { path: "/news/world/asia", title: "asia" },
    { path: "/news/world/latin_america", title: "latin america" },
    { path: "/news/world/middle_east", title: "middle east" },
    { path: "/news/world/us_and_canada", title: "us and canada" },
    { path: "/news/entertainment_and_arts", title: "entertainment and arts" },
    { path: "/news/newsbeat", title: "newsbeat" },
];



app.get('/', (req, res) => {
    res.json({ message: 'Hello World🌏' });
});

app.get('/all', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}`);
        const html = response.data;
        const $ = cheerio.load(html);
        const news = [];
        $('li.media-list__item', html).each(function () {
            const result = {
                title: $('h3', this).text().trim(),
                summary: $('p', this).text().trim(),
                url: baseUrl + $('a', this).attr('href'),
                imageUrl: $('img', this).attr('src'),
                id: $('a', this).attr('href')?.split('/').pop(),
                category: $('a.media__tag', this).text().trim(),
                timeStamp: $('time',this).attr('data-datetime')
            }
            news.push( result );
        });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.get('/news', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/news`);
        const html = response.data;
        const $ = cheerio.load(html);
        const news = [];
        $('div.gs-c-promo', html).each(function () {
            const result = {
                title: $('h3', this).text().trim(),
                summary: $('p', this).text().trim(),
                url: baseUrl + $('a', this).attr('href'),
                imageUrl: $('img', this).attr('src'),
                id: $('a', this).attr('href')?.split('/').pop(),
                category: $('a>span:first', this).text().trim(),
                timeStamp: $('time', this).attr('datetime')
            }
            news.push(result);
        });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.get('/news/:category', async (req, res) => {
    const { category } = req.params;
    const path = newspaths.filter((path) => path.title === category.toLowerCase())[0]?.path;
    if (!path) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    try {
        const response = await axios.get(`${baseUrl}${path}`);
        const html = response.data;
        const $ = cheerio.load(html);
        const news = [];
        $('div.gs-c-promo', html).each(function () {
            const result = {
                title: $('h3', this).text().trim(),
                summary: $('p', this).text().trim(),
                url: baseUrl + $('a', this).attr('href'),
                imageUrl: $('img', this).attr('src'),
                id: $('a', this).attr('href')?.split('/').pop(),
                category: $('a>span:first', this).text().trim(),
                timeStamp: $('time', this).attr('datetime')
            }
            news.push(result);
        });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.get('/sport', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/sport`);
        const html = response.data;
        const $ = cheerio.load(html);
        const news = [];
        $('div [type=article]', html).each(function () {
            const title = $('p', this).text().trim();
            const url = baseUrl + $('a', this).attr('href');
            const imageUrl = $('img', this).attr('src');
            const id = $('a', this).attr('href')?.split('/').pop();
            const timeStamp = $('span.e1y6uwnp0', this).text();
            const sport = $('span.ecn1o5v1:first', this).text().trim();
            news.push({ title, url, imageUrl, id, timeStamp, sport });
        });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.get('/sport/:sportName', async (req, res) => {
    const { sportName } = req.params;
    try {
        const response = await axios.get(`${baseUrl}/sport/${sportName}`);
        const html = response.data;
        const $ = cheerio.load(html);
        const news = [];
        $('div.gs-c-promo', html).each(function () {
            const url = baseUrl + $('a', this).attr('href');
            const title = $('h3', this).text().trim();
            const imageUrl = $('img', this).attr('src');
            const id = $('a', this).attr('href')?.split('/').pop();
            const timeStamp = $('time', this).attr('data-datetime');
            news.push({ title, url, imageUrl, id, timeStamp, category: sportName });
        });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.listen(PORT, () => console.log(`Server running on 🚀 http://localhost:${PORT}`));

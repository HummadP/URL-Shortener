const shortid = require("shortid");
const URL = require("../models/url");

async function handleNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });
    const shortID = shortid();
    await URL.create(
        {
            shortID: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id,
        }
    );
    return res.render('home', { id: shortID });
}

async function handleGetShortURL(req, res) {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate(
        { shortID },
        {
            $push:
                { visitHistory: { timestamp: Date.now() } }
        }
    );
    if (entry && entry.redirectURL) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(400).send('Invalid entry');
    }
};

async function handleGetAnalytics(req, res) {
    const shortID = req.params.shortID;
    const result = await URL.findOne({ shortID });
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
}

module.exports = {
    handleNewShortURL,
    handleGetShortURL,
    handleGetAnalytics
};
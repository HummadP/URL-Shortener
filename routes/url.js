const express = require("express");
const { handleNewShortURL, handleGetShortURL, handleGetAnalytics } = require("../controllers/url");
const router = express.Router();


router.post("/", handleNewShortURL);
router.get("/:shortID", handleGetShortURL);
router.get("/analytics/:shortID", handleGetAnalytics);

module.exports = router;
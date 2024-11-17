const express = require("express");
const app = express();
const PORT = 8000;
const path = require("path");
const cookieParser = require("cookie-parser");
const URL = require("./models/url");
const { restrictToLoggedUser, checkAuth } = require("./middleware/auth");
const noCache = require('./middleware/noCache');
const { connectMongoDB } = require("./connection");
const url = process.env.MONGO_URI;

const staticRoute = require("./routes/staticRoutes");
const urlRoute = require("./routes/url");
const userRouter = require("./routes/user");

connectMongoDB("mongodb+srv://hmmd:hummad12@cluster0.5xfpv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("main");
});

app.use("/url", restrictToLoggedUser, noCache, urlRoute);
app.use("/user", userRouter);

app.get("/home", restrictToLoggedUser, noCache, async (req, res) => {
    const allUrls = await URL.find({ createdBy: req.user._id });
    return res.render('home', { urls: allUrls });
});


app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', { urls: allUrls, });
})

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
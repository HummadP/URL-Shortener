const express = require('express');
const router = express.Router();
const { handleUserSignUp, handleUserLogin, handleLogout } = require("../controllers/user");

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post("/", handleUserSignUp);

router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post("/login", handleUserLogin);

router.get('/logout', handleLogout);

module.exports = router;
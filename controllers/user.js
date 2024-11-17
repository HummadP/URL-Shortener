const User = require("../models/user");
const { v4: uuidv4 } = require('uuid');
const { setUser } = require("../service/auth");
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;


    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        await User.create(
            {
                name,
                email,
                password: hashedPassword
            });
        return res.redirect("/");
    }
    catch (error) {
        console.error("Error during user signup:", error);
        return res.status(500).send("Internal Server Error");
    }

}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Invalid login attempt - User not found");
            return res.render('login', { error: "Invalid Username or Password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid login attempt - Incorrect password");
            return res.render("login", { error: "Invalid Username or Password" });
        }
        const token = setUser(user);
        res.cookie("uid", token);
        return res.redirect("/home");
    }
    catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).send("Internal Server Error");
    }
}

async function handleLogout(req, res) {
    res.clearCookie('uid');
    return res.redirect('/user/login');
}


module.exports = {
    handleUserSignUp,
    handleUserLogin,
    handleLogout
};
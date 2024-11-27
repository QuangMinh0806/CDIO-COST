const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
    const {token} = req.cookies;
    const users = jwt.verify(token, process.env.JWT);
    req.user = users.user;
    next();
}

module.exports = {authentication};
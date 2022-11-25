const jwt = require("jsonwebtoken");
const JWT_SECRET = "kapilkumar$123";

const loginMiddleware = (req, res, next) => {
  // get user from the jwt token and add id to req object
  const token = req.headers["auth-token"];
  // console.log(req.headers);
  // console.log(req.headers["auth-token"]);
  if (!token) {
    res.status(401).send({ error: "Please authenticate a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate a valid token" });
  }
};
module.exports = loginMiddleware;

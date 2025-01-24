const jwt = require("jsonwebtoken");
const logger = require("../config/logger.js");
const secrete = "test";

const validateToken = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "User token not found" });
    }

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, secrete, (err, decoded) => {
        if (err) {
          //console.log(err);
          logger.info(`${ip}: API /api/v1/user/getCurrent responnded with the Error: No token`);
          return res.status(401).json({ error: err, message: "User is not authorized" });
        }

        req.user = decoded.user;
        //console.log("req user", req.user);
        next();
      });

      if (!token) {
        return res.status(401).json({ message: "User is not authorized" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = validateToken;
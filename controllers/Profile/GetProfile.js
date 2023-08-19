const jwtSecret = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");


exports.GetProfile = (req, res) => {
  try {
    let token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, userData) => {
        if (err) throw err;
        res.json(userData);
      });
    } else {
      res.status(404).json("token not found");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
};

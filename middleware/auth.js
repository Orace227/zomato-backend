const auth = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, userData) => {
      if (err) throw err;
      //   console.log(userData);
      res.json(userData);
    });

    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports = auth;

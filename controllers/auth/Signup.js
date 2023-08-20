const jwtSecret = process.env.JWT_SECRET_KEY;
const User = require("../../schemas/UserSchema");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      res.json("user exist");
    }
    if (!existedUser) {
      const createdUser = await User.create({ username, email, password });
      const fetchedUser = await User.findOne({ email }).select("-password");

      jwt.sign(
        { userid: createdUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          res
            .cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              expires: new Date(Date.now() + 900000000),
            })
            .status(201)
            .json(fetchedUser);
          if (err) throw err;
        }
      );
    }
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
};

const jwtSecret = process.env.JWT_SECRET_KEY;
const User = require("../../schemas/UserSchema");

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const expirationTime = 15 * 24 * 60 * 60 * 1000;

    const checkedUser = await User.findOne({ email, password }).select(
      "-password"
    );
    if (checkedUser) {
      jwt.sign(
        { userid: checkedUser._id, username: checkedUser.username },
        jwtSecret,
        {},
        (err, token) => {
          res
            .cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              expires: new Date(Date.now() + expirationTime),
            })
            .status(201)
            .json(checkedUser);
          if (err) throw err;
        }
      );
    } else {
      res.status(404).json("user not found");
    }
  } catch (err) {
    res.json(err.message);
  }
};

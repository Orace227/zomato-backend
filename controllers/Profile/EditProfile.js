const jwtSecret = process.env.JWT_SECRET_KEY;
const User = require("../../schemas/UserSchema");
const jwt = require("jsonwebtoken");

exports.editprofile = async (req, res) => {
  try {
    const { id, username, email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      console.log("user does not exist");
      const isEdited = await User.updateOne(
        { _id: id },
        { $set: { username, email, password } }
      );

      const editedUser = await User.findOne({ email }).select("-password");

      jwt.sign(
        { userid: editedUser.id, username: editedUser.username },
        jwtSecret,
        {},
        (err, token) => {
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + expirationTime),
          });
          if (err) throw err;
        }
      );
      res.status(200).json(editedUser);
    }
    if (existedUser) {
      if (existedUser._id == id) {
        const isEdited = await User.updateOne(
          { _id: id },
          { $set: { username, email, password } }
        );

        const editedUser = await User.findOne({ email }).select("-password");

        jwt.sign(
          { userid: editedUser.id, username: editedUser.username },
          jwtSecret,
          {},
          (err, token) => {
            res.cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              expires: new Date(Date.now() + expirationTime),
            });
            if (err) throw err;
          }
        );
        res.status(200).json(editedUser);
      } else {
        res.status(409).json("user exist");
      }
    }
  } catch (err) {
    throw err;
  }
};

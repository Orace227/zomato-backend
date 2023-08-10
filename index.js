const express = require("express");
const User = require("./schemas/UserSchema");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// here all varables are defined
const port = 5000;
const jwtSecret = process.env.JWT_SECRET_KEY;

// conncted to db
try {
  const conn = mongoose.connect(process.env.MONGO_URL);
  if (conn) {
    console.log("connection is established on " + process.env.MONGO_URL);
  }
} catch (err) {
  console.log(err.message);
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true,
  })
);

app.get("/profile", (req, res) => {
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
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const createdUser = await User.create({ username, email, password });
    const fetchedUser = await User.findOne({ email, password }).select(
      "-password"
    );
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
          })
          .status(201)
          .json(fetchedUser);
        if (err) throw err;
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);

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
});

app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token").status(200).json("successfully token deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

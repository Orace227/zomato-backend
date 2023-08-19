const express = require("express");
const User = require("./schemas/UserSchema");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");

const { AddProduct } = require("./controllers/Products.js");
const connectToMongo = require("./db");

// here all varables are defined

const port = 5000;
const jwtSecret = process.env.JWT_SECRET_KEY;

// conncted to db
const db = connectToMongo();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json("api working");
});

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
});

app.post("/login", async (req, res) => {
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
});

app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token").status(200).json("successfully token deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

////////////////////// edit profile //////////////////////

app.post("/editProfile", async (req, res) => {
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
});

//////////////////////get restaurant ////////////////////////
// app.get("/fetch-swiggy-data", async (req, res) => {
//   try {
//     const { lat, lng } = req.query;
//     console.log({ lat, lng });
//     let cardsData = [];
//     const swiggyApiUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=23.0225&lng=72.5714`;
//     const headers = {
//       "Content-Type": "text/html",
//     };
//     const response = await axios.get(swiggyApiUrl, { headers });

//     for (let i = 0; i < 20; i++) {
//       cardsData.push(
//         response.data.data.cards[2].card.card.gridElements.infoWithStyle
//           ?.restaurants[i]
//       );
//     }
//     console.log(cardsData);

//     // res.json(response.data);
//   } catch (error) {
//     console.log("Error:", error);
//     // res.json(error);
//   }
// });

////////////////////// Add Products ////////////////////////

app.post("/AddProducts", AddProduct);

//////////////////////server erea ////////////////////////

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

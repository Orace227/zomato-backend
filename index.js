const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { AddProduct, GetProducts } = require("./controllers/Products.js");
const connectToMongo = require("./db");
const { signup } = require("./controllers/auth/Signup");
const { login } = require("./controllers/auth/Login");
const { logout } = require("./controllers/auth/Logout");
const { GetProfile } = require("./controllers/Profile/GetProfile");
const { editprofile } = require("./controllers/Profile/EditProfile");
const { DeleteAccount } = require("./controllers/auth/DeleteAccount.js");

// here all varables are defined

const port = 5000;

// conncted to db
const db = connectToMongo();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json("api working");
});

////////////////////// Authorization Section  //////////////////////

////////////////////// Sign up  //////////////////////

app.post("/signup", signup);

////////////////////// login  //////////////////////

app.post("/login", login);

////////////////////// log out  //////////////////////
app.get("/logout", logout);

////////////////////// delete account permantly  //////////////////////

app.post("/deleteAccount", DeleteAccount);

////////////////////// Get profile //////////////////////
app.get("/profile", GetProfile);

////////////////////// edit profile //////////////////////

app.post("/editProfile", editprofile);

////////////////////// Add Products ////////////////////////

app.post("/AddProducts", AddProduct);

////////////////////// get Products ////////////////////////

app.post("/GetProducts", GetProducts);
//////////////////////server erea ////////////////////////

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

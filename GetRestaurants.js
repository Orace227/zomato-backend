const axios = require("axios");
const { json } = require("express");

const EXTERNAL_URL =
  "https://www.swiggy.com/dapi/restaurants/list/v5?lat=23.0225&lng=72.5714&page_type=DESKTOP_WEB_LISTING";

const getRestaurants = async () => {
  let data = await fetch(EXTERNAL_URL);
  data = await data.json();
  console.log(data);
};
module.exports = getRestaurants;

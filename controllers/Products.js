const connectToMongo = require("../db");

const client = connectToMongo();
if (!client) {
  return res.status(500).json({ error: "Failed to connect to the database" });
}

const collection = client.collection("Products");

exports.AddProduct = async (req, res) => {
  try {
    const { cards } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ error: "Invalid or missing 'cards' data" });
    }

    const result = await collection.insertMany(cards);

    if (result.insertedCount > 0) {
      console.log("procduct added successfully");
      res.status(201).json({ message: "Product(s) added successfully" });
    } else {
      res.status(500).json({ error: "Failed to insert product(s)" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

exports.GetProducts = async (req, res) => {
  try {
    const Products = await collection.find({}).toArray();
    // console.log(Products);
    if (Products) {
      res.status(200).json(Products);
    } else {
      res.status(404).json("Products not found");
    }
  } catch (err) {
    console.log(err);
  }
};

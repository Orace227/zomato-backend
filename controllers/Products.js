const connectToMongo = require("../db");

exports.AddProduct = async (req, res) => {
  try {
    const client = connectToMongo();
    if (!client) {
      return res
        .status(500)
        .json({ error: "Failed to connect to the database" });
    }

    const collection = client.collection("Products");
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

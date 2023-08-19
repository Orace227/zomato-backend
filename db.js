const mongoose = require("mongoose");

// Function to establish a MongoDB connection
const connectToMongo = () => {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;

    db.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    db.once("open", () => {
      console.log("Connected to MongoDB on " + process.env.MONGO_URL);
    });

    return db;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    return null;
  }
};

module.exports = connectToMongo;

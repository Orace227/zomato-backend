const connectToMongo = require("../../db.js");
const { ObjectId } = require("mongodb");
exports.DeleteAccount = async (req, res) => {
  try {
    const client = connectToMongo();
    const { id } = await req.body;
    // console.log(id);
    if (!client) {
      return res
        .status(500)
        .json({ error: "Failed to connect to the database" });
    }

    const collection = client.collection("users");

    const deletedUser = collection.deleteOne({ _id: new ObjectId(id) });
    if (deletedUser) {
      res
        .status(200)
        .json(`Your account with user id ${id} has been deleted!!`);
    } else {
      res.status(202).json("we can't delete your account!!");
    }
  } catch (err) {
    console.log(err);
  }
};

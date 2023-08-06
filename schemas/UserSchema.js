const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      require: true,
      type: "string",
    },
    email: {
      require: true,
      type: "string",
    },
    password: {
      require: true,
      type: "string",
    },
  },
  { timestamps: true } // Include timestamps
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

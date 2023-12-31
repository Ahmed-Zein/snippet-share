const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  snippets: [
    {
      snipId: {
        type: Schema.Types.ObjectId,
        ref: "Snippet",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

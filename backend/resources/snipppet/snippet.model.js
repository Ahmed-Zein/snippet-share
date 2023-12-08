const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const snippetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

snippetSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0, 
    partialFilterExpression: { expiresAt: { $lt: new Date() } },
  }
);

module.exports = mongoose.model("Snippet", snippetSchema);


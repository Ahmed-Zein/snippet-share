const { default: mongoose } = require("mongoose");
const Snippet = require("./snippet.model");

exports.getAll = async (req, res) => {
  const userId = req.user._id;
  const snippets = await Snippet.find({ userId: userId })
    .select("title createdAt")
    .exec();
  res.send({ snippets });
};

exports.getOne = async (req, res) => {
  const snippetId = req.query.id;
  // console.log(req.query);

  try {
    const snippet = await Snippet.findOne({
      _id: snippetId,
    })
      // .select("title content createdAt")
      .exec();
    res.status(200).send({ snippet });
  } catch (e) {
    console.error(e);
    res.status(400);
  }
};

exports.addOne = async (req, res, err) => {
  // console.log(req.body);
  try {
    const snippet = await Snippet.create({
      title: req.body.title,
      content: req.body.content,
      expiresAt: new Date(Date.now() + req.body.expires * 1000),
      userId: req.user._id,
    });

    return res.send({ snippet: snippet });
  } catch (e) {
    console.error(e);
    return res.send({ message: "an error occured", error: e });
  }
};

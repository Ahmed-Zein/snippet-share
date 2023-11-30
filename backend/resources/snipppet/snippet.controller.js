const Snippet = require("./snippet.model");

exports.getAll = async (req, res) => {
  const userId = req.user._id;
  const snippets = await Snippet.find({ userId: userId }).exec();
  res.send({ snippets });
};

exports.addOne = async (req, res, err) => {
  try {
    const snippet = await Snippet.create({
      title: req.body.title,
      content: req.body.content,
      expireTime: req.body.expireTime,
      userId: req.user._id,
    });
    return res.send({ snippet: snippet });
  } catch (e) {
    console.error(e);
    return res.send({ message: "an error occured", error: e });
  }
};

const Snippet = require("../model/snippet");

exports.createSnippet = (req, res, err) => {
  const title = req.body.title;
  const content = req.body.content;
  const expireTime = req.body.expireTime;

  const snippet = new Snippet({
    title: title,
    content: content,
    expireTime: expireTime,
    // userId: req.user,
  });

  snippet
    .save()
    .then((result) => {
      return res.send({ snippet: snippet });
    })
    .catch((err) => {
      console.log(err);
      return res.send({ message: "an error occured" });
    });
};

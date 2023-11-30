exports.get404 = (res, req, err) => {
  res.status(404).send("page not found");
};

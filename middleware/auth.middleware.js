module.exports = requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  console.log("pass");
  next();
};

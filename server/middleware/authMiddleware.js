const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  const { authToken } = req.cookies;
  if (authToken) {
    const deCodedToken = await jwt.verify(authToken, process.env.JWT_SEC);
    req.myId = deCodedToken.id;
    next();
  } else {
    res.status(400).json({ error: { errorMessage: ["Please login."] } });
  }
};

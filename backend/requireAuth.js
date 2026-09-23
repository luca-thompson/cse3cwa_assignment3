const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: "No JWT found, 401 Unauthorized" })
  }

  try {
    //add token to req so next handler can see it\
    req.user_id = jwt.verify(token, process.env.JWT_SECRET).user_id
    next();
  }
  catch (err) {
    return res.status(401).json({ error: "JWT signature not valid, 401 Unauthorized" })
  }
}

module.exports = requireAuth;

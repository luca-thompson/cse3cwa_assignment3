const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: "No JWT found, Unauthorized" })
  }

  try {
    //add token to req so next handler can see it\
    req.user_id = jwt.verify(token, procss.env.JWT_SECRET).userId
    next();
  }
  catch (err) {
    return res.status(401).json({ error: "JWT signature not valid, Unauthorized" })
  }
}

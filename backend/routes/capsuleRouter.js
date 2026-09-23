const express = require('express');
const capsuleRouter = express.Router();
const requireAuth = require("../requireAuth");

capsuleRouter.get('/api/capsules', requireAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM capsules WHERE user_id = ?').get(req.user_id).all();
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = capsuleRouter;

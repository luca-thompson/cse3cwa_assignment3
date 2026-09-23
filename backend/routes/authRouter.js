const express = require('express');
const authRouter = express.Router();

router.get('/auth/github', (req, res) => {
  
  const auth_url =
    `https://github.com/login/oauth/authoriz` +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&scope=${process.env.SCOPE}` +
    `&redirect_uri=${process.env.REDIRECT_URI}`;

  res.redirect(auth_url);
});

router.get('/auth/github/callback', async (req, res) => {

  code = req.query;

  const token_params =
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `?client_secret=${process.env.GITHUB_CLIENT_SECRET}` +
    `&code=${code}` +
    `&redirect_uri=${process.env.REDIRECT_URI}`;
  
  const token_fetch = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: token_params,
  });

  const token = await token_fetch.json().access_token

  const user_fetch = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': "cse3cwa_assignment3",
      'Accept': 'application/json'
    }
  })

  const user_id = await user_fetch.json().id

  const jwt_token = jwt.sign(
    { user_id },
    process.env.JWT_SECRET,
    {} //put expiry time here if necessary
  );

  res.cookie('token', jwt_token, {
    httpOnly: true
  });
  
  return res.redirect('/dashboard')
  
});  

module.exports = authRouter;

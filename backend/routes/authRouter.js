const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken')

authRouter.get('/auth/github', (req, res) => {
  
  const auth_url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&scope=${process.env.GITHUB_SCOPE}` +
    `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}`;

  res.redirect(auth_url);
});

authRouter.get('/auth/github/callback', async (req, res) => {

  const code = req.query.code;

  console.log(req.query.code);

  const token_params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
  });
  
  const token_fetch = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: token_params.toString(),
  });

  const tokenData = await token_fetch.json();
  const token = tokenData.access_token;

  console.log(tokenData)

  const user_fetch = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': "cse3cwa_assignment3",
      'Accept': 'application/json'
    }
  })

  const user_id_data = await user_fetch.json();
  const user_id = user_id_data.id;

  console.log(user_id_data)
  
  const jwt_token = jwt.sign(
    { user_id },
    process.env.JWT_SECRET,
    {} //put expiry time here if necessary
  );

  console.log(jwt_token)

  res.cookie('token', jwt_token, {
    secure: true,
    sameSite: 'lax',
    httpOnly: true
  });
  
  return res.redirect('/dashboard')
  
});  

module.exports = authRouter;

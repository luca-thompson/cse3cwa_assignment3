const express = require('express');
const app = express();

const authRouter = require('routes/authRouter')
//const authRouter = require('routes/capsulesRouter')
// 
const port = 3000;

app.use(express.json());

app.use('/api/github/auth', authRouter)
//app.use('/api/capsules', capsulesRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

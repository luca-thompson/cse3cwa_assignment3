const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cookieParser())

const authRouter = require('./routes/authRouter')
const capsuleRouter = require('./routes/capsuleRouter')

app.use('/', authRouter)
app.use('/', capsuleRouter)

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

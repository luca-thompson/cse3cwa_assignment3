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

app.get('/api/health', (req, res) => {
  res.json({ status: "ok" })
});

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});

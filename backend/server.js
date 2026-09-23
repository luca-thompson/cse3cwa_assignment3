require('dotenv').config();

const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const path = require('path');

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

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

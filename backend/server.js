const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();


const authRouter = require('./routes/authRouter')
const capsuleRouter = require('./routes/capsuleRouter')
// 
const port = 3000;

app.use(express.json());
app.use(cookieParser())

app.use('/api/github/auth', authRouter)
app.use('/api/capsules', capsuleRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

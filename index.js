const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

const userRouter = require('./routes/users')
const authRouter = require('./routes/auth');

app.use('/users',userRouter);
app.use('/',authRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

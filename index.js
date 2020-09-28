const express = require('express');
const app = express();

app.use(express.json());

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, () => console.log('Database connection successful'));

const api = require('./routes/api');
app.use('/api', api);

app.get('/', (req, res) => res.send('Hello'));

const port = process.env.PORT || 3012;
app.listen(3000, () => console.log(`Server started at port ${port}`));
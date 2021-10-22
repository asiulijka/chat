const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

let messages = [];

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
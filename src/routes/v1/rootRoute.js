const express = require('express');

const app = express.Router();
app.get('/', async (req, res) => {
  res.send('Hello World!! SEBISLes Api is online');
});
module.exports = app;

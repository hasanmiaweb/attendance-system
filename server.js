const express = require('express')
const app = express()
const port = 3000;
const mongoose = require('mongoose');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

mongoose.connect('mongodb://127.0.0.1:27017/attendance-system')

app.listen(port, () => {
  console.log(`I am listening on port ${port}`)
})
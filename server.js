const express = require("express");
const app = express();
const port = 4000;
const routes = require('./routes')
const connectDB = require("./db");
app.use(express.json());
app.use(routes)
const authenticate = require("./middleware/authenticate");
app.get("/public", authenticate, async (req, res) => {
  return res.status(200).json("PUBLIC ROUTE");
});

app.get("/private", authenticate, async (req, res) => {
  return res.status(200).json({
    message: "WELLCOME PRIVATE ROUTER",
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Server ERROR",
  });
});

connectDB("mongodb://127.0.0.1:27017/attendance-db")
  .then(() => {
    console.log("Database Connected");
    app.listen(port, () => {
      console.log(`I am listening on port ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });

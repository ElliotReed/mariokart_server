require("dotenv/config");
const logger = require("morgan");
const express = require("express");
const fs = require("fs");
const { gameData } = require("./data/gameData");
const cors = require("cors");

const server = express();

const port = process.env.PORT || 3200;
server.set("port", port);

const corsOptions = {
  origin:
    process.env === "production"
      ? process.env.DEPLOYED_HOST
      : process.env.LOCAL_HOST,
  credentials: true,
};

server.use(logger("dev"));
server.use(cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.get("/gameData", (req, res, next) => {
  res.json(gameData);
});

server.post("/gameData", (req, res, next) => {
  const data = req.body;
  const output = `const gameData =
  ${JSON.stringify(data)}
  module.exports = { gameData };`;
  fs.writeFile("./data/gameData.js", output, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  res.send(204);
});

server.use((req, res, next) => {
  res.status = 404;
  const error = new Error(
    `The url: ${req.originalUrl} was not found on this server.`
  );
  next(error);
});

server.use((err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

require("dotenv/config");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const { gameData } = require("./data/gameData");
const { wiiScraper } = require("./scrapers/wiiScraper");
const { writeData } = require("./utils/writeData");

const server = express();

const port = process.env.PORT || 3200;
server.set("port", port);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.DEPLOYED_HOST
      : process.env.LOCAL_HOST,
  credentials: true,
};

server.use(logger("dev"));
server.use(cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static("public"));

server.get("/", (req, res, next) => {
  res.sendFile("index.html", { root: __dirname });
});

server.get("/gameData", (req, res, next) => {
  res.json(gameData);
});

server.post("/gameData", (req, res, next) => {
  const data = req.body;
  writeData(data, "gameData");
  res.sendStatus(204);
});

server.get("/getCtgp", (req, res, next) => {
  res.json({ message: "got" });
});

server.get("/getWii", (req, res, next) => {
  wiiScraper()
    .then((data) => {
      const characterData = data.characters;
      const vehicleData = data.vehicles;
      writeData(characterData, "characterData");
      writeData(vehicleData, "vehicleData");
      res.json({ message: "success" });
    })
    .catch((err) => {
      res.json(err);
    });
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

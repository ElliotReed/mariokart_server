require("dotenv/config");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const compression = require("compression");

const { jsonReader, jsonReaderSync, jsonWriter } = require("./utils/jsonUtils");
const { wiiScraper } = require("./scrapers/wiiScraper");
const { ctgpScraper } = require("./scrapers/ctgpScraper");

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
server.use(compression());

server.get("/", (req, res, next) => {
  res.sendFile("index.html", { root: __dirname });
});

server.get("/gameData", (req, res, next) => {
  jsonReader("gameData.json", (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

server.post("/gameData", (req, res, next) => {
  const data = req.body;
  jsonWriter(data, "gameData.json");
  res.sendStatus(204);
});

server.get("/supportingData", (req, res, next) => {
  const data = {};
  const wiiCupData = jsonReaderSync("wiiCupData.json");
  const wiiTrackData = jsonReaderSync("wiiTrackData.json");
  data.wiiCupData = wiiCupData;
  data.wiiTrackData = wiiTrackData;
  res.json(data);
});

server.get("/characterData", async (req, res, next) => {
  jsonReader("characterData.json", (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

server.get("/vehicleData", async (req, res, next) => {
  jsonReader("vehicleData.json", (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

server.get("/getCtgp", (req, res, next) => {
  ctgpScraper()
    .then((data) => {
      const cupData = data.cups;
      const trackData = data.tracks;
      jsonWriter(cupData, "ctgpCupData.json");
      jsonWriter(trackData, "ctgpTrackData.json");
      res
        .status(200)
        .json({ message: "Ctgp data has been scraped successfully!" });
    })
    .catch((err) => {
      res.json(err);
    });
});

server.get("/getWii", (req, res, next) => {
  wiiScraper()
    .then((data) => {
      const characterData = data.characters;
      const vehicleData = data.vehicles;
      jsonWriter(characterData, "characterData.json");
      jsonWriter(vehicleData, "vehicleData.json");
      res
        .status(200)
        .json({ message: "Wii data has been scraped successfully!" });
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

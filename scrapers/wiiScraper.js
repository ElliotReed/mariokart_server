const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { toArray } = require("lodash");

const url = "https://www.mariowiki.com/Mario_Kart_Wii";

function wiiScraper() {
  const response = rp(url)
    .then(function (html) {
      const data = {};
      data.characters = getCharacters(html);
      data.vehicles = getVehicles(html);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
  return response;
}

function getCharacters(html) {
  const characters = [];

  const $ = cheerio.load(html);

  const tables = $("table.wikitable", html);
  const characterTable = $(tables[4], tables);
  const tableRows = $("tr", characterTable);

  tableRows.each((i, row) => {
    const name = $("th", row)
      .text()
      .replace(/\r?\n|\r/g, "");

    const character = {
      id: i - 1,
      name: name,
      img: `${name.replace(/ /g, "_")}.png`,
      totalBonus: 0,
    };

    if (character.id < 9 || character.id === 25) {
      character.weightClass = "small";
    } else if (character.id < 17 || character.id === 26) {
      character.weightClass = "medium";
    } else if (character.id < 25 || character.id === 27) {
      character.weightClass = "heavy";
    }

    if (i > 1) {
      const tds = $("td", row);

      tds.each((i, td) => {
        if (i === 0) {
          const speedBonus = $(td).text().replace("-", "0");
          character.speedBonus = parseInt(speedBonus, 10);
          character.totalBonus += character.speedBonus;
        }
        if (i === 1) {
          const weightBonus = $(td).text().replace("-", "0");
          character.weightBonus = parseInt(weightBonus, 10);
          character.totalBonus += character.weightBonus;
        }
        if (i === 2) {
          const accelerationBonus = $(td).text().replace("-", "0");
          character.accelerationBonus = parseInt(accelerationBonus, 10);
          character.totalBonus += character.accelerationBonus;
        }
        if (i === 3) {
          const handlingBonus = $(td).text().replace("-", "0");
          character.handlingBonus = parseInt(handlingBonus, 10);
          character.totalBonus += character.handlingBonus;
        }
        if (i === 4) {
          const driftBonus = $(td).text().replace("-", "0");
          character.driftBonus = parseInt(driftBonus, 10);
          character.totalBonus += character.driftBonus;
        }
        if (i === 5) {
          const offroadBonus = $(td).text().replace("-", "0");
          character.offroadBonus = parseInt(offroadBonus, 10);
          character.totalBonus += character.offroadBonus;
        }
        if (i === 6) {
          const miniturboBonus = $(td).text().replace("-", "0");
          character.miniturboBonus = parseInt(miniturboBonus, 10);
          character.totalBonus += character.miniturboBonus;
        }
      });
      characters.push(character);
    }
  });
  return characters;
}

function getVehicles(html) {
  const vehicles = [];

  const $ = cheerio.load(html);

  const tables = $("table.wikitable", html);
  const vehicleTable = $(tables[6], tables);
  const tableRows = $("tr", vehicleTable).not("[style]");

  tableRows.each((i, row) => {
    if (i != 0) {
      const vehicle = {
        id: i,
        totalStats: 0,
      };

      if (vehicle.id < 13) {
        vehicle.weightClass = "small";
        if (vehicle.id < 7) {
          vehicle.type = "kart";
        } else {
          vehicle.type = "bike";
        }
      } else if (vehicle.id < 25) {
        vehicle.weightClass = "medium";
        if (vehicle.id < 19) {
          vehicle.type = "kart";
        } else {
          vehicle.type = "bike";
        }
      } else {
        vehicle.weightClass = "heavy";
        if (vehicle.id < 31) {
          vehicle.type = "kart";
        } else {
          vehicle.type = "bike";
        }
      }

      const tds = $("td", row);

      tds.each((i, td) => {
        if (i === 0) {
          const name = $("b > a", td).text();
          vehicle.name = name;
          vehicle.img = `${name.replace(/ /g, "_")}.png`;
        }

        if (i === 1) {
          const speed = $(td).text();
          vehicle.speed = parseInt(speed, 10);
          vehicle.totalStats += vehicle.speed;
        }

        if (i === 2) {
          const weight = $(td).text();
          vehicle.weight = parseInt(weight, 10);
          vehicle.totalStats += vehicle.weight;
        }

        if (i === 3) {
          const acceleration = $(td).text();
          vehicle.acceleration = parseInt(acceleration, 10);
          vehicle.totalStats += vehicle.acceleration;
        }

        if (i === 4) {
          const handling = $(td).text();
          vehicle.handling = parseInt(handling, 10);
          vehicle.totalStats += vehicle.handling;
        }

        if (i === 5) {
          const drift = $(td).text();
          vehicle.drift = parseInt(drift, 10);
          vehicle.totalStats += vehicle.drift;
        }

        if (i === 6) {
          const offroad = $(td).text();
          vehicle.offroad = parseInt(offroad, 10);
          vehicle.totalStats += vehicle.offroad;
        }

        if (i === 7) {
          const miniturbo = $(td).text();
          vehicle.miniturbo = parseInt(miniturbo, 10);
          vehicle.totalStats += vehicle.miniturbo;
        }
      });
      vehicles.push(vehicle);
    }
  });
  return vehicles;
}

module.exports = { wiiScraper };

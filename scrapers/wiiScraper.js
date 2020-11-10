const rp = require("request-promise");
const cheerio = require("cheerio");

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
      bonus: {
        total: 0,
      },
    };

    if (character.id < 9 || character.id === 25) {
      character.class = "small";
    } else if (character.id < 17 || character.id === 26) {
      character.class = "medium";
    } else if (character.id < 25 || character.id === 27) {
      character.class = "heavy";
    }

    if (i > 1) {
      const tds = $("td", row);

      tds.each((i, td) => {
        if (i === 0) {
          const speedBonus = $(td).text().replace("-", "0");
          character.bonus.speed = parseInt(speedBonus, 10);
          character.bonus.total += character.bonus.speed;
        }
        if (i === 1) {
          const weightBonus = $(td).text().replace("-", "0");
          character.bonus.weight = parseInt(weightBonus, 10);
          character.bonus.total += character.bonus.weight;
        }
        if (i === 2) {
          const accelerationBonus = $(td).text().replace("-", "0");
          character.bonus.acceleration = parseInt(accelerationBonus, 10);
          character.bonus.total += character.bonus.acceleration;
        }
        if (i === 3) {
          const handlingBonus = $(td).text().replace("-", "0");
          character.bonus.handling = parseInt(handlingBonus, 10);
          character.bonus.total += character.bonus.handling;
        }
        if (i === 4) {
          const driftBonus = $(td).text().replace("-", "0");
          character.bonus.drift = parseInt(driftBonus, 10);
          character.bonus.total += character.bonus.drift;
        }
        if (i === 5) {
          const offroadBonus = $(td).text().replace("-", "0");
          character.bonus.offroad = parseInt(offroadBonus, 10);
          character.bonus.total += character.bonus.offroad;
        }
        if (i === 6) {
          const miniturboBonus = $(td).text().replace("-", "0");
          character.bonus.miniturbo = parseInt(miniturboBonus, 10);
          character.bonus.total += character.bonus.miniturbo;
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
        stats: {
          total: 0,
        },
      };

      if (vehicle.id < 13) {
        vehicle.class = "small";
        if (vehicle.id < 7) {
          vehicle.type = "kart";
        } else {
          vehicle.type = "bike";
        }
      } else if (vehicle.id < 25) {
        vehicle.class = "medium";
        if (vehicle.id < 19) {
          vehicle.type = "kart";
        } else {
          vehicle.type = "bike";
        }
      } else {
        vehicle.class = "heavy";
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
          vehicle.stats.speed = parseInt(speed, 10);
          vehicle.stats.total += vehicle.stats.speed;
        }

        if (i === 2) {
          const weight = $(td).text();
          vehicle.stats.weight = parseInt(weight, 10);
          vehicle.stats.total += vehicle.stats.weight;
        }

        if (i === 3) {
          const acceleration = $(td).text();
          vehicle.stats.acceleration = parseInt(acceleration, 10);
          vehicle.stats.total += vehicle.stats.acceleration;
        }

        if (i === 4) {
          const handling = $(td).text();
          vehicle.stats.handling = parseInt(handling, 10);
          vehicle.stats.total += vehicle.stats.handling;
        }

        if (i === 5) {
          const drift = $(td).text();
          vehicle.stats.drift = parseInt(drift, 10);
          vehicle.stats.total += vehicle.stats.drift;
        }

        if (i === 6) {
          const offroad = $(td).text();
          vehicle.stats.offroad = parseInt(offroad, 10);
          vehicle.stats.total += vehicle.stats.offroad;
        }

        if (i === 7) {
          const miniturbo = $(td).text();
          vehicle.stats.miniturbo = parseInt(miniturbo, 10);
          vehicle.stats.total += vehicle.stats.miniturbo;
        }
      });
      vehicles.push(vehicle);
    }
  });
  return vehicles;
}

module.exports = { wiiScraper };

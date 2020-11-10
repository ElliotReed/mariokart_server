const rp = require("request-promise");
const cheerio = require("cheerio");

const url = "http://wiki.tockdom.com/wiki/CTGP_Revolution";

function ctgpScraper() {
  const response = rp(url)
    .then(function (html) {
      const data = getData(html);
      return data;
    })
    .catch(function (err) {
      console.log(err);
    });
  return response;
}

let currentCup = 0;
let currentTrack = 1;

function getData(html) {
  const data = {
    cups: [],
    tracks: [],
  };

  const $ = cheerio.load(html);

  const tables = $("table.sortable", html);
  const trackTable = (tables[0], tables);
  const tableRows = $("tr", trackTable);
  tableRows.each((i, row) => {
    // eliminate header row [0]
    if (i != 0) {
      let startIndex = 0; // row may have first element cup
      const tds = $("td", row);

      if ($(tds[0]).attr("rowspan") != null) {
        const cupname = $(tds[0]).text();
        const cup = addCup(cupname);
        data.cups.push(cup);
        startIndex = 1; // first td is cup
      }
      const trackTitle = $("a", tds[startIndex]).text();
      const track = addTrack(trackTitle);
      data.tracks.push(track);
      data.cups[currentCup - 1].tracks.default.push(track.id);

      // Other information for later user
      // const trackVersion = $(tds[startIndex + 1]).text();
      // const numberOfLaps = 0;
      // const authors = "";
    }
  });

  return data;
}

function addCup(cupname) {
  const title = cupname.trim();
  currentCup++;
  const cup = {
    id: currentCup,
    title: title,
    img: `CTGP_Revolution_${title.replace(/ /g, "_")}.png`,
    tracks: {
      default: [],
    },
  };
  return cup;
}

function addTrack(trackTitle) {
  const track = {
    id: currentTrack,
    title: trackTitle,
  };
  // if (track.title.length > 50) {
  //   return;
  // }
  currentTrack++;
  return track;
}

module.exports = { ctgpScraper };

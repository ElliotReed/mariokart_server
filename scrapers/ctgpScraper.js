const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "http://wiki.tockdom.com/wiki/CTGP_Revolution";

const cups = [];
const tracks = [];
let currentCup = 0;
let currentTrack = 1;

rp(url)
  .then(function (html) {
    scrape(html);
  })
  .catch(function (err) {
    console.log(err);
  });

function scrape(html) {
  const $ = cheerio.load(html);
  const trackTables = $("table.sortable", html);
  const trackTable = trackTables[0];
  const trackTableBody = $("tbody", trackTable);
  const rows = $("tr", trackTableBody);

  rows.toArray().forEach((row) => {
    let startIndex = 0;
    const tdArray = $("td", row).toArray();

    if ($(tdArray[startIndex]).attr("rowspan") != null) {
      const cupname = $(tdArray[startIndex]).text();
      addCup(cupname);
      startIndex = 1;
    }

    const trackTitle = $("a", tdArray[startIndex]).text();
    // console.log("trackTitle: ", trackTitle);

    const trackVersion = $(tdArray[startIndex + 1]).text();
    // console.log("trackVersion: ", trackVersion);

    const numberOfLaps = 0;
    const authors = "";

    addTrack(trackTitle);
  });

  createCupsFile();
  createTracksFile();
}

function addCup(cupname) {
  currentCup++;
  const title = cupname.trim();
  const cup = {
    id: currentCup,
    title: title,
    img: `assets/img/CTGP_Revolution_${title.replace(/ /g, "_")}.png`,
    defaultTracks: [],
    myTracks: [],
  };
  cups.push(cup);
}

function addTrack(trackTitle) {
  const track = {
    id: currentTrack,
    title: trackTitle,
  };
  if (track.title.length > 50) {
    return;
  }
  tracks.push(track);
  currentTrack++;

  cups[currentCup - 1].defaultTracks.push(track.id);
}

function createCupsFile() {
  const output = `const cupData =
    ${JSON.stringify(cups)}
    export { cupData }`;
  fs.writeFile("cupData.js", output, function (err) {
    if (err) throw err;
    console.log("cupData has been saved");
  });
}

function createTracksFile() {
  const output = `const trackData =
  ${JSON.stringify(tracks)}
  export { trackData }`;

  fs.writeFile("trackData.js", output, function (err) {
    if (err) throw err;
    console.log("trackData has been saved");
  });
}

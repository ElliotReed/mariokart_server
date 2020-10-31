const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { toArray } = require("lodash");

const url = "https://www.mariowiki.com/Mario_Kart_Wii";

const drivers = [];

function wiiScraper() {
  rp(url)
    .then(function (html) {
      parsePage(html);
    })
    .catch((err) => {
      console.error(err);
    });
}

function parsePage(html) {
  const $ = cheerio.load(html);
  const tables = $("table.wikitable", html);
  const h1El = $("h1");
  const parentEl = h1El.parent();
  console.log("parentEl: ", parentEl.get().tagname);
  // 0 point spread comaprisons
  // 1  startingDrivers
  const startingDrivers = $(tables[1], tables);
  const startingDriversRows = $("tr", startingDrivers);
  startingDriversRows.each((row) => {
    if (row > 0) {
      const tds = $("td", row);
      // console.log("tds.length: ", tds.length);
    }
    // $(tds).each((td) => {
    //   // const characterNname = $("td", td[1]).text();
    //   console.log("td.text(): ", $(td).text());
    // });
    console.log("row: ", row);
  });
  console.log("startingDriversRows.length: ", startingDriversRows.length);
}

module.exports = { wiiScraper };

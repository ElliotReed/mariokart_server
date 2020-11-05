const fs = require("fs");

function writeData(data, filename) {
  const output = JSON.stringify(data);

  fs.writeFile(`./data/${filename}`, output, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}

module.exports = { writeData };

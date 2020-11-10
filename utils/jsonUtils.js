const fs = require("fs");

function jsonReaderSync(fileName) {
  const rawdata = fs.readFileSync(__dirname + `/../data/${fileName}`);
  const data = JSON.parse(rawdata);
  return data;
}

function jsonReader(fileName, cb) {
  fs.readFile(__dirname + `/../data/${fileName}`, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}

function jsonWriter(data, fileName) {
  const output = JSON.stringify(data, null, 2);

  fs.writeFile(__dirname + `/../data/${fileName}`, output, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}

module.exports = { jsonReader, jsonReaderSync, jsonWriter };

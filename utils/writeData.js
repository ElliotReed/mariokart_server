const fs = require("fs");

function writeData(data, filename) {
  const output = `const ${filename} =
${JSON.stringify(data)}
module.exports = { ${filename} };`;
  fs.writeFile(`./data/${filename}.js`, output, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
    return true;
  });
}
module.exports = { writeData };

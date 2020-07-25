const fs = require("fs");

let all = [];

let fileList = fs.readdirSync("./translation-sheet-data");
fileList = fileList.filter(RegExp.prototype.test, /.*\.json$/);

for (let i = 0; i < fileList.length; i++) {
  const content = fs.readFileSync(
    `translation-sheet-data/${fileList[i]}`,
    "utf8"
  );
  all = all.concat(JSON.parse(content));
}

all.forEach(translate => {
  delete translate["version"];
  delete translate.locale["EUen"];
  delete translate.locale["EUde"];
  delete translate.locale["EUes"];
  delete translate.locale["USes"];
  delete translate.locale["USfr"];
  delete translate.locale["USfr"];
  delete translate.locale["EUfr"];
  delete translate.locale["EUit"];
  delete translate.locale["EUnl"];
  delete translate.locale["CNzh"];
  delete translate.locale["TWzh"];
  delete translate.locale["KRko"];
  delete translate.locale["EUru"];
});

fs.writeFileSync("./script/translate-all.json", JSON.stringify(all));

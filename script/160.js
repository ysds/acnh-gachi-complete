const fs = require("fs");

// Load Json

let content = JSON.parse(
  fs.readFileSync("./json/item-data/items.json", "utf8")
);

content = content.concat(
  JSON.parse(fs.readFileSync("./json/item-data/recipes.json", "utf8"))
);

content = content.concat(
  JSON.parse(fs.readFileSync("./json/item-data/creatures.json", "utf8"))
);

// Each items
content.forEach(item => {
  if (item.versionAdded === "1.6.0") {
    console.log(item.name);
  }
});

const fs = require("fs");

// Load Json

const allItems = JSON.parse(fs.readFileSync("./src/assets/items.json", "utf8"));
const moduDiy = JSON.parse(fs.readFileSync("./data/modu/diy.json", "utf8"));
const moduHousewares = JSON.parse(
  fs.readFileSync("./data/modu/housewares.json", "utf8")
);
const moduMiscellaneous = JSON.parse(
  fs.readFileSync("./data/modu/miscellaneous.json", "utf8")
);
const moduWallmounted = JSON.parse(
  fs.readFileSync("./data/modu/wallmounted.json", "utf8")
);

// DIY

let diyMap = [];

moduDiy.forEach(moduItem => {
  const map = allItems.filter(item => {
    return item.sourceSheet === "Recipes" && moduItem === item.displayName;
  });
  if (map.length === 0) {
    console.log(moduItem);
  } else {
    diyMap.push(map[0].uniqueEntryId);
  }
});

diyMap = JSON.stringify(diyMap, null, 2);
fs.writeFileSync("./src/assets/modu-diy.json", diyMap);

// FTR

const genFTRMap = function(list, filename) {
  let result = [];
  list.forEach(moduItemOriginal => {
    const moduItem = moduItemOriginal.replace(/\(.*/g, "");
    const moduVariant = (str => {
      const match = str.match(/\((.*)\)/g);
      return match ? match[0].replace(/[()]/g, "") : match;
    })(moduItemOriginal);

    let map;
    let variantIndex = 0;

    allItems.forEach(item => {
      if (!map) {
        if (moduItem !== item.displayName) {
          map = null;
        } else if (item.variants.length === 1) {
          map = item;
        } else {
          const variant = item.variants.filter((variant, index) => {
            if (moduVariant === variant.variationDisplayName) {
              variantIndex = index;
              return true;
            }
            return false;
          });
          if (variant.length === 1) {
            map = item;
          } else {
            map = null;
          }
        }
      }
    });
    if (!map) {
      console.log(`${moduItem}:${moduVariant}`);
    } else {
      result.push(`${map.name}_${variantIndex}`);
    }
  });

  result = JSON.stringify(result, null, 2);
  fs.writeFileSync(`./src/assets/${filename}.json`, result);
};

genFTRMap(moduHousewares, "modu-housewares");
genFTRMap(moduMiscellaneous, "modu-miscellaneous");
genFTRMap(moduWallmounted, "modu-wallmounted");

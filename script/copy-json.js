const fs = require("fs");

let content = JSON.parse(
  fs.readFileSync("./node_modules/@nooksbazaar/acdb/out/items.json", "utf8")
);

content = content.concat(
  JSON.parse(
    fs.readFileSync("./node_modules/@nooksbazaar/acdb/out/recipes.json", "utf8")
  )
);

const allTranslations = JSON.parse(
  fs.readFileSync(`./script/translate-all.json`, "utf8")
);

content.forEach(item => {
  // Remove pattern variant
  if (item.variants) {
    let prevVariation = "";
    const newVariants = item.variants.filter(variant => {
      let result = prevVariation !== variant.variation;
      prevVariation = variant.variation;
      return result;
    });
    item.variants = newVariants;
  }

  // Remove photo variant
  if (item.sourceSheet === "Photos") {
    item.variants = item.variants.slice(0, 1);
  }

  // Add displayName
  const translateObj = allTranslations.filter(obj => {
    return obj.locale.USen.toLowerCase() === item.name.toLowerCase();
  });
  if (translateObj.length) {
    item.displayName = translateObj[0].locale.JPja;
  } else {
    item.displayName = item.name;
  }
});

//
// Sort items
//

// localeCompare
content.sort(function(a, b) {
  return a.displayName.localeCompare(b.displayName);
});
// アルファベットを日本語の後ろに
content.sort(function(a, b) {
  const isAlfabetA = a.displayName.slice(0, 1).match(/[^a-zA-Z]/gi);
  const isAlfabetB = b.displayName.slice(0, 1).match(/[^a-zA-Z]/gi);
  if (!isAlfabetA && isAlfabetB) {
    return 1;
  }
  if (isAlfabetA && !isAlfabetB) {
    return -1;
  }
  return 0;
});

// Write file
fs.writeFileSync("./src/assets/items.json", JSON.stringify(content));

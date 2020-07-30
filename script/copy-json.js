const fs = require("fs");

let content = JSON.parse(
  // fs.readFileSync("./node_modules/@nooksbazaar/acdb/out/items.json", "utf8")
  fs.readFileSync("./json/item-data/items.json", "utf8")
);

content = content.concat(
  JSON.parse(
    // fs.readFileSync("./node_modules/@nooksbazaar/acdb/out/recipes.json", "utf8")
    fs.readFileSync("./json/item-data/recipes.json", "utf8")
  )
);

const allTranslations = JSON.parse(
  fs.readFileSync(`./script/translate-all.json`, "utf8")
);

content = content.filter(item => {
  let result = true;
  // Remove others
  if (item.sourceSheet === "Other") result = false;
  return result;
});

// Each items
content.forEach(item => {
  // Remove photo variant
  if (item.sourceSheet === "Photos") {
    item.variants = item.variants.slice(0, 1);
  }

  if (item.variants) {
    // Remove pattern variant
    let prevVariation = "";
    let newVariants = item.variants.filter(variant => {
      const result = prevVariation !== variant.variation;
      prevVariation = variant.variation;
      return result;
    });
    item.variants = newVariants;

    // Remove remake variant
    let prevBodyCustomize = false;
    newVariants = item.variants.filter(variant => {
      if (variant.bodyCustomize) {
        const result = prevBodyCustomize !== variant.bodyCustomize;
        prevBodyCustomize = true;
        return result;
      } else {
        prevBodyCustomize = false;
        return true;
      }
    });
    item.variants = newVariants;

    // Add variants displayName (furniture)
    let translateObjects = allTranslations.filter(obj => {
      if (obj.furniture_name) {
        return obj.furniture_name.toLowerCase() === item.name.toLowerCase();
      }
      return false;
    });

    if (translateObjects.length > 0) {
      item.variants.forEach((variant, index) => {
        if (variant.variation && typeof variant.variation === "string") {
          if (!translateObjects[index]) console.log(item.name);
          item.variants[index].variationDisplayName =
            translateObjects[index].locale.JPja;
        }
      });
    }
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

  if (item.displayName === "uchiwa fan") item.displayName = "うちわ";
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

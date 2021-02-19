const fs = require("fs");
const { array_move, numberWithCommas } = require("./utils.js");
const { convertForSorting, sortItemsByName } = require("./sort.js");

//
// Load Json
//

let allItems = [].concat(
  require("../data/item-data/items.json"),
  require("../data/item-data/recipes.json"),
  require("../data/item-data/creatures.json"),
  require("../data/item-data/reactions.json"),
  require("../data/item-data/achievements.json")
);

const translation = {
  itemName: require("../data/translation-json/item-name.json"),
  variantBody: require("../data/translation-json/variant-body.json"),
  variantBodyTitle: require("../data/translation-json/variant-body-title.json"),
  variantPattern: require("../data/translation-json/variant-pattern.json"),
  variantPatternTitle: require("../data/translation-json/variant-pattern-title.json"),
  variantFassion: require("../data/translation-json/variant-fassion.json"),
  reaction: require("../data/translation-json/reaction.json"),
  achievements: require("../data/translation-json/achievements.json"),
  source: require("../data/translation-custom/source.json"),
  sourceNotes: require("../data/translation-custom/sourceNotes.json"),
  seasonEvent: require("../data/translation-custom/seasonEvent.json"),
  shadow: require("../data/translation-custom/shadow.json"),
  whereHow: require("../data/translation-custom/whereHow.json"),
  weather: require("../data/translation-custom/weather.json"),
  fixData: require("../data/translation-custom/fix.json")
};

const removeTranslation = JSON.parse(JSON.stringify(translation));
const newTranslation = JSON.parse(JSON.stringify(translation));
const customTranslations = [
  "sourceNotes",
  "seasonEvent",
  "shadow",
  "whereHow",
  "weather"
];

const customAchievementData = require("../data/item-data-custom/achievements.json");

//
// items データ生成
//

allItems.forEach(item => {
  //
  // リメイクバリエーションの整理
  //

  // Tools の 日本語リメイク名配列を追加とリメイクバリエーションの削除 (customizeVariants)
  if (item.customize && item.sourceSheet === "Tools") {
    const customizeVariants = [];
    item.variants.forEach(variant => {
      const variantIdArray = variant.variantId.slice("_");
      const variantId = `${variant.internalId}_${variantIdArray[0]}`;
      customizeVariants.push(
        translation.variantBody[variantId] || variant.variation
      );
      if (!translation.variantBody[variantId]) {
        console.log(`NoCustomizeVariant: ${item.name} : ${variant.variation}`);
      }
    });
    item.customizeVariants = customizeVariants;
    item.bodyTitle = translation.variantBodyTitle[item.variants[0].internalId];
    if (!translation.variantBodyTitle[item.variants[0].internalId]) {
      console.log(`NoCustomizeVariantTitle: ${item.name}`);
    }
    item.variants.length = 1;
  }

  // Photos の 日本語リメイク名配列を追加とリメイクバリエーションの削除 (customizeVariants)
  if (item.sourceSheet === "Photos") {
    // しゃしんはinternalIdの最小値6426(さくらじま)しか翻訳データが無い
    const photoInternalId = "6426";
    const customizeVariants = [];
    for (let i = 0; i < item.variants.length; i++) {
      customizeVariants.push(
        translation.variantBody[photoInternalId + "_" + i]
      );
    }
    item.customizeVariants = customizeVariants;
    item.bodyTitle = translation.variantBodyTitle[photoInternalId];
    item.variants.length = 1;
  }

  // 家具の日本語リメイク名配列を追加とリメイクバリエーションの削除 (patternVariants)
  if (item.variants && item.patternCustomize) {
    let prevVariation = "";
    let newVariants = item.variants.filter(variant => {
      const result = prevVariation !== variant.variation;
      prevVariation = variant.variation;
      return result;
    });
    item.patternVariants =
      translation.variantPattern[item.variants[0].internalId];
    if (!translation.variantPattern[item.variants[0].internalId]) {
      console.log(`NoPatternVariant: ${item.name}`);
    }
    item.patternTitle =
      translation.variantPatternTitle[item.variants[0].internalId];
    if (!translation.variantPatternTitle[item.variants[0].internalId]) {
      console.log(`NoPatternVariantTitle: ${item.name}`);
    }
    item.variants = newVariants;
  }

  // 家具の日本語リメイク名配列を追加とリメイクバリエーションの削除 (bodyVariants)
  if (item.variants && item.variants[0].bodyCustomize) {
    const bodyVariants = [];
    item.variants.forEach(variant => {
      const variantIdArray = variant.variantId.slice("_");
      const variantId = `${variant.internalId}_${variantIdArray[0]}`;
      bodyVariants.push(
        translation.variantBody[variantId] || variant.variation
      );
      if (!translation.variantBody[variantId]) {
        console.log(`NoBodyVariant: ${item.name} : ${variant.variation}`);
      }
    });
    item.bodyVariants = bodyVariants;
    item.bodyTitle = translation.variantBodyTitle[item.variants[0].internalId];
    if (!translation.variantBodyTitle[item.variants[0].internalId]) {
      console.log(`NoBodyVariantTitle: ${item.name}`);
    }
    item.bodyCustomize = true;
    if (item.diy || item.catalog === "For sale" || item.catalog === true) {
      item.variants.length = 1;
    }
  }

  //
  // たぬきマイレージデータ生成
  //

  if (item.sourceSheet === "Achievements") {
    // description
    item.achievementDescription =
      translation.achievements[item.internalId].desc;

    // よみがな
    item.yomigana = translation.achievements[item.internalId].yomi;

    // parseInt num
    item.num = parseInt(item.num, 10);

    // Marge custom data
    const customData = customAchievementData[item.internalId];
    item = Object.assign(item, customData);
    if (!customData) {
      console.log(`NoCustomAchievements: ${item.name}`);
    }

    // Gen variants
    delete item["uniqueEntryId"];
    item.variants = [];
    const numOfTiers = parseInt(item.numOfTiers, 10);
    for (let i = 1; i <= numOfTiers; i++) {
      const variant = {};
      variant.vName = numberWithCommas(item[`tier${i}`]);
      variant.stampImage = item[`tier${i}Icon`];
      variant.uniqueEntryId = i;
      item.variants.push(variant);
    }
  }

  //
  // データ整理
  //

  // Version fix
  if (item.name.match(/midwinter sweater|sunflower crown/g)) {
    item.versionAdded = "1.6.0";
  }

  // 重複データの共通データ化
  if (item.variants) {
    const copyKeys = ["source", "buy", "sell"];
    const variant = item.variants[0];
    copyKeys.forEach(key => {
      if (variant[key]) {
        item[key] = variant[key];
      }
    });
  }

  // 未使用の variant の uniqueEntryId を単純化（ファイルサイズ削減のため）
  // v-for の key のために index を付与
  if (item.variants) {
    item.variants.forEach((variant, index) => {
      if (variant.uniqueEntryId) {
        item.variants[index].uniqueEntryId = index;
      }
    });
  }

  //
  // 翻訳
  //

  // Add displayName
  let itemName;
  if (item.sourceSheet === "Recipes") {
    const items = allItems.filter(craftedItem => {
      return craftedItem.name === item.name;
    });
    itemName = items[0].displayName;
  } else if (item.sourceSheet === "Reactions") {
    itemName = translation.reaction[item.iconFilename];
  } else if (item.sourceSheet === "Achievements") {
    itemName = translation.achievements[item.internalId].name;
  } else if (item.clothGroupId) {
    itemName = translation.itemName[`Fassion_${item.clothGroupId}`];
  } else if (item.variants) {
    itemName = translation.itemName[item.variants[0].internalId];
  } else {
    itemName = translation.itemName[item.internalId];
  }
  if (translation.fixData[item.name]) {
    itemName = translation.fixData[item.name];
  }
  if (itemName) {
    item.displayName = itemName;
  } else {
    item.displayName = item.name;
    console.log(`NoName: ${item.name}`);
  }

  // Source
  if (item.source) {
    item.sourceJa = [];
    item.source.forEach(source => {
      if (source !== "" && translation.source[source] === undefined) {
        newTranslation.source[source] = "";
      } else {
        item.sourceJa.push(translation.source[source]);
        delete removeTranslation.source[source];
      }
    });
  }

  // customTranslations
  customTranslations.forEach(key => {
    const value = item[key];
    if (value) {
      const ja = translation[key][value];
      if (ja !== undefined) {
        if (ja !== "") {
          item[`${key}Ja`] = ja;
        }
        delete removeTranslation[key][value];
      } else {
        item[`${key}Ja`] = value;
        newTranslation[key][value] = "";
      }
    }
  });

  // Add variation displayName
  if (item.clothGroupId && item.variants.length > 1) {
    item.variants.forEach((variant, index) => {
      if (variant.internalId) {
        const internalId = variant.internalId;
        item.variants[index].vName =
          translation.variantFassion[internalId] || variant.variation;

        if (!translation.variantFassion[internalId]) {
          console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
        }
      } else {
        console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
      }
    });
  } else if (item.variants && item.variants.length > 1) {
    item.variants.forEach((variant, index) => {
      if (variant.variantId) {
        const variantIdArray = variant.variantId.slice("_");
        const variantId = `${variant.internalId}_${variantIdArray[0]}`;
        item.variants[index].vName =
          translation.variantBody[variantId] || variant.variation;

        if (!translation.variantBody[variantId]) {
          console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
        }
      } else if (
        variant.genuine === undefined &&
        item.displayName !== "おとしもの" &&
        item.displayName !== "なんだっけ？" &&
        item.sourceSheet !== "Achievements"
      ) {
        console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
      }
    });
  }

  // 本物/偽物
  if (item.variants) {
    item.variants.forEach((variant, i) => {
      if (variant.genuine === true) item.variants[i].genuine = "本物";
      if (variant.genuine === false) item.variants[i].genuine = "偽物";
    });
  }

  //
  // Remove keys
  //

  // false and null keys
  Object.keys(item).forEach(key => {
    if (item[key] === false || item[key] === null) {
      delete item[key];
    }
  });

  // Unused
  delete item["achievementCriteria"];
  delete item["cardColor"];
  delete item["catchDifficulty"];
  delete item["catchPhrase"];
  delete item["ceilingType"];
  delete item["clothGroupId"];
  delete item["colors"];
  delete item["craftedItemInternalId"];
  delete item["critterpediaFilename"];
  delete item["critterpediaImage"];
  delete item["curtainColor"];
  delete item["curtainType"];
  delete item["customizationKitCost"];
  delete item["description"];
  delete item["diyIconFilename"];
  delete item["doorDeco"];
  delete item["exchangeCurrency"];
  delete item["fossilGroup"];
  delete item["furnitureFilename"];
  delete item["furnitureImage"];
  delete item["gender"];
  delete item["hhaBasePoints"];
  delete item["hhaCategory"];
  delete item["iconFilename"];
  delete item["interact"];
  delete item["internalCategory"];
  delete item["internalId"];
  delete item["internalName"];
  delete item["kitType"];
  delete item["LandMaking"];
  delete item["lightingType"];
  delete item["mannequinPiece"];
  delete item["mannequinSeason"];
  delete item["materials"];
  delete item["milesPrice"];
  delete item["movementSpeed"];
  delete item["museum"];
  delete item["numOfTiers"];
  delete item["outdoor"];
  delete item["paneType"];
  delete item["primaryShape"];
  delete item["recipesToUnlock"];
  delete item["seasonalAvailability"];
  delete item["seasonality"];
  delete item["seasonEventExclusive"];
  delete item["secondaryShape"];
  delete item["sequential"];
  delete item["serialId"];
  delete item["series"];
  delete item["set"];
  delete item["size"];
  delete item["sizeCategory"];
  delete item["sortOrder"];
  delete item["sourceNotes"];
  delete item["spawnRates"];
  delete item["speakerType"];
  delete item["specialSell"];
  delete item["stackSize"];
  delete item["style"];
  delete item["style1"];
  delete item["style2"];
  delete item["surface"];
  delete item["tag"];
  delete item["totalCatchesToUnlock"];
  delete item["unlocked"];
  delete item["unlockNotes"];
  delete item["uses"];
  delete item["versionUnlocked"];
  delete item["vfx"];
  delete item["vfxType"];
  delete item["villagerEquippable"];
  delete item["villagerGender"];
  delete item["vision"];
  delete item["windowColor"];
  delete item["windowType"];

  for (let i = 1; i < 7; i++) {
    delete item[`tier${i}`];
    delete item[`tier${i}Reward`];
    delete item[`tier${i}Modifier`];
    delete item[`tier${i}Noun`];
    delete item[`tier${i}Icon`];
  }

  if (item.variants) {
    item.variants.forEach(variant => {
      delete variant["bodyCustomize"];
      delete variant["bodyTitle"];
      delete variant["buy"];
      delete variant["closetImage"];
      delete variant["colors"];
      delete variant["filename"];
      delete variant["framedImage"];
      delete variant["internalId"];
      delete variant["labelThemes"];
      delete variant["pattern"];
      delete variant["sell"];
      delete variant["source"];
      delete variant["themes"];
      delete variant["variantId"];
      delete variant["variation"];
    });
  }
});

//
// Sort keys
//

allItems = allItems.map(function(item) {
  const keys = Object.keys(item);
  array_move(keys, keys.indexOf("displayName"), 2);
  array_move(keys, keys.indexOf("source"), 3);
  array_move(keys, keys.indexOf("buy"), 4);
  array_move(keys, keys.indexOf("sell"), 5);
  const newItem = {};
  keys.forEach(x => {
    newItem[x] = item[x];
  });
  return newItem;
});

//
// Sort items
//

sortItemsByName(allItems);

//
// Write file
//

allItems = JSON.stringify(allItems, null, 2);

allItems = allItems.replace(/https:\/\/acnhcdn.com\/latest\//g, "");
allItems = allItems.replace(/https:\/\/acnhcdn.com\/1.2.0\//g, "");
allItems = allItems.replace(/https:\/\/acnhapi.com\/latest\//g, "");

fs.writeFileSync("./src/assets/items.json", allItems);

//
// Update custom translation files
//

customTranslations.push("source");
customTranslations.forEach(translationKey => {
  const unordered = newTranslation[translationKey];

  Object.keys(removeTranslation[translationKey]).forEach(function(key) {
    delete unordered[key];
  });

  const ordered = Object.keys(unordered)
    .sort()
    .reduce(function(result, key) {
      result[key] = unordered[key];
      return result;
    }, {});

  fs.writeFileSync(
    `./data/translation-custom/${translationKey}.json`,
    JSON.stringify(ordered, null, 2)
  );
});

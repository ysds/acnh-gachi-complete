import store from "../store";
import items from "../assets/items.json";

export function percentage(value, totalValue) {
  if (totalValue === 0) {
    return "0.0%";
  } else {
    const percentage = (Math.floor((value / totalValue) * 1000) / 1000) * 100;
    return `${percentage.toFixed(1)}%`;
  }
}

export function zen_han_conv(str) {
  str = str.replace(/[０-９Ａ-Ｚａ-ｚ]/g, function (match) {
    const chr = match.charCodeAt(0) - 0xfee0;
    return String.fromCharCode(chr);
  });
  str = str.replace(/（/g, "(");
  str = str.replace(/）/g, ")");
  str = str.replace(/～/g, "~");
  return str;
}

export function inWishlistFlags(item, isShared) {
  let wishlist;
  if (isShared) {
    wishlist = store.getters.sharedWishlist;
  } else {
    wishlist = store.getters.wishlist;
  }
  const result = [];
  const variants = item.variants;
  const itemKey = item.uniqueEntryId || item.name;
  const entryIds = [];

  if (variants) {
    const showVariants =
      item.matchedVariants || "0123456789".split("").splice(0, variants.length);

    for (let index of showVariants) {
      entryIds.push(`${itemKey}_${index}`);
    }
  } else {
    entryIds.push(itemKey);
  }

  for (let entryId of entryIds) {
    result.push(wishlist.includes(entryId));
  }

  return result;
}

export function isInWishlist(item, index) {
  const wishlist = store.getters.wishlist;
  const itemKey = item.uniqueEntryId || item.name;
  const entryId = item.variants ? `${itemKey}_${index}` : itemKey;

  return wishlist.includes(entryId);
}

export function stockCounts(item, isShared) {
  let stocklist;
  if (isShared) {
    stocklist = store.getters.sharedStocklist;
  } else {
    stocklist = store.getters.stocklist;
  }
  const result = [];
  const variants = item.variants;
  const itemKey = item.uniqueEntryId || item.name;
  const entryIds = [];

  if (variants) {
    const showVariants =
      item.matchedVariants || "0123456789".split("").splice(0, variants.length);

    for (let index of showVariants) {
      entryIds.push(`${itemKey}_${index}`);
    }
  } else {
    entryIds.push(itemKey);
  }

  for (let entryId of entryIds) {
    result.push(stocklist[entryId]);
  }

  return result;
}

export function stockCount(item, index) {
  const stocklist = store.getters.stocklist;
  const itemKey = item.uniqueEntryId || item.name;
  const entryId = item.variants ? `${itemKey}_${index}` : itemKey;

  return stocklist[entryId] || 0;
}

const RENAME_MAP = {
  "paper bag": "paper-bag hood",
  "olive desert-tile wall": "olive Moroccan wall",
  "olive desert-tile flooring": "olive Moroccan flooring",
  "blue desert-tile wall": "blue Moroccan wall",
  "blue desert-tile flooring": "blue Moroccan flooring",
  "beige desert-tile wall": "beige Moroccan wall",
  "beige desert-tile flooring": "beige Moroccan flooring",
  "teacup ride": "plaza teacup ride",
  "purple desert-tile wall": "purple Moroccan wall",
  "purple desert-tile flooring": "purple Moroccan flooring",
  "Green Nook Inc. aloha shirt": "green Nook Inc. aloha shirt",
  "Coral Nook Inc. aloha shirt": "coral Nook Inc. aloha shirt",
  "Shrubbery Hububbery": "Shrubbery Hubbubbery",
  "Pit-y Party!": "Pit-y Party",
};

export function makeCompatibleCollection(collected) {
  const newCollected = Object.assign({}, collected);

  Object.keys(RENAME_MAP).forEach((oldName) => {
    const newName = RENAME_MAP[oldName];
    if (newCollected[oldName]) {
      if (!newCollected[newName]) {
        newCollected[newName] = newCollected[oldName];
      }
      delete newCollected[oldName];
    }
  });

  // ペットボトル飲料など一時的にバリエーションが多かったアイテムの対応
  items.forEach((item) => {
    if (newCollected[item.name]) {
      const variantsLength = item.variants ? item.variants.length : 1;
      if (variantsLength > 1) {
        if (newCollected[item.name].length > variantsLength) {
          newCollected[item.name] = newCollected[item.name].substring(
            0,
            variantsLength
          );
        }
      }
    }
  });

  return newCollected;
}

export function makeCompatibleWishlist(wishlist) {
  let newWishlist = wishlist.map((wishdata) => {
    const wishdataArray = wishdata.split("_");
    const name = wishdataArray[0];
    const variant = wishdataArray[1];
    const newName = RENAME_MAP[name];

    return newName ? `${newName}_${variant}` : wishdata;
  });

  // ペットボトル飲料など一時的にバリエーションが多かったアイテムの対応
  newWishlist = newWishlist.filter((wishdata) => {
    return wishdata.indexOf("_undefined") === -1;
  });

  return newWishlist;
}

// アイテム名が島名置換対象であるかの判定
export function hasIslandName(item) {
  return (
    item.name === "(island name) Icons" || item.name === "(island name) Miles!"
  );
}

export function toDisplayItemName(item, islandName) {
  // 島名を置換
  if (islandName && hasIslandName(item)) {
    return item.displayName.replace("○○", islandName);
  } else {
    return item.displayName;
  }
}

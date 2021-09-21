import store from "../store";

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

const kata2Hira = function(string) {
  return string.replace(/[\u30A1-\u30FA]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
};

const hankaku2Zenkaku = function(string) {
  return string.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
};

function normalizeText(string) {
  let result = string;
  result = kata2Hira(result);
  result = hankaku2Zenkaku(result);
  return result;
}

export function filterItems(
  items,
  collected,
  nav,
  filter,
  isSearchMode,
  searchText
) {
  return items.filter((item) => {
    // 検索
    if (isSearchMode) {
      if (searchText === "") {
        return false;
      }
      const normalizedDisplayName = normalizeText(item.displayName);
      const normalizedSearchText = normalizeText(searchText);
      return normalizedDisplayName.indexOf(normalizedSearchText) !== -1;
    }
    // 所持済みを非表示
    if (filter.hiddenCollected) {
      if (
        (collected[item.uniqueEntryId] &&
          collected[item.uniqueEntryId] === "0") ||
        (collected[item.name] &&
          item.variants &&
          item.variants.length === collected[item.name].length)
      ) {
        return false;
      }
    }

    // 家具
    if (nav === "housewares") {
      return item.sourceSheet === "Housewares";
    }
    // 小物
    else if (nav === "housewares-miscellaneous") {
      return item.sourceSheet === "Miscellaneous";
    }
    // 壁かけ
    else if (nav === "housewares-wallmounted") {
      return item.sourceSheet === "Wall-mounted";
    }
    // 壁紙
    else if (nav === "walletc") {
      return item.sourceSheet === "Wallpaper";
    }
    // 壁紙
    else if (nav === "walletc-floors") {
      return item.sourceSheet === "Floors";
    }
    // 壁紙
    else if (nav === "walletc-rugs") {
      return item.sourceSheet === "Rugs";
    }
    // ファッション (Tops)
    else if (nav === "fashion") {
      return item.sourceSheet === "Tops";
    }
    // ファッション (Bottoms)
    else if (nav === "fashion-bottoms") {
      return item.sourceSheet === "Bottoms";
    }
    // ファッション (Dress)
    else if (nav === "fashion-dress") {
      return item.sourceSheet === "Dress";
    }
    // ファッション (Headwear)
    else if (nav === "fashion-headwear") {
      return item.sourceSheet === "Headwear";
    }
    // ファッション (Accessories)
    else if (nav === "fashion-accessories") {
      return item.sourceSheet === "Accessories";
    }
    // ファッション (Socks)
    else if (nav === "fashion-socks") {
      return item.sourceSheet === "Socks";
    }
    // ファッション (Shoes)
    else if (nav === "fashion-shoes") {
      return item.sourceSheet === "Shoes";
    }
    // ファッション (Bags)
    else if (nav === "fashion-bags") {
      return item.sourceSheet === "Bags";
    }
    // ファッション (Umbrellas)
    else if (nav === "fashion-umbrellas") {
      return item.sourceSheet === "Umbrellas";
    }
    // ファッション (Clothing Other')
    else if (nav === "fashion-other") {
      return item.sourceSheet === "Clothing Other";
    }
    // かせき
    else if (nav === "fossils") {
      return item.sourceSheet === "Fossils";
    }
    // 曲
    else if (nav === "music") {
      return item.sourceSheet === "Music" && item.name.indexOf("Hazure") === -1;
    }
    // 写真
    else if (nav === "photos") {
      return item.sourceSheet === "Photos";
    }
    // ポスター
    else if (nav === "posters") {
      return item.sourceSheet === "Posters";
    }
    // レシピ
    else if (nav === "recipes") {
      return item.sourceSheet === "Recipes";
    }
    // 来訪者 (ジャスティン)
    else if (nav === "special") {
      return item.variants && item.variants[0].source.includes("Flick");
    }
    // 来訪者 (レックス)
    else if (nav === "special-bugmodels") {
      return item.variants && item.variants[0].source.includes("C.J.");
    }
    // 来訪者 (つねきち)
    else if (nav === "special-art") {
      return item.sourceSheet === "Art";
    }
    // 来訪者 (ローラン)
    else if (nav === "special-saharah") {
      return item.variants && item.variants[0].source.includes("Saharah");
    }
    // 来訪者 (ことの)
    else if (nav === "special-labelle") {
      return item.variants && item.variants[0].source.includes("Labelle");
    }
    // 来訪者 (フーコ)
    else if (nav === "special-celeste") {
      return item.source && item.source.includes("Celeste");
    }
    // 来訪者 (ジョニー)
    else if (nav === "special-gulliver") {
      return item.variants && item.variants[0].source.includes("Gulliver");
    }
    // 来訪者 (海賊ジョニー)
    else if (nav === "special-gullivarrr") {
      return item.variants && item.variants[0].source.includes("Gullivarrr");
    }
    // 来訪者 (ラコスケ)
    else if (nav === "special-pascal") {
      return (
        (item.series === "mermaid" && !item.variants) ||
        (!item.diy &&
          item.variants &&
          item.variants[0].source.includes("Pascal")) ||
        (item.source && item.source.includes("Pascal"))
      );
    }
    // 来訪者 (リサとカイゾー)
    else if (nav === "special-wedding") {
      return (
        item.sourceNotes === "Only available during Wedding Season" && !item.diy
      );
    }
    // 来訪者 (イースター)
    else if (nav === "special-easter") {
      return (
        (!item.diy &&
          item.variants &&
          item.variants[0].source.includes("Bunny Day")) ||
        (item.sourceSheet === "Recipes" &&
          (item.sourceNotes === "Only available during Bunny Day" ||
            item.source.includes("Zipper")))
      );
    }
    // 来訪者 (雪だるま)
    else if (nav === "special-snowboy") {
      return item.source && item.source.includes("Snowboy");
    }
  });
}

export const links = [
  {
    id: "housewares",
    text: "家具",
    subnavs: [
      {
        id: "housewares",
        text: "家具",
      },
      {
        id: "housewares-miscellaneous",
        text: "小物",
      },
      {
        id: "housewares-wallmounted",
        text: "壁かけ",
      },
    ],
  },
  {
    id: "walletc",
    text: "壁紙・床板・ラグ",
    subnavs: [
      {
        id: "walletc",
        text: "壁紙",
      },
      {
        id: "walletc-floors",
        text: "床板",
      },
      {
        id: "walletc-rugs",
        text: "ラグ",
      },
    ],
  },
  {
    id: "fashion",
    text: "ファッション",
    subnavs: [
      {
        id: "fashion",
        text: "トップス",
      },
      {
        id: "fashion-bottoms",
        text: "ボトムス",
      },
      {
        id: "fashion-dress",
        text: "ワンピース",
      },
      {
        id: "fashion-headwear",
        text: "かぶりもの",
      },
      {
        id: "fashion-accessories",
        text: "アクセサリー",
      },
      {
        id: "fashion-socks",
        text: "くつした",
      },
      {
        id: "fashion-shoes",
        text: "くつ",
      },
      {
        id: "fashion-bags",
        text: "バッグ",
      },
      {
        id: "fashion-umbrellas",
        text: "かさ",
      },
      {
        id: "fashion-other",
        text: "そのほか",
      },
    ],
  },
  {
    id: "fossils",
    text: "かせき",
  },
  {
    id: "music",
    text: "曲",
  },
  {
    id: "posters",
    text: "ポスター",
  },
  {
    id: "photos",
    text: "写真",
  },
  {
    id: "recipes",
    text: "レシピ",
  },
  {
    id: "special",
    text: "来訪者・イベント",
    subnavs: [
      {
        id: "special",
        text: "ジャスティン",
      },
      {
        id: "special-bugmodels",
        text: "レックス",
      },
      {
        id: "special-saharah",
        text: "ローラン",
      },
      {
        id: "special-gulliver",
        text: "ジョニー",
      },
      {
        id: "special-gullivarrr",
        text: "海賊ジョニー",
      },
      {
        id: "special-labelle",
        text: "ことの",
      },
      {
        id: "special-celeste",
        text: "フーコ",
      },
      {
        id: "special-art",
        text: "つねきち",
      },
      {
        id: "special-pascal",
        text: "ラコスケ",
      },
      {
        id: "special-easter",
        text: "イースター",
      },
      {
        id: "special-wedding",
        text: "ジューンブライド",
      },
      {
        id: "special-snowboy",
        text: "ゆきだるま",
      },
    ],
  },
];

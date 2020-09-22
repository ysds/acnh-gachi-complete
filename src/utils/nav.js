import itemsJson from "../assets/items.json";

const kata2Hira = function(string) {
  return string.replace(/[\u30A1-\u30FA]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
};

const hankaku2Zenkaku = function(string) {
  return string.replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
};

function normalizeText(string) {
  let result = string;
  result = kata2Hira(result);
  result = hankaku2Zenkaku(result);
  return result;
}

export function filterItems(args) {
  const items = itemsJson;
  args = Object.assign(
    {
      isSearchMode: false,
      searchText: ""
    },
    args
  );

  let {
    collected,
    nav,
    filter,
    isSearchMode,
    searchText,
    isShowSaleFilter
  } = args;

  return items.filter(item => {
    // 検索
    if (isSearchMode) {
      if (searchText === "") {
        return false;
      }
      const normalizedDisplayName = normalizeText(item.displayName);
      const normalizedSearchText = normalizeText(searchText);
      return normalizedDisplayName.indexOf(normalizedSearchText) !== -1;
    }
    // 商店
    if (isShowSaleFilter && filter.saleFilter === "1") {
      if (
        item.catalog === "Not for sale" ||
        item.catalog === "Not in catalog" ||
        item.catalog === false
      )
        return false;
    }
    // DIY
    if (isShowSaleFilter && filter.saleFilter === "2") {
      if (!item.diy) return false;
    }
    // その他
    if (isShowSaleFilter && filter.saleFilter === "3") {
      if (item.diy || item.catalog === "For sale" || item.catalog === true)
        return false;
    }
    // 取得のみ
    if (filter && filter.collectedFilter === "1") {
      if (item.uniqueEntryId) {
        if (
          !collected[item.uniqueEntryId] ||
          !collected[item.uniqueEntryId] === "0"
        )
          return false;
      } else {
        const collectedData = collected[item.name] || "";
        const length = (collectedData.match(/[0-9]/g) || []).length;
        if (length === 0) return false;
      }
    }
    // 配布可のみ
    if (filter && filter.collectedFilter === "2") {
      if (item.uniqueEntryId) {
        if (
          !collected[item.uniqueEntryId] ||
          !collected[item.uniqueEntryId] === "A"
        )
          return false;
      } else {
        const collectedData = collected[item.name] || "";
        const length = (collectedData.match(/[A-J]/g) || []).length;
        if (length === 0) return false;
      }
    }
    // 取得or配布
    if (filter && filter.collectedFilter === "3") {
      if (item.uniqueEntryId) {
        if (!collected[item.uniqueEntryId]) return false;
      } else {
        const collectedData = collected[item.name] || "";
        const length = (collectedData.match(/[0-9A-J]/g) || []).length;
        if (length === 0) return false;
      }
    }
    // 未取得
    else if (filter && filter.collectedFilter === "4") {
      if (item.uniqueEntryId) {
        if (collected[item.uniqueEntryId]) return false;
      } else if (
        collected[item.name] &&
        item.variants.length === collected[item.name].length
      ) {
        return false;
      }
    }
    // 家具
    if (nav === "housewares") {
      return (
        item.sourceSheet === "Housewares" ||
        (item.sourceSheet === "Art" && item.category === "Housewares")
      );
    }
    // 小物
    else if (nav === "housewares-miscellaneous") {
      return (
        item.sourceSheet === "Miscellaneous" ||
        (item.sourceSheet === "Art" && item.category === "Miscellaneous")
      );
    }
    // 壁かけ
    else if (nav === "housewares-wallmounted") {
      return (
        item.sourceSheet === "Wall-mounted" ||
        (item.sourceSheet === "Art" && item.category === "Wall-mounted")
      );
    }
    // 壁紙
    else if (nav === "walletc-wall") {
      return item.sourceSheet === "Wallpaper";
    }
    // 床板
    else if (nav === "walletc-floors") {
      return item.sourceSheet === "Floors";
    }
    // ラグ
    else if (nav === "walletc-rugs") {
      return item.sourceSheet === "Rugs";
    }
    // ファッション (Tops)
    else if (nav === "fashion-tops") {
      return item.sourceSheet === "Tops";
    }
    // ファッション (Bottoms)
    else if (nav === "fashion-bottoms") {
      return item.sourceSheet === "Bottoms";
    }
    // ファッション (Dress)
    else if (nav === "fashion-dress") {
      return item.sourceSheet === "Dress-Up";
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
    // 生き物 (虫)
    else if (nav === "creatures-insects") {
      return item.sourceSheet === "Insects";
    }
    // 生き物 (魚)
    else if (nav === "creatures-fish") {
      return item.sourceSheet === "Fish";
    }
    // 生き物 (海の幸)
    else if (nav === "creatures-sea") {
      return item.sourceSheet === "Sea Creatures";
    }
    // 来訪者 (ジャスティン)
    else if (nav === "special-fishmodels") {
      return item.variants && item.variants[0].source.includes("C.J.");
    }
    // 来訪者 (レックス)
    else if (nav === "special-bugmodels") {
      return item.variants && item.variants[0].source.includes("Flick");
    }
    // 来訪者 (つねきち)
    else if (nav === "special-art") {
      return item.sourceSheet === "Art";
    }
    // 来訪者 (ローラン)
    else if (nav === "special-saharah") {
      return (
        item.variants &&
        item.variants[0].source.includes("Saharah") &&
        item.sourceSheet !== "Other"
      );
    }
    // 来訪者 (ことの)
    else if (nav === "special-labelle") {
      return item.variants && item.variants[0].source.includes("Labelle");
    }
    // 来訪者 (シャンク)
    else if (nav === "special-kicks") {
      return item.variants && item.variants[0].source.includes("Kicks");
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
    // 季節・イベント (花火大会)
    else if (nav === "season-fireworks") {
      return (
        item.sourceNotes ===
          "Only available in August on Sundays, after 7 PM" ||
        item.sourceNotes === "Only avaliable during a Fireworks Display" ||
        item.name === "fountain firework"
      );
    }
    // 季節・イベント (魚釣り大会)
    else if (nav === "season-fish") {
      return (
        item.variants && item.variants[0].source.includes("Fishing Tourney")
      );
    }
    // 季節・イベント (虫取り大会)
    else if (nav === "season-bug") {
      return item.variants && item.variants[0].source.includes("Bug-Off");
    }
    // 季節・イベント (はるのわかたけ)
    else if (nav === "season-spring") {
      return (
        item.sourceNotes === "Only available during Spring" &&
        !item.diy &&
        item.sourceSheet !== "Other"
      );
    }
    // 季節・イベント (さくら)
    else if (nav === "season-sakura") {
      return (
        item.sourceNotes === "Only available during Cherry-Blossom Season" &&
        !item.diy
      );
    }
    // 季節・イベント (なつのかいがら)
    else if (nav === "season-summer") {
      return (
        item.sourceNotes === "Only available during Summer" &&
        !item.diy &&
        item.sourceSheet !== "Other"
      );
    }
    // 季節・イベント (どんぐり/まつぼっくり)
    else if (nav === "season-fall") {
      return item.sourceNotes === "Only available during Fall" && !item.diy;
    }
    // 季節・イベント (きのこ)
    else if (nav === "season-mushroom") {
      return (
        item.sourceNotes === "Only available during Mushroom Season" &&
        !item.diy &&
        item.sourceSheet !== "Other"
      );
    }
    // 季節・イベント (もみじ)
    else if (nav === "season-maple") {
      return (
        item.sourceNotes === "Only available during Maple Leaf Season" &&
        !item.diy &&
        item.sourceSheet !== "Other"
      );
    }
    // 季節・イベント (ゆきのけっしょう)
    else if (nav === "season-winter") {
      return (
        item.sourceNotes === "Only available during Winter" &&
        !item.diy &&
        item.sourceSheet !== "Other"
      );
    }
    // 季節・イベント (オーナメント)
    else if (nav === "season-festive") {
      return (
        item.sourceNotes === "Only available during Festive Season" && !item.diy
      );
    }
    // 季節・イベント (ジューンブライト)
    else if (nav === "season-wedding") {
      return (
        item.sourceNotes === "Only available during Wedding Season" && !item.diy
      );
    }
    // 季節・イベント (イースター)
    else if (nav === "season-easter") {
      return (
        (!item.diy &&
          item.variants &&
          item.variants[0].source.includes("Bunny Day")) ||
        (item.sourceSheet === "Recipes" &&
          (item.sourceNotes === "Only available during Bunny Day" ||
            item.source.includes("Zipper")))
      );
    }
    // 季節・イベント (メーデー)
    else if (nav === "season-mayday") {
      return item.sourceNotes === "Reward for solving May Day maze";
    }
    // 季節・イベント (雪だるま)
    else if (nav === "season-snowboy") {
      return item.source && item.source.includes("Snowboy");
    }
    // バージョン 1.4.0
    else if (nav === "versions-140") {
      return item.versionAdded === "1.4.0";
    }
  });
}

export const navs = [
  {
    id: "housewares",
    text: "家具",
    subnavs: [
      {
        id: "housewares",
        text: "家具"
      },
      {
        id: "housewares-miscellaneous",
        text: "小物"
      },
      {
        id: "housewares-wallmounted",
        text: "壁かけ"
      }
    ]
  },
  {
    id: "walletc",
    text: "壁紙/床板/ラグ",
    subnavs: [
      {
        id: "walletc-wall",
        text: "壁紙"
      },
      {
        id: "walletc-floors",
        text: "床板"
      },
      {
        id: "walletc-rugs",
        text: "ラグ"
      }
    ]
  },
  {
    id: "fashion",
    text: "ファッション",
    subnavs: [
      {
        id: "fashion-tops",
        text: "トップス"
      },
      {
        id: "fashion-bottoms",
        text: "ボトムス"
      },
      {
        id: "fashion-dress",
        text: "ワンピース"
      },
      {
        id: "fashion-headwear",
        text: "かぶりもの"
      },
      {
        id: "fashion-accessories",
        text: "アクセサリー"
      },
      {
        id: "fashion-socks",
        text: "くつした"
      },
      {
        id: "fashion-shoes",
        text: "くつ"
      },
      {
        id: "fashion-bags",
        text: "バッグ"
      },
      {
        id: "fashion-umbrellas",
        text: "かさ"
      },
      {
        id: "fashion-other",
        text: "そのほか"
      }
    ]
  },
  {
    id: "fossils",
    text: "かせき"
  },
  {
    id: "music",
    text: "曲"
  },
  {
    id: "posters",
    text: "ポスター"
  },
  {
    id: "photos",
    text: "写真"
  },
  {
    id: "recipes",
    text: "レシピ"
  },
  {
    id: "creatures",
    text: "いきもの",
    subnavs: [
      {
        id: "creatures-insects",
        text: "虫",
        order: 1
      },
      {
        id: "creatures-fish",
        text: "魚",
        order: 2
      },
      {
        id: "creatures-sea",
        text: "海の幸",
        order: 3
      }
    ]
  },
  {
    id: "special",
    text: "来訪者",
    subnavs: [
      {
        id: "special-fishmodels",
        text: "ジャスティン",
        order: 1
      },
      {
        id: "special-bugmodels",
        text: "レックス",
        order: 2
      },
      {
        id: "special-saharah",
        text: "ローラン",
        order: 3
      },
      {
        id: "special-gulliver",
        text: "ジョニー",
        order: 4
      },
      {
        id: "special-gullivarrr",
        text: "海賊ジョニー",
        order: 5
      },
      {
        id: "special-celeste",
        text: "フーコ",
        order: 6
      },
      {
        id: "special-art",
        text: "つねきち",
        order: 7
      },
      {
        id: "special-pascal",
        text: "ラコスケ",
        order: 8
      },
      {
        id: "special-labelle",
        text: "ことの",
        order: 9
      },
      {
        id: "special-kicks",
        text: "シャンク",
        order: 10
      }
    ]
  },
  {
    id: "season",
    text: "季節/イベント",
    subnavs: [
      {
        id: "season-fish",
        text: "魚釣り大会",
        subtext: "1, 4, 7, 10月",
        order: 1
      },
      {
        id: "season-bug",
        text: "虫取り大会",
        subtext: "6, 7, 8, 9月",
        order: 2
      },
      {
        id: "season-fireworks",
        text: "花火大会",
        subtext: "8月",
        order: 3
      },
      {
        id: "season-spring",
        text: "はるのわかたけ",
        subtext: "2/25〜5/31",
        order: 4
      },
      {
        id: "season-sakura",
        text: "さくらのはなびら",
        subtext: "4/1〜4/10",
        order: 5
      },
      {
        id: "season-easter",
        text: "イースター",
        subtext: "4/1〜4/12",
        order: 6
      },
      {
        id: "season-mayday",
        text: "メーデー",
        subtext: "5/1〜5/7",
        order: 7
      },
      {
        id: "season-wedding",
        text: "ジューンブライド",
        subtext: "6/1〜6/30",
        order: 8
      },
      {
        id: "season-summer",
        text: "なつのかいがら",
        subtext: "6/1〜8/31",
        order: 9
      },
      {
        id: "season-fall",
        text: "どんぐり/まつぼっくり",
        subtext: "9/1〜12/10",
        order: 10
      },
      {
        id: "season-mushroom",
        text: "キノコ",
        subtext: "11/1〜11/30",
        order: 11
      },
      {
        id: "season-maple",
        text: "もみじのはっぱ",
        subtext: "11/16～11/25",
        order: 12
      },
      {
        id: "season-winter",
        text: "ゆきのけっしょう",
        subtext: "12/11〜2/24",
        order: 13
      },
      {
        id: "season-festive",
        text: "オーナメント",
        subtext: "12/15〜1/6",
        order: 14
      },
      {
        id: "season-snowboy",
        text: "ゆきだるま",
        subtext: "12/11〜2/24",
        order: 15
      }
    ]
  },
  {
    id: "versions",
    text: "バージョン",
    subnavs: [
      {
        id: "versions-140",
        text: "1.4.0"
      }
    ]
  }
];

export function totalLength(args) {
  const { collected, nav, filter, isShowSaleFilter } = args;

  const totalItems = filterItems({
    collected,
    nav,
    filter,
    isShowSaleFilter
  });
  let result = 0;
  for (let i = 0; i < totalItems.length; i++) {
    if (totalItems[i].variants) {
      result += totalItems[i].variants.length;
    } else {
      result++;
    }
  }
  return result;
}

export function collectedLength(args) {
  const { collected, nav, filter, isShowSaleFilter } = args;

  const collectedItems = filterItems({
    collected,
    nav,
    filter,
    isShowSaleFilter
  });

  let result = 0;
  for (let i = 0; i < collectedItems.length; i++) {
    const item = collectedItems[i];
    if (item.uniqueEntryId) {
      if (collected[item.uniqueEntryId]) result++;
    } else {
      const collectedData = collected[item.name] || "";
      const length = (collectedData.match(/[0-9A-J]/g) || []).length;
      result += length;
    }
  }
  return result;
}

export function getNavText(nav) {
  let navText = nav;
  navs.forEach(link => {
    if (link.id === nav) navText = link.text;
    if (link.subnavs) {
      link.subnavs.forEach(sublink => {
        if (sublink.id === nav) navText = sublink.text;
      });
    }
  });
  return navText;
}

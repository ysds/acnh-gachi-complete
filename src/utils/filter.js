import seasonEventData from "../../data/translation-custom/seasonEvent.json";

const typeFilters = [
  {
    id: "all",
    label: "すべて",
    btnLabel: "フィルタ",
    show: [
      "housewares",
      "fashion",
      "tools",
      "walletc",
      "music",
      "flowers",
      "photos",
    ],
  },
  {
    id: "catalog-buyable",
    label: "カタログ購入可（いつでも）",
    show: ["housewares", "fashion", "tools", "walletc", "music"],
    filter: function (item) {
      return item.catalog === "For sale";
    },
  },
  {
    id: "catalog-seasoonal",
    label: "カタログ購入可（期間制限あり）",
    show: ["housewares", "fashion", "tools", "walletc", "music"],
    filter: function (item) {
      return item.catalog === "Seasonal";
    },
  },
  {
    id: "not-for-sale",
    label: "ひばいひん",
    show: ["housewares", "fashion", "tools", "walletc", "music"],
    filter: function (item) {
      return item.catalog !== "For sale" && item.catalog !== "Seasonal";
    },
  },
  {
    id: "not-for-sale-diy",
    label: "ひばいひん（DIY）",
    show: ["housewares", "fashion", "tools", "walletc"],
    filter: function (item) {
      return item.catalog !== "For sale" && item.diy;
    },
  },
  {
    id: "not-for-sale-other",
    label: "ひばいひん（DIYを除く）",
    show: ["housewares", "fashion", "tools", "walletc"],
    filter: function (item) {
      return (
        item.catalog !== "For sale" && !item.diy && item.catalog !== "Seasonal"
      );
    },
  },
  {
    id: "able",
    label: "エイブル",
    show: ["fashion"],
    filter: function (item) {
      return item.source && item.source.includes("Able Sisters");
    },
  },
  {
    id: "kicks",
    label: "シャンク",
    show: ["fashion"],
    filter: function (item) {
      return (
        item.source &&
        (item.source.includes("Kicks") ||
          item.source.includes("Kick's Commune"))
      );
    },
  },
  {
    id: "labelle",
    label: "ことの",
    show: ["fashion"],
    filter: function (item) {
      return item.source && item.source.includes("Label");
    },
  },
  {
    id: "daly",
    label: "たぬきショッピング（日替わり）",
    show: ["fashion"],
    filter: function (item) {
      return (
        item.source && item.source.includes("Nook Shopping Daily Selection")
      );
    },
  },
  {
    id: "recycle",
    label: "リサイクルボックス",
    show: ["fashion"],
    filter: function (item) {
      return item.source && item.source.includes("Recycle box");
    },
  },
  {
    id: "seed",
    label: "種袋",
    show: ["flowers"],
    filter: function (item) {
      return item.source && item.source.includes("Seed bag");
    },
  },
  {
    id: "breeding",
    label: "交配",
    show: ["flowers"],
    filter: function (item) {
      return item.source && item.source.includes("Breeding");
    },
  },
  {
    id: "flower-reward",
    label: "その他",
    show: ["flowers"],
    filter: function (item) {
      return item.source && item.source.includes("5-star town status");
    },
  },
  {
    id: "personality-jock",
    label: "ハキハキ",
    show: ["photos"],
    filter: function (item) {
      return item.personality === "ハキハキ";
    },
  },
  {
    id: "personality-lazy",
    label: "ぼんやり",
    show: ["photos"],
    filter: function (item) {
      return item.personality === "ぼんやり";
    },
  },
  {
    id: "personality-cranky",
    label: "コワイ",
    show: ["photos"],
    filter: function (item) {
      return item.personality === "コワイ";
    },
  },
  {
    id: "personality-smug",
    label: "キザ",
    show: ["photos"],
    filter: function (item) {
      return item.personality === "キザ";
    },
  },
  {
    id: "personality-peppy",
    label: "元気",
    show: ["photos"],
    filter: function (item) {
      return item.personality === "元気";
    },
  },
  {
    id: "personality-big-sister",
    label: "アネキ",
    show: ["photos"],
    filter: function (item) {
      return item.personality === "アネキ";
    },
  },
  {
    id: "personality-normal",
    label: "普通",
    show: ["photos"],
    filter: function (item) {
      return item.personality === "普通";
    },
  },
  {
    id: "personality-snooty",
    label: "オトナ",
    show: ["photos"],
    filter: function (item) {
      return item.personality === "オトナ";
    },
  },
  {
    id: "personality-none",
    label: "SP住民",
    show: ["photos"],
    filter: function (item) {
      return !item.personality;
    },
  },
];

const seasonEvents = [
  "Spring shopping",
  "Summer shopping",
  "Fall shopping",
  "Winter shopping",
  "Setsubun (Able Sisters)",
  "Festivale (ready days); Festivale",
  "Shamrock Day (Able Sisters)",
  "Prom (Able Sisters)",
  "Wedding Season (Able Sisters)",
  "Fireworks Show",
  "Halloween (ready days); Halloween",
  "Festive shopping",
  "Toy Day (ready days phase 2); Toy Day; Toy Day (day after)",
];

seasonEvents.forEach((value, index) => {
  typeFilters.push({
    id: `fashion-${index}`,
    label: seasonEventData[value].text || value,
    show: ["fashion"],
    filter: function (item) {
      return (
        item.seasonEvent &&
        item.seasonEvent.includes(value) &&
        item.catalog === "For sale"
      );
    },
  });
});

export { typeFilters };

export const collectedFilters = [
  {
    id: "0",
    label: "すべて",
    btnLabel: "状態",
  },
  {
    id: "1",
    label: '<span class="tg tg-gr">取得済</span>',
  },
  {
    id: "2",
    label: '<span class="tg tg-bl">配布可</span>',
  },
  {
    id: "3",
    label: '<span class="tg tg-gr">取</span>＋<span class="tg tg-bl">配</span>',
  },
  {
    id: "4",
    label: "未取得",
  },
];

export function typeFilter(item, filterValue) {
  const matchedFilter = typeFilters.filter(
    (filter) => filter.id === filterValue
  )[0];
  if (matchedFilter && matchedFilter.filter) {
    return matchedFilter.filter(item);
  }
  return true;
}

// nav に応じて利用可能なフィルター項目配列を返す
export function getTypeFilterItems(nav) {
  if (nav && nav !== "housewares-nookmiles") {
    return typeFilters.filter((obj) => {
      const regex = new RegExp(`.*(${obj.show.join(["|"])}).*`, "g");
      return nav.match(regex);
    });
  }
  return [];
}

// 指定された nav で指定された filter が利用可能かどうか
export function isAvailableFilter(nav, filter) {
  const filters = getTypeFilterItems(nav);
  const matchedFilters = filters.filter((obj) => obj.id === filter);
  return matchedFilters.length === 0;
}

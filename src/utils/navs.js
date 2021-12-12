const inSource = (item, sources) => {
  const regex = new RegExp(sources, "gi");
  return item.source && item.source.join(",").match(regex);
};

const navs = [
  {
    id: "housewares",
    text: "家具",
    class: "nav-item-items",
    subnavs: [
      {
        id: "housewares-all",
        text: "すべての家具",
        alttext: "すべて",
        filter: function (item) {
          return item.sourceSheet.match(
            /Housewares|Miscellaneous|Wall-mounted|Art|Food|Ceiling Decor/g
          );
        },
      },
      {
        id: "housewares",
        text: "家具",
        filter: function (item) {
          return (
            item.sourceSheet === "Housewares" ||
            (item.sourceSheet === "Artwork" && item.category === "Housewares")
          );
        },
      },
      {
        id: "housewares-miscellaneous",
        text: "小物",
        filter: function (item) {
          return (
            item.sourceSheet === "Miscellaneous" ||
            item.sourceSheet === "Food" ||
            (item.sourceSheet === "Artwork" &&
              item.category === "Miscellaneous")
          );
        },
      },
      {
        id: "housewares-wallmounted",
        text: "壁かけ",
        filter: function (item) {
          return (
            item.sourceSheet === "Wall-mounted" ||
            (item.sourceSheet === "Artwork" && item.category === "Wall-mounted")
          );
        },
      },
      {
        id: "housewares-ceiling",
        text: "天井",
        filter: function (item) {
          return item.sourceSheet === "Ceiling Decor";
        },
      },
      {
        id: "housewares-food",
        text: "料理",
        filter: function (item) {
          return item.tag === "DishFood" || item.tag === "DishDrink";
        },
      },
      {
        id: "housewares-nookmiles",
        text: "マイル家具",
        filter: function (item) {
          return (
            item.sourceSheet === "Housewares" &&
            inSource(item, "Nook Miles Redemption")
          );
        },
      },
    ],
  },
  {
    id: "fashion",
    text: "ファッション",
    class: "nav-item-items",
    subnavs: [
      {
        id: "fashion-all",
        text: "すべてのファッション",
        alttext: "すべて",
        filter: function (item) {
          return item.sourceSheet.match(
            /Tops|Bottoms|Dress-Up|Headwear|Accessories|Socks|Shoes|Bags|Umbrellas|Clothing Other/g
          );
        },
      },
      {
        id: "fashion-tops",
        text: "トップス",
        filter: function (item) {
          return item.sourceSheet === "Tops";
        },
      },
      {
        id: "fashion-bottoms",
        text: "ボトムス",
        filter: function (item) {
          return item.sourceSheet === "Bottoms";
        },
      },
      {
        id: "fashion-dress",
        text: "ワンピース",
        filter: function (item) {
          return item.sourceSheet === "Dress-Up";
        },
      },
      {
        id: "fashion-headwear",
        text: "かぶりもの",
        filter: function (item) {
          return item.sourceSheet === "Headwear";
        },
      },
      {
        id: "fashion-accessories",
        text: "アクセサリー",
        filter: function (item) {
          return item.sourceSheet === "Accessories";
        },
      },
      {
        id: "fashion-socks",
        text: "くつした",
        filter: function (item) {
          return item.sourceSheet === "Socks";
        },
      },
      {
        id: "fashion-shoes",
        text: "くつ",
        filter: function (item) {
          return item.sourceSheet === "Shoes";
        },
      },
      {
        id: "fashion-bags",
        text: "バッグ",
        filter: function (item) {
          return item.sourceSheet === "Bags";
        },
      },
      {
        id: "fashion-umbrellas",
        text: "かさ",
        filter: function (item) {
          return item.sourceSheet === "Umbrellas";
        },
      },
      {
        id: "fashion-other",
        text: "そのほか",
        filter: function (item) {
          return item.sourceSheet === "Clothing Other";
        },
      },
    ],
  },
  {
    id: "tools",
    text: "道具・グッズ",
    class: "nav-item-items",
    subnavs: [
      {
        id: "tools-all",
        text: "道具",
        alttext: "すべて",
        filter: function (item) {
          return item.sourceSheet === "Tools/Goods";
        },
      },
      {
        id: "tools-wand",
        text: "ステッキ",
        filter: function (item) {
          return (
            item.sourceSheet === "Tools/Goods" && item.name.indexOf("wand") >= 0
          );
        },
      },
    ],
  },
  {
    id: "fencing",
    class: "nav-item-items",
    text: "柵",
    filter: function (item) {
      return item.sourceSheet === "Fencing";
    },
  },
  {
    id: "walletc",
    text: "壁紙/床板/ラグ",
    class: "nav-item-items",
    subnavs: [
      {
        id: "walletc-wall",
        text: "壁紙",
        filter: function (item) {
          return item.sourceSheet === "Wallpaper";
        },
      },
      {
        id: "walletc-floors",
        text: "床板",
        filter: function (item) {
          return item.sourceSheet === "Floors";
        },
      },
      {
        id: "walletc-rugs",
        text: "ラグ",
        filter: function (item) {
          return item.sourceSheet === "Rugs";
        },
      },
    ],
  },
  {
    id: "fossils",
    text: "かせき",
    class: "nav-item-items",
    filter: function (item) {
      return item.sourceSheet === "Fossils";
    },
  },
  {
    id: "gyroids",
    text: "はにわ",
    class: "nav-item-items",
    filter: function (item) {
      return item.sourceSheet === "Gyroids";
    },
  },
  {
    id: "music",
    text: "曲",
    class: "nav-item-items",
    filter: function (item) {
      return item.sourceSheet === "Music";
    },
  },
  {
    id: "posters",
    text: "ポスター",
    class: "nav-item-items",
    filter: function (item) {
      return item.sourceSheet === "Posters";
    },
  },
  {
    id: "photos",
    text: "写真",
    class: "nav-item-items",
    filter: function (item) {
      return item.sourceSheet === "Photos";
    },
  },
  {
    id: "creatures",
    text: "いきもの",
    class: "nav-item-items",
    subnavs: [
      {
        id: "creatures-insects",
        text: "虫",
        filter: function (item) {
          return item.sourceSheet === "Insects";
        },
      },
      {
        id: "creatures-fish",
        text: "魚",
        filter: function (item) {
          return item.sourceSheet === "Fish";
        },
      },
      {
        id: "creatures-sea",
        text: "海の幸",
        filter: function (item) {
          return item.sourceSheet === "Sea Creatures";
        },
      },
    ],
  },
  {
    id: "other",
    text: "その他",
    class: "nav-item-items",
    subnavs: [
      {
        id: "other-all",
        text: "すべてのその他",
        alttext: "すべて",
        filter: function (item) {
          return (
            item.sourceSheet === "Tools/Goods" ||
            (item.sourceSheet === "Other" &&
              item.variants[0].storageImage &&
              item.tag !== "Unnecessary") ||
            item.sourceSheet === "Interior Structures"
          );
        },
      },
      {
        id: "other-plant",
        text: "その他（植物）",
        alttext: "植物",
        filter: function (item) {
          return (
            item.sourceSheet === "Other" &&
            item.tag === "Plants" &&
            item.variants[0].storageImage
          );
        },
      },
      {
        id: "other-interior",
        text: "その他（内装）",
        alttext: "内装",
        filter: function (item) {
          return item.sourceSheet === "Interior Structures";
        },
      },
      {
        id: "other-etc",
        text: "その他（その他）",
        alttext: "その他",
        filter: function (item) {
          return (
            item.sourceSheet === "Other" &&
            (item.tag === "Etc" ||
              item.name.match(/(vine|gyroid fragment|glowing moss)$/g))
          );
        },
      },
      {
        id: "other-unstoragable",
        text: "その他（収納不可）",
        alttext: "収納不可",
        filter: function (item) {
          return item.sourceSheet === "Un-Storagable";
        },
      },
    ],
  },
  {
    id: "separator1",
    separator: true,
  },
  {
    id: "recipes",
    text: "レシピ",
    class: "nav-item-collection",
    filter: function (item) {
      return item.sourceSheet === "Recipes";
    },
  },
  {
    id: "reactions",
    text: "リアクション",
    class: "nav-item-collection",
    filter: function (item) {
      return item.sourceSheet === "Reactions";
    },
  },
  {
    id: "achievements",
    text: "たぬきマイレージ",
    class: "nav-item-collection",
    filter: function (item) {
      return item.sourceSheet === "Achievements";
    },
  },
  {
    id: "plants",
    text: "植物",
    class: "nav-item-collection",
    subnavs: [
      {
        id: "plants-flowers",
        text: "花",
        filter: function (item) {
          return (
            item.sourceSheet === "Other" &&
            inSource(item, "Seed bag|Breeding|5-star town status")
          );
        },
      },
      {
        id: "plants-bushes",
        text: "低木",
        filter: function (item) {
          return (
            item.sourceSheet === "Other" &&
            inSource(item, "Digging up a fully grown bush")
          );
        },
      },
      {
        id: "plants-veg",
        text: "野菜",
        filter: function (item) {
          return item.name.match(/^ripe /g);
        },
      },
      {
        id: "plants-woods",
        text: "木",
        filter: function (item) {
          return item.name.match(
            /hardwood tree|cedar tree|orange tree|cherry tree|pear tree|peach tree|coconut tree|apple tree|bamboo tree|money tree/g
          );
        },
      },
    ],
  },
  {
    id: "licenses",
    text: "ライセンス類",
    class: "nav-item-collection",
    filter: function (item) {
      return item.sourceSheet === "Other" && item.tag === "Unnecessary";
    },
  },
  {
    id: "separator2",
    separator: true,
  },
  {
    id: "special",
    text: "来訪者・パニー島広場など",
    class: "nav-item-special",
    subnavs: [
      {
        id: "special-fishmodels",
        text: "魚の模型",
        subtext: "ジャスティン",
        order: 1,
        filter: function (item) {
          return (
            inSource(item, "C.J.") && item.seasonEvent !== "Fishing Tourney"
          );
        },
      },
      {
        id: "special-bugmodels",
        text: "虫の模型",
        subtext: "レックス",
        order: 2,
        filter: function (item) {
          return inSource(item, "Flick") && item.seasonEvent !== "Bug-Off";
        },
      },
      {
        id: "special-art",
        text: "美術品",
        subtext: "つねきち",
        order: 3,
        filter: function (item) {
          return item.sourceSheet === "Artwork";
        },
      },
      {
        id: "special-saharah",
        text: "ローラン壁紙/床/ラグ",
        subtext: "ローラン",
        order: 4,
        filter: function (item) {
          return inSource(item, "Saharah") && item.sourceSheet !== "Other";
        },
      },
      {
        id: "special-kicks",
        text: "シャンク",
        subtext: "シャンク",
        order: 6,
        filter: function (item) {
          return inSource(item, "Kicks");
        },
      },
      {
        id: "special-labelle",
        text: "ケイトシリーズ",
        subtext: "ことの",
        order: 7,
        filter: function (item) {
          return inSource(item, "Label") && item.sourceSheet !== "Other";
        },
      },
      {
        id: "special-celeste",
        text: "フーコレシピ",
        subtext: "フーコ",
        order: 8,
        filter: function (item) {
          return inSource(item, "Celeste");
        },
      },
      {
        id: "special-gulliver",
        text: "ジョニー",
        subtext: "ジョニー",
        order: 9,
        filter: function (item) {
          return inSource(item, "Gulliver$");
        },
      },
      {
        id: "special-gullivarrr",
        text: "海賊シリーズ",
        subtext: "海賊ジョニー",
        order: 10,
        filter: function (item) {
          return inSource(item, "Gullivarrr");
        },
      },
      {
        id: "special-pascal",
        text: "マーメイドシリーズ",
        subtext: "ラコスケ",
        order: 11,
        filter: function (item) {
          return (
            (item.series === "mermaid" && !item.variants) ||
            (!item.diy &&
              inSource(item, "Pascal") &&
              item.sourceSheet !== "Other")
          );
        },
      },
      {
        id: "special-redd-fireworks",
        text: "いなりくじ（花火大会）",
        subtext: "つねきち",
        order: 12,
        filter: function (item) {
          return inSource(item, "Redd's Raffle");
        },
      },
      {
        id: "special-redd-commune",
        text: "いなりくじ（パニー島）",
        subtext: "つねきち",
        order: 13,
        filter: function (item) {
          return inSource(item, "Redd's Co-op Raffle");
        },
      },
      {
        id: "special-katrina",
        text: "ハッケミィ家具",
        subtext: "ハッケミィ",
        order: 14,
        filter: function (item) {
          return inSource(item, "Katrina's Cleansing Service");
        },
      },
      {
        id: "special-brewster",
        text: "マスター家具",
        subtext: "マスター",
        order: 15,
        filter: function (item) {
          return inSource(item, "Brewster");
        },
      },
      {
        id: "special-radio",
        text: "ラジオ体操",
        subtext: "広場",
        order: 16,
        filter: function (item) {
          return inSource(item, "Group Stretching");
        },
      },
      {
        id: "special-kappn",
        text: "かっぺいの離島",
        subtext: "かっぺい",
        order: 17,
        filter: function (item) {
          return inSource(item, "Kapp'n island");
        },
      },
    ],
  },
  {
    id: "season",
    text: "季節/イベント",
    class: "nav-item-special",
    subnavs: [
      {
        id: "season-nook",
        text: "たぬきショッピング",
        subtext: "スペシャル（シーズン）",
        order: 1,
        filter: function (item) {
          return inSource(item, "Nook Shopping Seasonal");
        },
      },
      {
        id: "season-daily",
        text: "たぬきショッピング",
        subtext: "スペシャル（日替わり）",
        order: 2,
        filter: function (item) {
          return inSource(item, "Nook Shopping Daily Selection");
        },
      },
      {
        id: "season-fish",
        text: "魚釣り大会",
        subtext: "1, 4, 7, 10月",
        order: 3,
        filter: function (item) {
          return item.seasonEvent === "Fishing Tourney";
        },
      },
      {
        id: "season-bug",
        text: "虫取り大会",
        subtext: "6, 7, 8, 9月",
        order: 4,
        filter: function (item) {
          return item.seasonEvent === "Bug-Off";
        },
      },
      {
        id: "season-fireworks",
        text: "花火大会",
        subtext: "8月",
        order: 5,
        filter: function (item) {
          return item.seasonEvent === "Fireworks Show";
        },
      },
      {
        id: "season-festivale",
        text: "カーニバル",
        subtext: "2/1〜2/15",
        order: 6,
        filter: function (item) {
          return (
            item.seasonEvent &&
            item.seasonEvent.includes("Festivale") &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-spring",
        text: "はるのわかたけ",
        subtext: "2/25〜5/31",
        order: 7,
        filter: function (item) {
          return (
            item.seasonEvent === "young spring bamboo" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-shamrock",
        text: "シャムロックデー",
        subtext: "3/10〜3/17",
        order: 8,
        filter: function (item) {
          return (
            item.seasonEvent &&
            item.seasonEvent.includes("Shamrock Day") &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-easter",
        text: "イースター",
        subtext: "3/28〜4/4",
        order: 9,
        filter: function (item) {
          return (
            item.seasonEvent &&
            item.seasonEvent.includes("Bunny Day") &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-sakura",
        text: "さくらのはなびら",
        subtext: "4/1〜4/10",
        order: 10,
        filter: function (item) {
          return (
            item.seasonEvent === "cherry-blossom petals" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-mayday",
        text: "メーデー",
        subtext: "4/29〜5/7",
        order: 11,
        filter: function (item) {
          return (
            item.seasonEvent === "May Day" && item.sourceSheet !== "Tools/Goods"
          );
        },
      },
      {
        id: "season-museum",
        text: "国際ミュージアムデー",
        subtext: "5/18〜5/31",
        order: 12,
        filter: function (item) {
          return item.seasonEvent === "International Museum Day";
        },
      },
      {
        id: "season-wedding",
        text: "ジューンブライド",
        subtext: "6/1〜6/30",
        order: 13,
        filter: function (item) {
          return (
            item.seasonEvent === "Wedding Season" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-summer",
        text: "なつのかいがら",
        subtext: "6/1〜8/31",
        order: 14,
        filter: function (item) {
          return (
            item.seasonEvent === "summer shells" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-fall",
        text: "どんぐり/まつぼっくり",
        subtext: "9/1〜12/10",
        order: 15,
        filter: function (item) {
          return (
            item.seasonEvent === "acorns and pine cones" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-halloween",
        text: "ハロウィン",
        subtext: "10/1〜10/31",
        order: 16,
        filter: function (item) {
          return item.seasonEvent && item.seasonEvent.includes("Halloween");
        },
      },
      {
        id: "season-mushroom",
        text: "キノコ",
        subtext: "11/1〜11/30",
        order: 17,
        filter: function (item) {
          return (
            item.seasonEvent === "mushrooms" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-maple",
        text: "もみじのはっぱ",
        subtext: "11/16～11/25",
        order: 18,
        filter: function (item) {
          return (
            item.seasonEvent === "maple leaves" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-turkey",
        text: "サンクスギビングデー",
        subtext: "11/26～11/30",
        order: 19,
        filter: function (item) {
          return item.seasonEvent && item.seasonEvent.includes("Turkey Day");
        },
      },
      {
        id: "season-toy",
        text: "クリスマス",
        subtext: "12/1～12/25",
        order: 20,
        filter: function (item) {
          return (
            item.seasonEvent &&
            item.seasonEvent.includes("Toy Day") &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-winter",
        text: "ゆきのけっしょう",
        subtext: "12/11〜2/24",
        order: 21,
        filter: function (item) {
          return (
            item.seasonEvent === "snowflakes" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-festive",
        text: "オーナメント",
        subtext: "12/15〜1/6",
        order: 22,
        filter: function (item) {
          return (
            item.seasonEvent === "ornaments" &&
            !item.diy &&
            item.sourceSheet !== "Other"
          );
        },
      },
      {
        id: "season-countdown",
        text: "カウントダウン",
        subtext: "12/31",
        order: 23,
        filter: function (item) {
          return item.seasonEvent === "Countdown";
        },
      },
      {
        id: "season-birthday",
        text: "誕生日",
        order: 24,
        filter: function (item) {
          return item.seasonEvent === "Birthday";
        },
      },
      {
        id: "season-mother",
        text: "ははシリーズ",
        order: 25,
        filter: function (item) {
          return item.source && item.source.includes("Mom");
        },
      },
    ],
  },
  {
    id: "nookpoints",
    text: "タヌポイント",
    class: "nav-item-special",
    filter: function (item) {
      return inSource(item, "NookLink");
    },
  },
  {
    id: "hhp",
    text: "ハピパラ",
    class: "nav-item-special",
    subnavs: [
      {
        id: "hhp-request",
        text: "別荘",
        filter: function (item) {
          return item.sourceSheet === "Paradise Planning";
        },
      },
      {
        id: "hhp-vip",
        text: "別荘（VIP）",
        filter: function (item) {
          return item.sourceSheet === "Paradise Planning VIP";
        },
      },
      {
        id: "hhp-bottles",
        text: "メッセージボトル（ハピパラ・かっぺい離島）",
        alttext: "メッセージボトル",
        subtext: "ハピパラ・かっぺい離島",
        filter: function (item) {
          return inSource(item, "HHP island bottles");
        },
      },
      {
        id: "hhp-office",
        text: "タクミライフ",
        filter: function (item) {
          return inSource(item, "HHP Office");
        },
      },
      {
        id: "hhp-cafe",
        text: "カフェ",
        filter: function (item) {
          return inSource(item, "HHP Café");
        },
      },
      {
        id: "hhp-apparel",
        text: "アパレルショップ",
        filter: function (item) {
          return inSource(item, "HHP Apparel Shop");
        },
      },
      {
        id: "hhp-lottie",
        text: "タクミ",
        filter: function (item) {
          return inSource(item, "Lottie");
        },
      },
      {
        id: "hhp-niko",
        text: "ニコ",
        filter: function (item) {
          return inSource(item, "Niko");
        },
      },
      {
        id: "hhp-wardell",
        text: "ナッティー",
        filter: function (item) {
          return inSource(item, "Wardell");
        },
      },
      {
        id: "hhp-kk",
        text: "とたけけフェス",
        filter: function (item) {
          return inSource(item, "DJ KK concert");
        },
      },
    ],
  },
  {
    id: "versions",
    text: "バージョン",
    class: "nav-item-special",
    subnavs: [
      {
        id: "versions-200",
        text: "2.0.0",
        filter: function (item) {
          return item.versionAdded === "2.0.0";
        },
      },
      {
        id: "versions-1110",
        text: "1.11.0",
        filter: function (item) {
          return item.versionAdded === "1.11.0";
        },
      },
      {
        id: "versions-1100",
        text: "1.10.0",
        filter: function (item) {
          return item.versionAdded === "1.10.0";
        },
      },
      {
        id: "versions-190",
        text: "1.9.0",
        filter: function (item) {
          return item.versionAdded === "1.9.0";
        },
      },
      {
        id: "versions-180",
        text: "1.8.0",
        filter: function (item) {
          return item.versionAdded === "1.8.0";
        },
      },
      {
        id: "versions-170",
        text: "1.7.0",
        filter: function (item) {
          return item.versionAdded === "1.7.0";
        },
      },
      {
        id: "versions-160",
        text: "1.6.0",
        filter: function (item) {
          return item.versionAdded === "1.6.0";
        },
      },
      {
        id: "versions-150",
        text: "1.5.0",
        filter: function (item) {
          return item.versionAdded === "1.5.0";
        },
      },
      {
        id: "versions-140",
        text: "1.4.0",
        filter: function (item) {
          return item.versionAdded === "1.4.0";
        },
      },
    ],
  },
  {
    id: "separator3",
    separator: true,
  },
  {
    id: "exchange",
    text: "欲しいもの＆配布可",
    class: "nav-item-wishlist",
  },
];

exports.navs = navs;

const navsFlat = {};

for (let nav of navs) {
  if (nav.subnavs) {
    for (let subnav of nav.subnavs) {
      navsFlat[subnav.id] = subnav;
    }
  } else {
    navsFlat[nav.id] = nav;
  }
}

exports.navsFlat = navsFlat;

const getNavText = (nav) => {
  let navText = "";
  navs.forEach((link) => {
    if (link.id === nav) navText = link.text;
    if (link.subnavs) {
      link.subnavs.forEach((sublink) => {
        if (sublink.id === nav) navText = sublink.text;
      });
    }
  });
  return navText;
};

exports.getNavText = getNavText;

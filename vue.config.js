const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin");
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/acnh-gachi-complete/" : "/",
  outputDir: "docs",
  pages: {
    index: {
      entry: "src/main.js",
      title: "あつ森ガチコンプ"
    }
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, "docs"),
            renderer: new Renderer({
              maxConcurrentRoutes: 4
            }),
            routes: [
              "/shares",
              "/share2/housewares-all",
              "/share2/housewares",
              "/share2/housewares-miscellaneous",
              "/share2/housewares-wallmounted",
              "/share2/housewares-nookmiles",
              "/share2/walletc-wall",
              "/share2/walletc-floors",
              "/share2/walletc-rugs",
              "/share2/walletc-fencing",
              "/share2/fashion-all",
              "/share2/fashion-tops",
              "/share2/fashion-bottoms",
              "/share2/fashion-dress",
              "/share2/fashion-headwear",
              "/share2/fashion-accessories",
              "/share2/fashion-socks",
              "/share2/fashion-shoes",
              "/share2/fashion-bags",
              "/share2/fashion-umbrellas",
              "/share2/fashion-other",
              "/share2/fossils",
              "/share2/music",
              "/share2/posters",
              "/share2/photos",
              "/share2/recipes",
              "/share2/creatures-insects",
              "/share2/creatures-fish",
              "/share2/creatures-sea",
              "/share2/tools-all",
              "/share2/tools-wand",
              "/share2/plants-flowers",
              "/share2/plants-bushes",
              "/share2/special-fishmodels",
              "/share2/special-bugmodels",
              "/share2/special-saharah",
              "/share2/special-gulliver",
              "/share2/special-gullivarrr",
              "/share2/special-celeste",
              "/share2/special-art",
              "/share2/special-pascal",
              "/share2/special-labelle",
              "/share2/special-kicks",
              "/share2/season-nook",
              "/share2/season-fish",
              "/share2/season-bug",
              "/share2/season-fireworks",
              "/share2/season-festivale",
              "/share2/season-spring",
              "/share2/season-sakura",
              "/share2/season-easter",
              "/share2/season-mayday",
              "/share2/season-museum",
              "/share2/season-wedding",
              "/share2/season-summer",
              "/share2/season-fall",
              "/share2/season-halloween",
              "/share2/season-mushroom",
              "/share2/season-maple",
              "/share2/season-turkey",
              "/share2/season-toy",
              "/share2/season-winter",
              "/share2/season-festive",
              "/share2/season-countdown",
              "/share2/season-birthday",
              "/share2/season-mother",
              "/share2/reactions",
              "/share2/achievements",
              "/share2/versions-160",
              "/share2/versions-170",
              "/share2/versions-150",
              "/share2/versions-140"
            ],
            postProcess(context) {
              const categories = {
                "/shares": "取得状況",
                "/share2/housewares-all": "すべての家具",
                "/share2/housewares": "家具",
                "/share2/housewares-miscellaneous": "小物",
                "/share2/housewares-wallmounted": "壁かけ",
                "/share2/housewares-nookmiles": "マイル家具",
                "/share2/walletc-wall": "壁紙",
                "/share2/walletc-floors": "床板",
                "/share2/walletc-rugs": "ラグ",
                "/share2/walletc-fencing": "柵",
                "/share2/fashion-all": "すべてのファッション",
                "/share2/fashion-tops": "トップス",
                "/share2/fashion-bottoms": "ボトムス",
                "/share2/fashion-dress": "ワンピース",
                "/share2/fashion-headwear": "かぶりもの",
                "/share2/fashion-accessories": "アクセサリー",
                "/share2/fashion-socks": "くつした",
                "/share2/fashion-shoes": "くつ",
                "/share2/fashion-bags": "バッグ",
                "/share2/fashion-umbrellas": "かさ",
                "/share2/fashion-other": "そのほか",
                "/share2/fossils": "かせき",
                "/share2/music": "曲",
                "/share2/posters": "ポスター",
                "/share2/photos": "写真",
                "/share2/recipes": "レシピ",
                "/share2/creatures-insects": "虫",
                "/share2/creatures-fish": "魚",
                "/share2/creatures-sea": "海の幸",
                "/share2/tools-all": "道具",
                "/share2/tools-wand": "ステッキ",
                "/share2/plants-flowers": "花",
                "/share2/plants-bushes": "低木",
                "/share2/special-fishmodels": "ジャスティン",
                "/share2/special-bugmodels": "レックス",
                "/share2/special-saharah": "ローラン",
                "/share2/special-gulliver": "ジョニー",
                "/share2/special-gullivarrr": "海賊ジョニー",
                "/share2/special-celeste": "フーコ",
                "/share2/special-art": "つねきち",
                "/share2/special-pascal": "ラコスケ",
                "/share2/special-labelle": "ことの",
                "/share2/special-kicks": "シャンク",
                "/share2/season-nook": "たぬきショッピング（シーズン）",
                "/share2/season-fish": "魚釣り大会",
                "/share2/season-bug": "虫取り大会",
                "/share2/season-fireworks": "花火大会",
                "/share2/season-festivale": "カーニバル",
                "/share2/season-spring": "はるのわかたけ",
                "/share2/season-sakura": "さくらのはなびら",
                "/share2/season-easter": "イースター",
                "/share2/season-mayday": "メーデー",
                "/share2/season-museum": "国際ミュージアムデー",
                "/share2/season-wedding": "ジューンブライド",
                "/share2/season-summer": "なつのかいがら",
                "/share2/season-fall": "どんぐり/まつぼっくり",
                "/share2/season-halloween": "ハロウィン",
                "/share2/season-mushroom": "キノコ",
                "/share2/season-maple": "もみじのはっぱ",
                "/share2/season-turkey": "サンクスギビングデー",
                "/share2/season-toy": "クリスマス",
                "/share2/season-winter": "ゆきのけっしょう",
                "/share2/season-festive": "オーナメント",
                "/share2/season-countdown": "カウントダウン",
                "/share2/season-birthday": "誕生日",
                "/share2/season-mother": "ははシリーズ",
                "/share2/reactions": "リアクション",
                "/share2/achievements": "たぬきマイレージ",
                "/share2/versions-170": "1.7.0",
                "/share2/versions-160": "1.6.0",
                "/share2/versions-150": "1.5.0",
                "/share2/versions-140": "1.4.0"
              };
              context.html = context.html.replace(
                /content="【あつ森ガチコンプ】アイテムの取得状況を管理・共有できるウェブアプリ"/g,
                `content="${categories[context.route]} | あつ森ガチコンプ"`
              );
              context.html = context.html.replace(
                /<script data-spa="true">(.*?)<\/script>/,
                ""
              );
              return context;
            }
          })
        ]
      };
    }
  }
};

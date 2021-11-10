const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin");
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

const categories = {
  "/shares": "取得状況",
  "/share2/housewares-all": "すべての家具",
  "/share2/housewares": "家具",
  "/share2/housewares-miscellaneous": "小物",
  "/share2/housewares-wallmounted": "壁かけ",
  "/share2/housewares-ceiling": "天井",
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
  "/share2/gyroids": "かせき",
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
  "/share2/special-fishmodels": "魚の模型",
  "/share2/special-bugmodels": "虫の模型",
  "/share2/special-art": "美術品",
  "/share2/special-saharah": "ローラン壁紙/床/ラグ",
  "/share2/special-saharah-commune": "新ローラン壁紙/床/ラグ",
  "/share2/special-kicks": "シャンク",
  "/share2/special-labelle": "ケイトシリーズ",
  "/share2/special-celeste": "フーコレシピ",
  "/share2/special-gulliver": "ジョニー",
  "/share2/special-gullivarrr": "海賊シリーズ",
  "/share2/special-pascal": "マーメイドシリーズ",
  "/share2/special-redd-commune": "いなりくじ（パニー島）",
  "/share2/special-redd-fireworks": "いなりくじ（花火大会）",
  "/share2/special-katrina": "ハッケミィ家具",
  "/share2/special-brewster": "マスター家具",
  "/share2/special-radio": "ラジオ体操",
  "/share2/special-kappn": "かっぺいの離島",
  "/share2/season-nook": "たぬきショッピング（シーズン）",
  "/share2/season-fish": "魚釣り大会",
  "/share2/season-kappn": "虫取り大会",
  "/share2/season-fireworks": "花火大会",
  "/share2/season-festivale": "カーニバル",
  "/share2/season-spring": "はるのわかたけ",
  "/share2/season-shamrock": "シャムロックデー",
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
  "/share2/nookpoints": "タヌポイント",
  "/share2/hhp-office": "タクミライフ",
  "/share2/hhp-cafe": "カフェ",
  "/share2/hhp-lottie": "タクミ",
  "/share2/hhp-niko": "ニコ",
  "/share2/hhp-wardell": "ナッティー",
  "/share2/hhp-bottles": "メッセージボトル（ハピパラ・かっぺい離島）",
  "/share2/hhp-kk": "とたけけフェス",
  "/share2/versions-200": "2.0.0",
  "/share2/versions-1110": "1.11.0",
  "/share2/versions-1100": "1.10.0",
  "/share2/versions-190": "1.9.0",
  "/share2/versions-180": "1.8.0",
  "/share2/versions-170": "1.7.0",
  "/share2/versions-160": "1.6.0",
  "/share2/versions-150": "1.5.0",
  "/share2/versions-140": "1.4.0",
  "/share2/exchange": "欲しいもの＆配布可",
};

const routes = Object.keys(categories);

module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/acnh-gachi-complete/" : "/",
  outputDir: "docs",
  pages: {
    index: {
      entry: "src/main.js",
      title: "あつ森ガチコンプ",
    },
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, "docs"),
            renderer: new Renderer({
              maxConcurrentRoutes: 4,
            }),
            routes: routes,
            postProcess(context) {
              context.html = context.html.replace(
                /content="【あつ森ガチコンプ】アイテムの取得状況を管理・共有できるウェブアプリ"/g,
                `content="${categories[context.route]} | あつ森ガチコンプ"`
              );
              context.html = context.html.replace(
                /<script data-spa="true">(.*?)<\/script>/,
                ""
              );
              return context;
            },
          }),
        ],
      };
    }
  },
};

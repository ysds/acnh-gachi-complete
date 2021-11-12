const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin");
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const { navsFlat } = require("./src/utils/navs");

const categories = {
  "/shares": "取得状況",
}

Object.keys(navsFlat).forEach(id => {
  if (navsFlat[id].text) {
    categories[`/share2/${id}`] = navsFlat[id].text;
  }
});

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

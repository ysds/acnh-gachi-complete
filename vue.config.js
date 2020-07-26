module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/acnh-gachi-complete/" : "/",
  outputDir: "docs",
  pages: {
    index: {
      entry: "src/main.js",
      title: "あつ森コレクション"
    }
  }
};

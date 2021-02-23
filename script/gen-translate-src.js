const fs = require("fs");
const path = require("path");
const extractZip = require("extract-zip");
const zstd = require("node-zstandard");
const sarcExtractor = require("sarc-extractor");
const msbt2json = require("msbt2json");

const msbtZipPath = process.argv[2];
if (!msbtZipPath) {
  console.log(
    "Usage: node ./script/gen-translate-src <MSBT zip archive file path>"
  );
  return;
}

// Zstdファイル別のJSONファイルコピー先定義(./data/translation-src/のサブディレクトリにコピー)
const targetZstd = require("./gen-translate-src.json");

// Zipファイルの展開先ディレクトリ
const unzipDir = path.join(
  path.dirname(msbtZipPath),
  path.basename(msbtZipPath, path.extname(msbtZipPath))
);

(async () => {
  // Zipファイルを展開する
  await extractZip(msbtZipPath, { dir: unzipDir });
  // Zstandard -> sarc -> mtbs -> json -> translation-srcへコピーする
  await readSarcSarcFiles(unzipDir, async zsFilePath => {
    // JSONファイルコピー先定義があるファイルのみ展開処理する
    const jsonCopyDest = targetZstd[path.basename(zsFilePath)];
    if (jsonCopyDest) {
      await decompressZstd(zsFilePath, jsonCopyDest);
    }
  });
  // Zipファイルの展開先ディレクトリを削除する
  fs.rmdir(unzipDir, { recursive: true }, () => {
    console.log("Finish.");
  });
})();

async function readSarcSarcFiles(dirPath, callback) {
  const dirents = await fs.promises.readdir(dirPath, {
    withFileTypes: true
  });
  for (const dirent of dirents) {
    const filePath = path.join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      await readSarcSarcFiles(filePath, callback);
    } else if (path.extname(filePath).toLowerCase() === ".zs") {
      await callback(filePath);
    }
  }
}

async function decompressZstd(zsFilePath, jsonCopyDest) {
  return new Promise(res => {
    const outputFile = path.join(
      path.dirname(zsFilePath),
      path.basename(zsFilePath, path.extname(zsFilePath))
    );
    zstd.decompress(zsFilePath, outputFile, (err, result) => {
      if (err) {
        throw err;
      } else if (path.extname(result).toLowerCase() === ".sarc") {
        extractSarc(result, jsonCopyDest);
      }
      res();
    });
  });
}

function extractSarc(sarcFilePath, jsonCopyDest) {
  sarcExtractor
    .extract(sarcFilePath)
    .filter(filePath => path.extname(filePath).toLowerCase() === ".msbt")
    .forEach(msbtFilePath => {
      convertMsbt(msbtFilePath, jsonCopyDest);
    });
}

function convertMsbt(msbtFilePath, jsonCopyDest) {
  const jsonFileName = path.format({
    name: path.basename(msbtFilePath, path.extname(msbtFilePath)),
    ext: ".json"
  });

  // コピー先定義があるファイルのみ変換する
  const destDir = jsonCopyDest[jsonFileName];
  if (destDir !== undefined) {
    const jsonFilePath = msbt2json.convert(msbtFilePath);
    const destFile = path.join("./data/translation-src", destDir, jsonFileName);
    fs.copyFileSync(jsonFilePath, destFile);
    console.log("Output: " + destFile);
  }
}

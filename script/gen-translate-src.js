const fs = require("fs");
const path = require("path");
const extractZip = require("extract-zip");
const zstd = require("node-zstandard");
const sarcExtractor = require("sarc-extractor");
const msbt2json = require("msbt2json");

const msbtZipPath = path.resolve("", process.argv[2] || "./msbt.zip");

// Zipファイルの存在チェック
try {
  fs.accessSync(msbtZipPath);
} catch (err) {
  console.error(
    `No file: "${msbtZipPath}".\nUsage: node ./script/gen-translate-src <MSBT zip file path> (default: "./msbt.zip")'>`
  );
  process.exit(1);
}

// Zipファイルの展開先ディレクトリ
const unzipDir = path.join(
  path.dirname(msbtZipPath),
  path.basename(msbtZipPath, path.extname(msbtZipPath))
);

(async () => {
  // 処理結果フラグ
  let result = true;
  // ZSファイル別のJSONファイルコピー先定義(./data/translation-src/のサブディレクトリにコピー)
  const targetZstd = require("./gen-translate-src.json");
  // Zipファイルを展開する
  await extractZip(msbtZipPath, { dir: unzipDir });
  // Zstandard -> sarc -> mtbs -> json -> translation-srcへコピーする
  await readSarcSarcFiles(unzipDir, async zsFilePath => {
    const zsFileName = path.basename(zsFilePath);
    const jsonCopyDest = targetZstd[zsFileName];
    // JSONファイルコピー先定義があるファイルのみ展開処理する
    if (jsonCopyDest) {
      await decompressZstd(zsFilePath, jsonCopyDest);
      // 見つからなかったJSONファイル名を表示
      for (const key in jsonCopyDest) {
        console.log("No file: " + zsFileName + " > " + key);
        result = false;
      }
      delete targetZstd[zsFileName];
    }
  });
  // 見つからなかったZSファイル名を表示
  for (const key in targetZstd) {
    console.log("No file: " + key);
    result = false;
  }
  // Zipファイルの展開先ディレクトリを削除する
  fs.rmdir(unzipDir, { recursive: true }, () => {
    console.log(result ? "Success." : "Error.");
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
    delete jsonCopyDest[jsonFileName];
  }
}

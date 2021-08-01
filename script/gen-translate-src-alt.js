const fs = require("fs");
const path = require("path");
const extractZip = require("extract-zip");

const msbtJsonZipPath = path.resolve(
  "",
  process.argv[2] || "./acnh-data-master-MSBT-JSON_merged.zip"
);

// Zipファイルの存在チェック
try {
  fs.accessSync(msbtJsonZipPath);
} catch (err) {
  console.error(
    `No file: "${msbtJsonZipPath}".\nUsage: node ./script/gen-translate-src-alt <merged-json zip file path> (default: "./acnh-data-master-MSBT-JSON_merged.zip")'>`
  );
  process.exit(1);
}

// Zipファイルの展開先ディレクトリ
const unzipDir = path.join(
  path.dirname(msbtJsonZipPath),
  path.basename(msbtJsonZipPath, path.extname(msbtJsonZipPath))
);

(async () => {
  // 処理結果フラグ
  let result = true;
  // ZSファイル別のJSONファイルコピー先定義(./data/translation-src/のサブディレクトリにコピー)
  const targetZstd = require("./gen-translate-src.json");
  // Zipファイルを展開する
  await extractZip(msbtJsonZipPath, { dir: unzipDir });
  // MergedJson -> JPjaのみ抜き出し -> translation-srcへコピーする
  await readSubDirs(unzipDir, async dirPath => {
    const zsFileName = path.basename(path.basename(dirPath)) + "_JPja.sarc.zs";
    const jsonCopyDest = targetZstd[zsFileName];
    // JSONファイルコピー先定義があるファイルのみ処理する
    if (jsonCopyDest) {
      await readMergedJsonFiles(dirPath, jsonCopyDest);
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

async function readSubDirs(dirPath, callback) {
  const dirents = await fs.promises.readdir(dirPath, {
    withFileTypes: true
  });
  for (const dirent of dirents) {
    const filePath = path.join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      await readSubDirs(filePath, callback);
      await callback(filePath);
    }
  }
}

async function readMergedJsonFiles(dirPath, jsonCopyDest) {
  const dirents = await fs.promises.readdir(dirPath, {
    withFileTypes: true
  });
  for (const dirent of dirents) {
    const filePath = path.join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      await readMergedJsonFiles(filePath, jsonCopyDest);
    } else if (path.extname(filePath).toLowerCase() === ".json") {
      await convertJson(filePath, jsonCopyDest);
    }
  }
}

function convertJson(jsonFilePath, jsonCopyDest) {
  const destFileName = path.format({
    name: path.basename(jsonFilePath, ".msbt.json"),
    ext: ".json"
  });

  // コピー先定義があるファイルのみ変換する
  const destDir = jsonCopyDest[destFileName];
  if (destDir !== undefined) {
    // 変換時にルビ情報は全て削除する。
    // ただし、NookMilage_List.json（たぬきマイレージ）はルビ情報を残す必要があるので、対応は保留として変換しない。
    if (destFileName != "NookMilage_List.json") {
      const src = require(jsonFilePath);
      const dest = {};
      src.forEach(element => {
        // ルビを削除
        const value = element.locale.JPja.replace(/\{\{[^}]+\}\}/g, "");
        dest[element.label] = value;
      });
      const destFile = path.join(
        "./data/translation-src",
        destDir,
        destFileName
      );
      fs.writeFileSync(destFile, JSON.stringify(dest, null, 2));
    }
    delete jsonCopyDest[destFileName];
  }
}

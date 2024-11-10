import * as fs from "node:fs"; // nodeJS의 파일 시스템 모듈(fs)

function loadFile(filePath) {
  return fs.readFileSync(filePath, "utf-8").trim();
}

export default loadFile;

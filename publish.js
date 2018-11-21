const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const deleteFile = fileName => {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    return;
  }

  fs.unlinkSync(filePath);
};
const execOptions = { stdio: "inherit" };
const isDirSync = aPath => {
  try {
    return fs.statSync(aPath).isDirectory();
  } catch (e) {
    if (e.code === "ENOENT") {
      return false;
    } else {
      throw e;
    }
  }
};

console.log("🔄 Please wait...\n");

execSync(`ng build --prod`, execOptions); // --prod 标志也会默认使用 AOT 编译 --build-optimizer --environment=prod
// npm install source-map-explorer --save-dev
// ng build --prod --source-map
// ls dist/*.bundle.js
// node_modules/.bin/source-map-explorer dist/main.*.bundle.js

fs.copyFileSync("dist/EnTourUI/styles.css", "dist/EnTourUI/assets/styles.css");
if (!isDirSync("dist/EnTourUI/scripts")) {
  fs.mkdirSync("dist/EnTourUI/scripts");
}
fs.copyFileSync("dist/EnTourUI/main.js", "dist/EnTourUI/Scripts/main.js");
fs.copyFileSync(
  "dist/EnTourUI/polyfills.js",
  "dist/EnTourUI/Scripts/polyfills.js"
);
fs.copyFileSync("dist/EnTourUI/runtime.js", "dist/EnTourUI/Scripts/runtime.js");
deleteFile("dist/EnTourUI/assets/bootstrap.css");
deleteFile("dist/EnTourUI/assets/bootstrap.js");
deleteFile("dist/EnTourUI/assets/jquery.js");

fs.readdir("dist/EnTourUI", function(err, items) {
  for (var i = 0; i < items.length; i++) {
    var fileOrFolder = "dist/EnTourUI/" + items[i];
    if (!isDirSync(fileOrFolder)) {
      deleteFile(fileOrFolder);
    }
  }
});
console.log("Build production successfully!\n");

fs.readdir("dist/EnTourUI/assets", function(err, items) {
  for (var i = 0; i < items.length; i++) {
    var source = "dist/EnTourUI/assets/" + items[i];
    var dest =
      "F:/ENDev.TOUREAST.COM/DesktopModules/EnTourModule/assets/" + items[i];
    fs.copyFileSync(source, dest);
  }
});

fs.readdir("dist/EnTourUI/scripts", function(err, items) {
  for (var i = 0; i < items.length; i++) {
    var source = "dist/EnTourUI/scripts/" + items[i];
    var dest =
      "F:/ENDev.TOUREAST.COM/DesktopModules/EnTourModule/scripts/" + items[i];
    fs.copyFileSync(source, dest);
  }
});

console.log("Update dnndev successfully!\n");

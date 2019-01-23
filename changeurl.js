const fs = require("fs");
const path = require("path");
var readline = require("readline");
const { execSync } = require("child_process");
const ModifyAPIAddressAsync = destURL => {
  var myInterface = readline.createInterface({
    input: fs.createReadStream("src/app/en-tour.service.ts")
  });
  var destline = "";
  myInterface.on("line", function(line) {
    if (line.indexOf("siteIPToPublish = ") > 0) {
      destline = line;
    }
  });

  fs.readFile("src/app/en-tour.service.ts", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    var newValue = data.replace(
      destline,
      "private siteIPToPublish = '" + destURL + "';"
    );
    fs.writeFile("src/app/en-tour.service.ts", newValue, "utf-8", function(
      err
    ) {
      if (err) throw err;
      console.log("filelistAsync complete");
    });
  });
};
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
if (process.argv.length == 3) {
  if (process.argv[2] == "-t") {
    ModifyAPIAddressAsync("http://192.168.168.117:8019");
  } else if (process.argv[2] == "-d") {
    ModifyAPIAddressAsync("http://dnndev.me");
  } else if (process.argv[2] == "-p") {
    ModifyAPIAddressAsync("https://en.toureast.com");
  }
}
console.log("🔄 done\n");

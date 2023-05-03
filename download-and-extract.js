const https = require("https");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

const downloadUrl = "https://owncloud.tuwien.ac.at/index.php/s/t3g1Mdoqejf2Ggp/download";
const destinationPath = "./public.zip";
const publicFolderPath = "./public";
const macosxFolderPath = "./__MACOSX";

function folderExists(folderPath) {
  return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory();
}

async function removeFolder(folderPath) {
  const contents = await fs.promises.readdir(folderPath);

  for (const item of contents) {
    const itemPath = path.join(folderPath, item);
    const stats = await fs.promises.lstat(itemPath);

    if (stats.isDirectory()) {
      await removeFolder(itemPath);
    } else {
      await fs.promises.unlink(itemPath);
    }
  }

  await fs.promises.rmdir(folderPath);
}


function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(resolve);
      });
    });

    request.on("error", (error) => {
      fs.unlink(dest);
      reject(error);
    });

    file.on("error", (error) => {
      fs.unlink(dest);
      reject(error);
    });
  });
}

async function extractZipFile(zipPath, outputPath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: outputPath }))
      .on("close", resolve)
      .on("error", reject);
  });
}

(async () => {
  if (folderExists(publicFolderPath)) {
    console.log("Public folder already exists. Skipping download and extraction.");
  } else {
    try {
      console.log("Creating public folder...");
      fs.mkdirSync(publicFolderPath);

      console.log("Downloading zip file...");
      await downloadFile(downloadUrl, destinationPath);
      console.log("Download complete.");

      console.log("Extracting zip file...");
      await extractZipFile(destinationPath, './');
      console.log("Extraction complete.");

      console.log("Removing zip file...");
      fs.unlinkSync(destinationPath);
      console.log("Zip file removed.");

      if (folderExists(macosxFolderPath)) {
        console.log("Removing __MACOSX folder...");
        await removeFolder(macosxFolderPath);
        console.log("__MACOSX folder removed.");
      }

      console.log("Done.");
    } catch (error) {
      console.error("An error occurred:", error);
      process.exit(1);
    }
  }
})();
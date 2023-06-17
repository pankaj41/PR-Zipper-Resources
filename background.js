import JSZip from "jszip";

// ----------- Listener --------------
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "downloadFile") {
    const { files, repoName, prName } = message;

    const zip = new JSZip();

    // Function to download a file and add it to the zip
    function addFileToZip(file) {
      return new Promise((resolve, reject) => {
        fetch(file.raw_url)
          .then((response) => {
            return response.blob();
          })
          .then((data) => {
            // Get the file name from the URL
            const fileName = file.filename;

            // Add the file to the zip
            zip.file(fileName, data);

            resolve();
          })
          .catch((error) => {
            reject(
              new Error(`Failed to download ${file.filename}. ${error.message}`)
            );
          });
      });
    }

    // Function to trigger the zip file download
    async function downloadZip() {
      //   console.log("zip", zip);

      zip.generateAsync({ type: "blob" }).then(function (content) {
        const blobToB64 = blobToBase64(content);
        blobToB64.then((something) => {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                message: "Hello from background.js!",
                info: something,
                repo: repoName,
                pullNumber: prName,
              });
            }
          );
        });
      });
    }

    // Loop through the PR file URLs and add them to the zip
    const promises = files.map(addFileToZip);

    // Wait for all files to be added to the zip
    Promise.all(promises)
      .then(downloadZip)
      .catch((error) => {
        console.error(error);
        // Handle the error appropriately
      });
  }

  if (message.message === "Message from popup.js") {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          message: "Message from popup.js",
          info: message.info,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (message.message === "Message from popup.js, please remove PAT") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "Message from popup.js, please remove PAT",
      });
    });
  }
});

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

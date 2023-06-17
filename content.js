// content.js

import { saveAs } from "file-saver";

let downloadTriggered = false;
let targetElement;
let PAT_Token = "";

// Retrieve the stored data from chrome.storage
chrome.storage.local.get("data", function (data) {
  var storedData = data.data;
  if (storedData) {
    PAT_Token = storedData;
  }
});

function handleDOMChanges(mutationsList, observer) {
  const isFileURL = window.location.href.includes("pull"); //does url contains word "pull"

  if (!isFileURL) {
    return;
  }

  setTimeout(afterTimeOut, 500);

  function afterTimeOut() {
    if (isFileURL) {
      const navElement = document.querySelectorAll(
        "nav.tabnav-tabs.d-flex.overflow-auto"
      );
      targetElement = navElement[0];

      //styling of target element starts
      var linkElement = document.createElement("a");
      linkElement.href = "";
      linkElement.textContent = "Download all changed files";
      linkElement.id = "Download all files";

      linkElement.style.color = "grey";
      linkElement.style.margin = "10px 10px 0px 10px";

      linkElement.addEventListener("mouseover", function () {
        linkElement.style.color = "green";
        linkElement.style.textDecoration = "none";
      });

      linkElement.addEventListener("mouseout", function () {
        linkElement.style.color = "grey";
        linkElement.style.textDecoration = "none";
      });
      //styling of target element ends

      if (targetElement) {
        if (!document.getElementById("Download all files")) {
          observer.disconnect();
          targetElement.appendChild(linkElement);
        }

        const downloadAll = document.getElementById("Download all files");

        downloadAll.addEventListener("click", async () => {
          if (!downloadTriggered) {
            downloadTriggered = true;

            setTimeout(() => {
              downloadTriggered = false;
            }, 1000);

            if (PAT_Token !== "" && PAT_Token) {
              const token = PAT_Token;

              const url = window.location.href;
              const urlParts = url.split("/");

              const owner = urlParts[3];
              const repo = urlParts[4];
              const pullNumber = urlParts[6];

              fetch(
                `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  const files = [];

                  data.forEach((file) => {
                    files.push(file);
                  });

                  sendMessageToBackgroundScript({
                    action: "downloadFile",
                    files: files,
                    repoName: repo,
                    prName: pullNumber,
                  });
                })
                .catch((error) => {
                  console.log("chck", error);
                });
            } else {
              alert(
                "Please first enter token, by clicking on this extension's icon."
              );
            }
          }
        });

        observer.observe(document, observerConfig);
      }
    }
  }
}

const observer = new MutationObserver(handleDOMChanges);

const observerConfig = {
  childList: true, // Watch for changes in the child elements
  subtree: true, // Watch for changes in the entire subtree
};

observer.observe(document, observerConfig);

//-------- Functions ---------------

// Function to send a message to the background script
function sendMessageToBackgroundScript(message) {
  chrome.runtime.sendMessage(message);
}

// Convert Base64 string to Blob
function base64ToBlob(base64) {
  const parts = base64.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

//-------- Listener ---------------

chrome.runtime.onMessage.addListener(function (request) {
  const message = request.message;

  if (message === "Hello from background.js!") {
    const base64ToB = base64ToBlob(request.info);
    saveAs(base64ToB, `${request.repo}-${request.pullNumber}.zip`);
  }

  if (message === "Message from popup.js") {
    chrome.storage.local.set({ data: request.info });
    PAT_Token = request.info;
  }

  if (message === "Message from popup.js, please remove PAT") {
    chrome.storage.local.remove("data", function () {});
    PAT_Token = "";
  }
});

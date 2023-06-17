document.addEventListener("DOMContentLoaded", () => {
  var form = document.getElementById("PATForm");
  var removePAT = document.getElementById("remove-PAT");
  var learnMore = document.getElementById("learnMore");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    var inputValue = document.getElementById("PAT").value;
    if (inputValue !== "") {
      await chrome.runtime.sendMessage({
        message: "Message from popup.js",
        info: inputValue,
      });
      window.close();
    } else {
      alert("PAT value cannot be submitted empty");
    }
  });

  removePAT.addEventListener("click", async function (event) {
    event.preventDefault();
    await chrome.runtime.sendMessage({
      message: "Message from popup.js, please remove PAT",
    });
    window.close();
  });

  learnMore.addEventListener("click", async function (event) {
    event.preventDefault();
    await chrome.runtime.sendMessage({
      message: "Message from popup.js, learn more",
    });
    window.close();
  });
});

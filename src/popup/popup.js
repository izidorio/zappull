// import manifest from "../../manifest.json" with { type: "json" }; verificar a versão do chrome
import { readNumberNameUsers } from "../scripts/read-number-name-users.js";
import { previewUserGroup } from "../scripts/preview-users-group.js";
import { exportUserGroup } from "../scripts/export-users-group.js";

(() => {
  document.querySelector(".tag-version").innerHTML = "Versão 2.0.1";

  const btnCsv = document.getElementById("btn-csv");
  const btnPdf = document.getElementById("btn-pdf");
  const btnCopy = document.getElementById("btn-copy");

  btnCsv.addEventListener("click", async (event) => {
    event.preventDefault();

    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const [tab] = tabs;

      if (!tab.url.startsWith("https://web.whatsapp.com/")) {
        alert("esse recursos só funciona ná página do WhatsApp Web");
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: exportUserGroup,
      });
    });
  });

  btnPdf.addEventListener("click", async (event) => {
    event.preventDefault();

    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const [tab] = tabs;

      if (!tab.url.startsWith("https://web.whatsapp.com/")) {
        alert("esse recursos só funciona ná página do WhatsApp Web");
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: previewUserGroup,
      });
    });
  });

  btnCopy.addEventListener("click", async (event) => {
    event.preventDefault();

    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const [tab] = tabs;

      if (!tab.url.startsWith("https://web.whatsapp.com/")) {
        alert("esse recursos só funciona ná página do WhatsApp Web");
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: readNumberNameUsers,
      });
    });
  });
})();

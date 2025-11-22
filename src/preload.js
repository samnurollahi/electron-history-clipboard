const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("list");

  ipcRenderer.on("change-clipboard", (e, clipboard) => {
    // console.log("change-clipboard");
    list.insertAdjacentHTML(
      "beforeend",
      `<div class="item-list">
        <p>${clipboard.slice(0, 30)}</p>

        <span class="material-symbols-outlined" onclick="copyText('${clipboard}')"> file_copy </span>
      </div>`
    );
  });
});

import { check } from "./tauri.js";
import { get_app_version } from "./utils.js";
import { ELEMENT_DISPLAYS, POPUPS } from './globals.js';

export async function check_update() {
  try {
    const update = await check();
    if (update) {
      const result = await get_app_version();
      const latest_version = update.version;
      const current_version = result;
      ELEMENT_DISPLAYS.new_version.innerHTML = "A new version of PolyUploader is now available: <b>" + latest_version +"<b>";
      ELEMENT_DISPLAYS.current_version.innerHTML = "(Current version: <b>" + current_version + "</b>)";
      POPUPS.update.classList.remove("hidden");
      ELEMENT_DISPLAYS.polyuploader_version_text.innerHTML = "PolyUploader <strong>" + current_version + "</strong> (update available: <strong>" + latest_version + "</strong>)";

      POPUPS.new_version_download.addEventListener("click", async function () {
        POPUPS.new_version_download.innerHTML = 'Downloading the update <i class="fas fa-spinner fa-spin"></i>';
        document.body.classList.add("cursor-not-allowed", "pointer-events-none")

        let downloaded = 0;
        let content_length = 0;

        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case 'Started':
              content_length = event.data.contentLength;
              break;
            case 'Progress':
              downloaded += event.data.chunkLength;
              const percentage = Math.round((downloaded / content_length) * 100);
              POPUPS.new_version_download.innerHTML = 'Downloading the update (' + percentage + '%) <i class="ml-1 fas fa-spinner fa-spin"></i>';
              break;
            case 'Finished':
              POPUPS.new_version_download.innerHTML = 'Installing the update <i class="fas fa-spinner fa-spin"></i>';
              break;
          };
        });
      });

      POPUPS.update.addEventListener("click", function (event) {
        if (event.target === POPUPS.update && localStorage.getItem("close_popups_setting") === "true") {
          POPUPS.update.classList.add("hidden");
        }
      });
      document.getElementById("window_title").textContent = "PolyUploader - " + current_version;
    }
  } catch (error) {
    console.error('Error checking or installing update:', error);
  }
}
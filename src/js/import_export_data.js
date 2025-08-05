import { invoke, save, open } from './tauri.js';
import { BUTTONS, POPUPS, ELEMENT_DISPLAYS } from './globals.js';

export function init_import_export() {
    async function export_data() {
      try {
        const open_path = await save({filters: [{name: 'PolyUploader data', extensions: ['zip']}]});
        if (!open_path) return
        await invoke("create_zip", { zipPath: open_path })
      } catch (error) {
        console.error("Error saving zip file: ", error);
      };
    };
    
    async function import_data() {
      try {
        const save_path = await open({filters: [{name: 'PolyUploader data', extensions: ['zip']}]});
        if (!save_path) return
        await invoke("extract_zip", { zipPath: save_path })
        POPUPS.settings.classList.add("hidden");
        window.location.reload();
      } catch (error) {
        console.error("Error extracting zip file: ", error);
      };
    };
    
    BUTTONS.export_popup.addEventListener("click", function () {
      ELEMENT_DISPLAYS.import_export_container.classList.remove("hidden");
      if (POPUPS.export.classList.contains("hidden")) {
        POPUPS.export.classList.remove("hidden");
        POPUPS.import.classList.add("hidden");
      } else {
        POPUPS.export.classList.add("hidden");
        POPUPS.import.classList.add("hidden");
      }
    });
    
    BUTTONS.import_popup.addEventListener("click", function () {
      ELEMENT_DISPLAYS.import_export_container.classList.remove("hidden");
      if (POPUPS.import.classList.contains("hidden")) {
        POPUPS.import.classList.remove("hidden");
        POPUPS.export.classList.add("hidden");
      } else {
        POPUPS.import.classList.add("hidden");
        POPUPS.export.classList.add("hidden");
      }
      
    });
    
    BUTTONS.export.addEventListener("click", function() {export_data()});
    BUTTONS.import.addEventListener("click", function() {import_data()});
}
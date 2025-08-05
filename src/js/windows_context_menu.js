import { invoke } from './tauri.js';
import { SELECTS, ELEMENT_DISPLAYS } from './globals.js';

export function init_windows_context_menu() {
    if (!localStorage.getItem("add_to_context_menu")) {
      localStorage.setItem("add_to_context_menu", "false");
    };
    
    if (localStorage.getItem("add_to_context_menu") == "true") {
      SELECTS.select_box_shell.checked = true;
    };
    
    SELECTS.select_box_shell.addEventListener("change", async () => {
      ELEMENT_DISPLAYS.add_to_context_menu.innerHTML = "Add PolyUploader to the Windows context menu";
      if (SELECTS.select_box_shell.checked) {
        try {
          await invoke('register_polyuploader_context_menu', { action: "add" })
          localStorage.setItem("add_to_context_menu", "true");
        } catch (error) {
          ELEMENT_DISPLAYS.add_to_context_menu.innerHTML = `Add PolyUploader to the Windows context menu<br><p class="text-[#ff2828]"><i class="fa-sharp fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> ${error}</p>`;
          SELECTS.select_box_shell.checked = false;
        };
      } else {
        try {
          await invoke('register_polyuploader_context_menu', { action: "remove" })
          localStorage.setItem("add_to_context_menu", "false");
        } catch (error) {
          ELEMENT_DISPLAYS.add_to_context_menu.innerHTML = `Add PolyUploader to the Windows context menu<br><p class="text-[#ff2828]"><i class="fa-sharpfa-solid fa-circle-exclamation" style="color: #ff2828;"></i> ${error}</p>`;
          SELECTS.select_box_shell.checked = true;
        };
      };
    });
};
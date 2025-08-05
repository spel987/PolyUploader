import { STATE, POPUPS, BUTTONS, ELEMENT_DISPLAYS } from './globals.js';
import { enable_button, check_prohibited_format, display_info, disable_button } from './utils.js'

export function init_drag_drop() {
    function drag_and_drop_hover() {
      if (STATE.upload_mode == "local" && !STATE.set_api_key_popup) {
        POPUPS.upload_container.classList.add("border-4", "p-12", "border-dashed", "border-slate-300");
        POPUPS.upload_container.classList.remove("border", "border-[#4c5666]", "p-8");
      } else if (STATE.upload_mode == "url" || STATE.set_api_key_popup) {
        POPUPS.upload_container.classList.add("bg-red-500/20");
        POPUPS.upload_container.classList.add('animate-wiggle');
    
        setTimeout(function() {
          POPUPS.upload_container.classList.remove('animate-wiggle');
        }, 600);
      }
    };
    
    function drag_and_drop_cancel() {
      POPUPS.upload_container.classList.remove("border-4", "p-12", "bg-red-500/20", "border-dashed", "border-slate-300");
      POPUPS.upload_container.classList.add("border", "border-[#4c5666]", "p-8");
    };
    
    function handle_dragover(event) {
      event.preventDefault();
      if (event.dataTransfer.types.length == 1) {
        if (!STATE.is_dragging_over) {
          STATE.is_dragging_over = true;
          if (POPUPS.upload.classList.contains("hidden")) {
            POPUPS.drag_file_withtout_host.classList.remove("hidden");
            STATE.force_keep_file = 1;
            enable_button(BUTTONS.popup_upload_local, "red", "big");
          } else {
            STATE.force_keep_file = 0;
          };
          requestAnimationFrame(drag_and_drop_hover);
        };
      };
    };
    
    async function handle_drop(event) {
      event.preventDefault();
      STATE.is_dragging_over = false;
      drag_and_drop_cancel();
      POPUPS.drag_file_withtout_host.classList.add("hidden");

      if (document.getElementById("prohibited_format_text")) {
        document.getElementById("prohibited_format_text").remove();
      };
    
      if (STATE.upload_mode == "local" && !STATE.set_api_key_popup && event.dataTransfer.files[0]) {
        STATE.drag_file = event.dataTransfer.files[0];
        let filename = STATE.drag_file.name;
        let size = STATE.drag_file.size;
        STATE.drag_file_name = filename;
        STATE.drag_file_size = size;
    
        if (filename.length > 30) {
            BUTTONS.popup_browse.textContent = filename.substring(0, 30) + "...";
        } else {
            BUTTONS.popup_browse.textContent = filename;
        };

        const { prohibited_format, prohibited_hosts } = await check_prohibited_format(filename);

        BUTTONS.delete_file_input.classList.remove("hidden");
        if (STATE.host && JSON.stringify(STATE.host) !== "[]" && prohibited_format === false && STATE.drag_file_size > 0) {
          enable_button(BUTTONS.popup_upload_local, "red", "big");
        } else if (prohibited_format) {
          disable_button(BUTTONS.popup_upload_local);
          const prohibited_format_text = document.createElement("p");
          prohibited_format_text.classList.add("mb-4", "text-[#ffae00]");
          prohibited_format_text.id = "prohibited_format_text";
          if (STATE.host.length > 1) {
            prohibited_format_text.innerHTML = `<strong><i class="mr-1 fa-sharp-duotone fa-solid fa-ban"></i> Prohibited file format (${prohibited_hosts.join(", ")})</strong>`;
          } else {
            prohibited_format_text.innerHTML = `<strong><i class="mr-1 fa-sharp-duotone fa-solid fa-ban"></i> Prohibited file format</strong>`;
          };
          ELEMENT_DISPLAYS.final_upload_url.prepend(prohibited_format_text);
        }
    
        STATE.is_drag_file = true;
    
        if (POPUPS.upload.classList.contains("hidden")) {
          if (STATE.drag_file_name.length > 30) {
            display_info(`<strong>${STATE.drag_file_name.substring(0, 30) + "..."}</strong> has been successfully loaded. Select one or more hosts to begin uploading.`);
          } else {
            display_info(`<strong>${STATE.drag_file_name}</strong> has been successfully loaded. Select one or more hosts to begin uploading.`);
          };
        };
      };
    };
    
    function handle_dropleave(event) {
      setTimeout(function() {if (!STATE.is_dragging_over) {POPUPS.drag_file_withtout_host.classList.add("hidden")}}, 10);
      STATE.is_dragging_over = false;
      drag_and_drop_cancel();
    };
    
    document.addEventListener('dragover', handle_dragover);
    document.addEventListener('drop', handle_drop);
    document.addEventListener('dragleave', handle_dropleave);
}
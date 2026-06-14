import { invoke, listen } from './tauri.js';
import { HOST_SITES, BUTTONS, SELECTS, ELEMENT_DISPLAYS, POPUPS, INPUTS, STATE } from './globals.js';
import { disabled_upload_button, get_file_name_from_url, disable_button, enable_button, reset_popup, check_prohibited_format, upload_preparation, get_app_version, display_info, reset_upload_profile, apply_alternate_row_colors } from './utils.js';
import { start_upload } from './upload.js';
import { init_history } from './history.js';
import { delete_api_key, init_api_management } from './api.js';
import { init_window } from './window.js';
import { init_windows_context_menu } from './windows_context_menu.js';
import { init_import_export } from './import_export_data.js';
import { check_update } from './check_update.js';
import { init_drag_drop } from './drag_drop.js';
import { init_profiles } from './profiles.js';
import { init_search } from './search.js';
import { init_sort_table } from './sort_table.js';
import { init_onboarding } from './onboarding.js';

document.addEventListener('contextmenu', event => event.preventDefault());

init_history();
init_api_management();
init_window();
init_windows_context_menu();
init_import_export();
check_update();
init_drag_drop();
init_profiles();
init_search();
init_sort_table();
setTimeout(() => {
  init_onboarding();
}, 500);

get_app_version()
  .then((result) => {
    const current_version = result;
    ELEMENT_DISPLAYS.polyuploader_version_text.innerHTML = "PolyUploader <strong>" + current_version + "</strong>";
  })
  .catch((error) => {
    console.error("Error retrieving current app version : " + error);
});

async function create_file_from_rust_stream(file_info, onProgress) {
  const chunkSize = 1024 * 1024;
  let offset = 0;
  const chunks = [];

  while (offset < file_info.size) {
    const length = Math.min(chunkSize, file_info.size - offset);
    const chunk = await invoke("read_file_chunk", {
      path: file_info.path,
      start: offset,
      length,
    });

    chunks.push(new Uint8Array(chunk));
    offset += length;

    if (onProgress) {
      onProgress(offset / file_info.size);
    }
  }

  const blob = new Blob(chunks, { type: file_info.mime_type });
  return new File([blob], file_info.name, {
    type: file_info.mime_type,
    lastModified: Date.now()
  });
};


listen('file_selected', async () => {
  try {
    const file_info = await invoke('get_selected_file');
    
    if (file_info) {
      const file = await create_file_from_rust_stream(file_info, (progress) => {
        display_info(`<strong>Importing file, please wait...</strong> (${(progress * 100).toFixed(2)}%)`);
      });
      
      if (STATE.upload_mode == "local" && !STATE.set_api_key_popup) {
        STATE.drag_file = file;
        let filename = file.name;
        let size = file.size;
        STATE.drag_file_name = filename;
        STATE.drag_file_size = size;
    
        if (filename.length > 30) {
            BUTTONS.popup_browse.textContent = filename.substring(0, 30) + "...";
        } else {
            BUTTONS.popup_browse.textContent = filename;
        };
    
        BUTTONS.delete_file_input.classList.remove("hidden");
    
        if (size > 0) {
          enable_button(BUTTONS.popup_upload_local, "red", "big");
          STATE.force_keep_file = 1;

          if (STATE.drag_file_name.length > 30) {
            display_info(`<strong>${STATE.drag_file_name.substring(0, 30) + "..."}</strong> has been successfully loaded. Select one or more hosts to begin uploading.`);
          } else {
            display_info(`<strong>${STATE.drag_file_name}</strong> has been successfully loaded. Select one or more hosts to begin uploading.`);
          };
        };
    
        STATE.is_drag_file = true;
      };
    };
  } catch (error) {
    console.error("Error retrieving file: ", error);
  };
});

const button_upload_multiple_offset = BUTTONS.multiple_host_popup.offsetTop;
  
function handle_scroll() {
    if (window.scrollY - 250 > button_upload_multiple_offset) {
      BUTTONS.multiple_host_popup.classList.add("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
      BUTTONS.save_selected_host.classList.add("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
      BUTTONS.cancel_selected_host.classList.add("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
    } else {
      BUTTONS.multiple_host_popup.classList.remove("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
      BUTTONS.save_selected_host.classList.remove("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
      BUTTONS.cancel_selected_host.classList.remove("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
    };
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 320) {
    BUTTONS.scroll_top.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
    BUTTONS.scroll_top.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
  } else if (window.scrollY < 320) {
    BUTTONS.scroll_top.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
    BUTTONS.scroll_top.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
  }
});

BUTTONS.scroll_top.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

window.addEventListener("scroll", handle_scroll);

ELEMENT_DISPLAYS.tbody_of_providers.innerHTML = "";

ELEMENT_DISPLAYS.rows_of_providers.forEach((row, index) => {
  const original_class = index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
  row.classList.remove("bg-slate-800", "bg-gray-900");
  row.classList.add(original_class, "alternate-row");
  ELEMENT_DISPLAYS.tbody_of_providers.appendChild(row);
});

BUTTONS.popup_browse.addEventListener("click", function () {
  INPUTS.popup_file.click();
});

INPUTS.url_upload.addEventListener("input", async function () {
  const filename_url = get_file_name_from_url(INPUTS.url_upload.value)

  if (STATE.host && JSON.stringify(STATE.host) !== "[]" && INPUTS.url_upload.value != "" && INPUTS.url_upload.value.startsWith("https://") || INPUTS.url_upload.value.startsWith("http://")) {
    enable_button(BUTTONS.popup_upload_url, "red", "big")
  } else if (INPUTS.url_upload.value == "") {
    disable_button(BUTTONS.popup_upload_url);
  }

  if (document.getElementById("prohibited_format_text")) {
    document.getElementById("prohibited_format_text").remove();
  };

  if (filename_url) {
    const { prohibited_format, prohibited_hosts } = await check_prohibited_format(filename_url, STATE.host);

    if (prohibited_format) {
      disable_button(BUTTONS.popup_upload_url);
      ELEMENT_DISPLAYS.filename_url_info.classList.add("hidden");
      const prohibited_format_text = document.createElement("p");
      prohibited_format_text.classList.add("mb-5", "text-[#ffae00]");
      prohibited_format_text.id = "prohibited_format_text";
      if (STATE.host.length > 1) {
        prohibited_format_text.innerHTML = `<strong><i class="mr-1 ph-duotone ph-prohibit"></i> Prohibited file format (${prohibited_hosts.join(", ")})</strong>`;
      } else {
        prohibited_format_text.innerHTML = `<strong><i class="mr-1 ph-duotone ph-prohibit"></i> Prohibited file format</strong>`;
      };
      ELEMENT_DISPLAYS.final_upload_url.prepend(prohibited_format_text);
      ELEMENT_DISPLAYS.final_upload_url.classList.remove("hidden");
    } else {
      ELEMENT_DISPLAYS.filename_url_info.classList.remove("hidden");
      ELEMENT_DISPLAYS.filename_url_info.innerHTML = `This file will be upload: <strong>${filename_url}</strong>`;
    };
  } else {
    ELEMENT_DISPLAYS.filename_url_info.classList.add("hidden");
  };
});

INPUTS.popup_file.addEventListener("change", async function () {
  const filename = INPUTS.popup_file.files[0].name;
  STATE.is_drag_file = false;

  if (document.getElementById("prohibited_format_text")) {
    document.getElementById("prohibited_format_text").remove();
  };

  if (filename.length > 30) {
    BUTTONS.popup_browse.textContent = filename.substring(0, 30) + "...";
  } else {
    BUTTONS.popup_browse.textContent = filename;
  };

  BUTTONS.delete_file_input.classList.remove("hidden");

  const { prohibited_format, prohibited_hosts } = await check_prohibited_format(filename, STATE.host);

  if (STATE.host && JSON.stringify(STATE.host) !== "[]" && prohibited_format === false && INPUTS.popup_file.files[0].size > 0) {
    enable_button(BUTTONS.popup_upload_local, "red", "big");
  } else if (prohibited_format) {
    disable_button(BUTTONS.popup_upload_local);
    const prohibited_format_text = document.createElement("p");
    prohibited_format_text.classList.add("mb-4", "text-[#ffae00]");
    prohibited_format_text.id = "prohibited_format_text";
    if (STATE.host.length > 1) {
      prohibited_format_text.innerHTML = `<strong><i class="mr-1 ph-duotone ph-prohibit"></i> Prohibited file format (${prohibited_hosts.join(", ")})</strong>`;
    } else {
      prohibited_format_text.innerHTML = `<strong><i class="mr-1 ph-duotone ph-prohibit"></i> Prohibited file format</strong>`;
    };
    ELEMENT_DISPLAYS.final_upload_url.prepend(prohibited_format_text);
    ELEMENT_DISPLAYS.final_upload_url.classList.remove("hidden");
  }
});

POPUPS.upload.addEventListener("click", function (event) {
  if (event.target === POPUPS.upload && localStorage.getItem("close_popups_setting") === "true") {
    STATE.controller.abort();
    STATE.controller = new AbortController();
    
    POPUPS.upload.classList.add("hidden");
    BUTTONS.popup_new_profile.classList.add("hidden");
    BUTTONS.popup_new_profile.innerHTML = `<i class="ph-bold ph-plus"></i>`;
  };
});

BUTTONS.upload_local_file.addEventListener("click", function () {
  if (STATE.upload_mode != "local") {
    STATE.upload_mode = "local";
    BUTTONS.upload_local_file.className = "mr-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/60 border border-indigo-300/30 transition duration-3.5 rounded-lg cursor-not-allowed pointer-events-none text-white";
    BUTTONS.upload_from_url.className = "ml-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/20 border border-indigo-300/20 hover:bg-indigo-500/50 transition text-indigo-100 duration-3.5 rounded-lg hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.15)] active:scale-[1.02]";
    ELEMENT_DISPLAYS.local_upload_file.classList.remove("hidden");
    ELEMENT_DISPLAYS.url_upload_file.classList.add("hidden");
  };
});

BUTTONS.upload_from_url.addEventListener("click", function () {
  if (STATE.upload_mode != "url") {
    STATE.upload_mode = "url";
    BUTTONS.upload_from_url.className = "ml-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/60 border border-indigo-300/30 transition duration-3.5 rounded-lg cursor-not-allowed pointer-events-none text-white";
    BUTTONS.upload_local_file.className = "mr-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/20 border border-indigo-300/20 hover:bg-indigo-500/50 transition text-indigo-100 duration-3.5 rounded-lg hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.15)] active:scale-[1.02]";
    ELEMENT_DISPLAYS.local_upload_file.classList.add("hidden");
    ELEMENT_DISPLAYS.url_upload_file.classList.remove("hidden");
  };
});

const select_box_outline = document.querySelectorAll('.alternate-row.search-result td:nth-child(4)');

select_box_outline.forEach(cell => {
  cell.style.cursor = "pointer";
  
  cell.addEventListener('click', function(event) {
    if (event.target.type === 'checkbox') {
      return;
    };

    const row = this.parentElement;
    const checkbox = row.querySelector('#select_box');
    checkbox.click();
  });
});

BUTTONS.toggle_upload_mode.addEventListener("click", function () {
  if (STATE.button_upload_status === 0) {
    BUTTONS.select_box_container.forEach((element_checkbox) => {
      element_checkbox.classList.remove("hidden");
    });

    disable_button(BUTTONS.multiple_host_popup);
    SELECTS.select_box.forEach((checkbox) => {
      checkbox.checked = false;
    });

    BUTTONS.upload_generic.forEach((element_button) => {
      if (!element_button.textContent.includes("Set API key")) {
        element_button.classList.add("hidden");
      } else {
        const api_key_element = element_button.parentElement;
        const checkbox = api_key_element.querySelectorAll("div")
        checkbox[3].classList.add("hidden")
      };
    });

    ELEMENT_DISPLAYS.upload_name.textContent = "Selected";
    BUTTONS.toggle_upload_mode.innerHTML = `<i class="ph-bold ph-arrow-elbow-down-right -rotate-90 mr-1 mb-1"></i> Switch to single upload mode`;
    BUTTONS.multiple_host_popup.classList.remove("hidden");
    STATE.button_upload_status = 1;

  } else if (STATE.button_upload_status === 1) {
    BUTTONS.upload_generic.forEach((element) => {
      element.classList.remove("hidden");
    });
    BUTTONS.select_box_container.forEach((element) => {
      element.classList.add("hidden");
    });

    ELEMENT_DISPLAYS.upload_name.textContent = "Upload";
    BUTTONS.toggle_upload_mode.innerHTML = `<i class="mr-1 ph-duotone ph-arrows-split"></i> Switch to multiple upload mode`;
    BUTTONS.multiple_host_popup.classList.add("hidden");
    STATE.button_upload_status = 0;
  }
});

SELECTS.select_box.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
      if (Array.from(SELECTS.select_box).filter(checkbox => checkbox.checked).length >= 2) {
          enable_button(BUTTONS.save_selected_host, "indigo", "small");
          enable_button(BUTTONS.multiple_host_popup, "red", "small");
      } else {
          disable_button(BUTTONS.save_selected_host);
          disable_button(BUTTONS.multiple_host_popup);
      };
  });
});

BUTTONS.multiple_host_popup.addEventListener("click", function () {
  reset_popup();
  const selected_host = [];

  SELECTS.select_box.forEach((checkbox) => {
    if (checkbox.checked && !checkbox.parentElement.parentElement.parentElement.textContent.includes("Set API key")) {
      selected_host.push(checkbox.value);
    };
  });

  STATE.host = selected_host;
  ELEMENT_DISPLAYS.conditions_of_use.classList.add("hidden");
  POPUPS.info.classList.add("hidden");
  ELEMENT_DISPLAYS.final_upload_url.classList.add("hidden");
});

BUTTONS.delete_file_input.addEventListener("click", function () {
  INPUTS.popup_file.value = "";
  disabled_upload_button();
  BUTTONS.popup_upload_local.classList.add("opacity-50");
  BUTTONS.popup_browse.innerHTML = `<i class="mr-2 ph-duotone ph-file-plus"></i>Add a file`;

  if (document.getElementById("prohibited_format_text")) {
    document.getElementById("prohibited_format_text").remove();
  };

  BUTTONS.delete_file_input.classList.add("hidden");
});

BUTTONS.close_popup.forEach((element) => {
  element.addEventListener("click", function () {
    if (element.attributes.target.value === "upload_popup") {
      STATE.controller.abort();
      STATE.controller = new AbortController();
      
      POPUPS.upload.classList.add("hidden");
      BUTTONS.popup_new_profile.classList.add("hidden");
      BUTTONS.popup_new_profile.innerHTML = `<i class="ph-bold ph-plus"></i>`;
    } else if (element.attributes.target.value === "update_popup") {
      POPUPS.update.classList.add("hidden");
    } else if (element.attributes.target.value === "profile_maker_popup") {
      reset_upload_profile();
    } else if (element.attributes.target.value === "history_popup") {
      POPUPS.uploaded_files_history.classList.add("hidden");
    } else if (element.attributes.target.value === "import_export_popup") {
      POPUPS.import_export.classList.add("hidden");
    } else if (element.attributes.target.value === "manage_api_keys_popup") {
      document.querySelectorAll("#input_api_keys_management").forEach(input => {
        if (input.value == "") {
          delete_api_key(input.parentElement.parentElement.parentElement, input.getAttribute("host"));
        };
      });
      POPUPS.manage_api_keys.classList.add("hidden");
    } else if (element.attributes.target.value === "about_popup") {
      POPUPS.about.classList.add("hidden");
    } else if (element.attributes.target.value === "settings_popup") {
      POPUPS.settings.classList.add("hidden");
    }
  });
});

BUTTONS.about.addEventListener("click", function () {
  POPUPS.about.classList.remove("hidden");
});

POPUPS.about.addEventListener("click", function (event) {
  if (event.target === POPUPS.about && localStorage.getItem("close_popups_setting") === "true") {
    POPUPS.about.classList.add("hidden");
  };
});

BUTTONS.settings.addEventListener("click", function () {
  ELEMENT_DISPLAYS.import_export_container.classList.add("hidden");
  POPUPS.settings.classList.remove("hidden");
});

POPUPS.settings.addEventListener("click", function (event) {
  if (event.target === POPUPS.settings && localStorage.getItem("close_popups_setting") === "true") {
    POPUPS.settings.classList.add("hidden");
  };
});

if (!localStorage.getItem("close_popups_setting")) {
  localStorage.setItem("close_popups_setting", "false");
};

if (localStorage.getItem("close_popups_setting") == "true") {
  SELECTS.select_box_popups.checked = true;
};

SELECTS.select_box_popups.addEventListener("change", async () => {
  if (SELECTS.select_box_popups.checked) {
    localStorage.setItem("close_popups_setting", "true");
  } else {
    localStorage.setItem("close_popups_setting", "false");
  };
});

const buttons_top_margin = [BUTTONS.multiple_host_popup, BUTTONS.save_selected_host];

const observer = new MutationObserver(() => {
  const one_is_visible = buttons_top_margin.some(btn => !btn.classList.contains("hidden"));

  ELEMENT_DISPLAYS.scroll_top_button_container.classList.toggle("top-28", one_is_visible);
});

buttons_top_margin.forEach(btn => {
  observer.observe(btn, {
    attributes: true,
    attributeFilter: ['class']
  });
});

function show_hide_unstable_hosts() {
  document.querySelectorAll('tr').forEach(row => {
    const warning = row.querySelector('.ph-warning-circle');
    if (warning) {
      const tooltip_text = warning.closest('.group')?.querySelector('div div')?.textContent?.trim();
      if (tooltip_text?.includes("Errors are frequently encountered during uploads")) {
        if (SELECTS.select_box_unstable.checked) {
          row.classList.remove('hidden');
          localStorage.setItem("show_unstable_hosts", "true");
          ELEMENT_DISPLAYS.last_blur.classList.add("top-[490rem]")
          ELEMENT_DISPLAYS.last_blur.classList.remove("top-[410rem]")
        } else {
          row.classList.add('hidden');
          localStorage.setItem("show_unstable_hosts", "false");
          ELEMENT_DISPLAYS.last_blur.classList.remove("top-[490rem]")
          ELEMENT_DISPLAYS.last_blur.classList.add("top-[410rem]")
        };
      };
    };
  });
  apply_alternate_row_colors();
};

function count_hosts_with_text() {
  let count = 0;
  document.querySelectorAll('tr').forEach(row => {
    const warning = row.querySelector('.ph-warning-circle');
    if (warning) {
      const tooltip_text = warning.closest('.group')?.querySelector('div div')?.textContent?.trim();
      if (tooltip_text?.includes("Errors are frequently encountered during uploads")) {
        count++;
      };
    };
  });
  
  ELEMENT_DISPLAYS.unstable_hosts_text.textContent = `Show unstable hosts (${count})`;
};

count_hosts_with_text();

if (!localStorage.getItem("show_unstable_hosts")) {
  localStorage.setItem("show_unstable_hosts", "false");
};

if (localStorage.getItem("show_unstable_hosts") == "true") {
  SELECTS.select_box_unstable.checked = true;
  show_hide_unstable_hosts();
} else {
  show_hide_unstable_hosts();
};

SELECTS.select_box_unstable.addEventListener("change", async () => {
  show_hide_unstable_hosts();
});

HOST_SITES.forEach(site => {
  upload_preparation(document.getElementById(`button_${site.key}`), [site.discriminator], site.tooltip, site.terms, site.apiKeyUrl);
});

BUTTONS.popup_upload_local.addEventListener("click", start_upload);
BUTTONS.popup_upload_url.addEventListener("click", start_upload);
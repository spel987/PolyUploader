import { invoke, listen } from './tauri.js';
import { BUTTONS_HOST, BUTTONS, SELECTS, ELEMENT_DISPLAYS, POPUPS, INPUTS, STATE } from './globals.js';
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
        prohibited_format_text.innerHTML = `<strong><i class="mr-1 fa-sharp-duotone fa-solid fa-ban"></i> Prohibited file format (${prohibited_hosts.join(", ")})</strong>`;
      } else {
        prohibited_format_text.innerHTML = `<strong><i class="mr-1 fa-sharp-duotone fa-solid fa-ban"></i> Prohibited file format</strong>`;
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
      prohibited_format_text.innerHTML = `<strong><i class="mr-1 fa-sharp-duotone fa-solid fa-ban"></i> Prohibited file format (${prohibited_hosts.join(", ")})</strong>`;
    } else {
      prohibited_format_text.innerHTML = `<strong><i class="mr-1 fa-sharp-duotone fa-solid fa-ban"></i> Prohibited file format</strong>`;
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
    BUTTONS.popup_new_profile.innerHTML = `<i class="fa-sharp fa-solid fa-plus"></i>`;
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
    BUTTONS.toggle_upload_mode.innerHTML = `<i class="fa-sharp fa-solid fa-arrow-turn-down -rotate-90 mr-1 mb-1"></i> Switch to single upload mode`;
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
    BUTTONS.toggle_upload_mode.innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-arrows-turn-right"></i> Switch to multiple upload mode`;
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
  BUTTONS.popup_browse.innerHTML = `<i class="mr-2 fa-sharp-duotone fa-solid fa-file-medical"></i>Add a file`;

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
      BUTTONS.popup_new_profile.innerHTML = `<i class="fa-sharp fa-solid fa-plus"></i>`;
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
    const warning = row.querySelector('.fa-circle-exclamation');
    if (warning) {
      const tooltip_text = warning.closest('.group')?.querySelector('div div')?.textContent?.trim();
      if (tooltip_text?.includes("Errors are frequently encountered during uploads")) {
        if (SELECTS.select_box_unstable.checked) {
          row.classList.remove('hidden');
          localStorage.setItem("show_unstable_hosts", "true");
          ELEMENT_DISPLAYS.last_blur.classList.add("top-[480rem]")
          ELEMENT_DISPLAYS.last_blur.classList.remove("top-[405rem]")
        } else {
          row.classList.add('hidden');
          localStorage.setItem("show_unstable_hosts", "false");
          ELEMENT_DISPLAYS.last_blur.classList.remove("top-[480rem]")
          ELEMENT_DISPLAYS.last_blur.classList.add("top-[405rem]")
        };
      };
    };
  });
  apply_alternate_row_colors();
};

function count_hosts_with_text() {
  let count = 0;
  document.querySelectorAll('tr').forEach(row => {
    const warning = row.querySelector('.fa-circle-exclamation');
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

upload_preparation(BUTTONS_HOST.gofile, ["gofile.io"], "Gofile has no known bugs or problems.", "https://gofile.io/terms");
upload_preparation(BUTTONS_HOST.litterbox, ["litter.catbox.moe"], "Litterbox occasionally returns 512 errors.", "https://litterbox.catbox.moe/faq.php");
upload_preparation(BUTTONS_HOST.tmpfilesorg, ["tmpfiles.org"], "TmpFiles.org has no known bugs or problems.", "https://tmpfiles.org/about");
upload_preparation(BUTTONS_HOST.cvsh, ["c-v.sh"], "C-V.sh has no known bugs or problems.", "https://c-v.sh/");
upload_preparation(BUTTONS_HOST.kitc, ["ki.tc"], "Ki.tc has no known bugs or problems.", "https://logic-gate-demo.readthedocs.io/en/latest/readme.html");
upload_preparation(BUTTONS_HOST.oshi, ["oshi.at"], "Oshi.at is inaccessible from certain IPs with the error \"Connection reset\".", "https://oshi.at/abuse");
upload_preparation(BUTTONS_HOST.filebin, ["filebin.net"], "Filebin often runs out of storage.", "https://filebin.net/terms");
upload_preparation(BUTTONS_HOST.bashupload, ["bashupload.com"], "Bashupload.com allows only one download per link.", "https://bashupload.com/disclaimer");
upload_preparation(BUTTONS_HOST.curlby, ["curl.by"], "Curl.by has no known bugs or problems.", "https://www.curl.by/disclaimer");
upload_preparation(BUTTONS_HOST.x0at, ["x0.at"], "x0.at has no known bugs or problems.", "https://x0.at/");
upload_preparation(BUTTONS_HOST.tommoteam, ["tommo.team"], "Tommo.team has no known bugs or problems.", "https://tommo.team/faq.html");
upload_preparation(BUTTONS_HOST.tempfilesninja, ["tempfiles.ninja"], "tempfiles.ninja has no known bugs or problems.", "https://tempfiles.ninja/");
upload_preparation(BUTTONS_HOST.pixeldrain, ["pixeldrain.com"], "Pixeldrain has no known bugs or problems.", "https://pixeldrain.com/abuse", "https://polyuploader.vercel.app/get-api-keys#pixeldrain");
upload_preparation(BUTTONS_HOST._1cloudfile, ["1cloudfile.com"], "1Cloudfile has no known bugs or problems.", "https://1cloudfile.com/terms");
upload_preparation(BUTTONS_HOST.bowfile, ["bowfile.com"], "Bowfile imposes a waiting time of 7 seconds before downloading.", "https://bowfile.com/terms");
upload_preparation(BUTTONS_HOST.uploadify, ["uploadify.net"], "Uplodify imposes a waiting time of 20 seconds before downloading.", "https://uploadify.net/terms.html");
upload_preparation(BUTTONS_HOST.anontransfer, ["anontransfer.com"], "AnonTransfer has no known bugs or problems.", "https://anontransfer.com/terms");
upload_preparation(BUTTONS_HOST.tempsh, ["temp.sh"], "Temp.sh has no known bugs or problems.", "https://temp.sh/");
upload_preparation(BUTTONS_HOST.uguuse, ["uguu.se"], "Uguu.se has no known bugs or problems.", "https://uguu.se/faq.html");
upload_preparation(BUTTONS_HOST.nopaste, ["nopaste.net"], "Nopaste has no known bugs or problems.", "https://nopaste.net/");
upload_preparation(BUTTONS_HOST.udrop, ["udrop.com"], "udrop has no known bugs or problems.", "https://www.udrop.com/terms");
upload_preparation(BUTTONS_HOST.tempsend, ["tempsend.com"], "Tempsend has no known bugs or problems.", "https://tempsend.com/");
upload_preparation(BUTTONS_HOST._1fichier, ["1fichier.com"], "1fichier limits bandwidth during download and imposes a waiting time between file downloads.", "https://img.1fichier.com/2021-10-01-CGU.pdf");
upload_preparation(BUTTONS_HOST.turbobit, ["torbobit.net"], "Turbobit limits bandwidth during download and imposes a waiting time between file downloads.", "https://torbobit.net/rules");
upload_preparation(BUTTONS_HOST.hitfile, ["hitfile.net"], "Hitfile limits bandwidth during download and imposes a waiting time between file downloads.", "https://hitfile.net/rules");
upload_preparation(BUTTONS_HOST.fileupload, ["file-upload.org"], "file-upload.org limits bandwidth during download and imposes a waiting time before downloading.", "https://www.file-upload.org/tos.html");
upload_preparation(BUTTONS_HOST.hexupload, ["hexload.com"], "HexUpload has no known bugs or problems.", "https://hexload.com/tos.html");
upload_preparation(BUTTONS_HOST.mexash, ["mexa.sh"], "Mexa.sh has no known bugs or problems.", "https://mexa.sh/tos.html");
upload_preparation(BUTTONS_HOST.rapidfileshare, ["rapidfileshare.net"], "RapidFileShare limits bandwidth and restricts downloads to 1GB per day.", "http://rapidfileshare.net/tos.html");
upload_preparation(BUTTONS_HOST.sendnow, ["send.now"], "Send.now has no known bugs or problems.", "https://send.now/terms");
upload_preparation(BUTTONS_HOST.filetmp, ["filetmp.com"], "FileTmp has no known bugs or problems.", "https://filetmp.com/");
upload_preparation(BUTTONS_HOST.usersdrive, ["usersdrive.com"], "UsersDrive imposes a waiting time of 17 seconds before downloading.", "https://usersdrive.com/tos.html");
upload_preparation(BUTTONS_HOST.downloadgg, ["download.gg"], "Download.gg has no known bugs or problems.", "https://download.gg");
upload_preparation(BUTTONS_HOST.krakenfiles, ["krakenfiles.com"], "KrakenFiles has no known bugs or problems.", "https://krakenfiles.com/terms");
upload_preparation(BUTTONS_HOST.clicknupload, ["clicknupload.click"], "Clicknupload imposes a waiting time of 12 seconds before downloading.", "https://clicknupload.click/tos.html");
upload_preparation(BUTTONS_HOST.uploadee, ["upload.ee"], "Upload.ee has no known bugs or problems.", "https://www.upload.ee/rules.html");
upload_preparation(BUTTONS_HOST.ccuto, ["ccu.to"], "CCU.to has no known bugs or problems.", "https://ccu.to");
upload_preparation(BUTTONS_HOST.filespacecom, ["filespace.com"], "Filespace imposes a captcha before downloading and limits bandwidth.", "https://filespace.com/tos.html");
upload_preparation(BUTTONS_HOST.gulfup, ["gulf-up.com"], "Gulfup imposes a waiting time of 22 seconds before downloading.", "https://www.gulf-up.com/tos.html");
upload_preparation(BUTTONS_HOST.cyberfile, ["cyberfile.me"], "CyberFile has no known bugs or problems.", "https://cyberfile.me/terms");
upload_preparation(BUTTONS_HOST.freefr, ["free.fr"], "Free.fr has no known bugs or problems.", "https://transfert.free.fr/data/CGU_FREE_TRANSFERT_080223.pdf");
upload_preparation(BUTTONS_HOST.depositfiles, ["dfiles.eu"], "DepositFiles imposes a waiting time of 22 seconds before downloading.", "https://dfiles.eu/user_agreement.html");
upload_preparation(BUTTONS_HOST.tmpsend, ["tmpsend.com"], "TmpSend has no known bugs or problems.", "https://tmpsend.com/faq");
upload_preparation(BUTTONS_HOST.ufile, ["ufile.io"], "uFile limits download speed to 1 Mb/s.", "https://ufile.io/terms");
upload_preparation(BUTTONS_HOST.dropdownload, ["drop.download"], "Drop.download imposes a captcha before downloading a file.", "https://drop.download/pages/tos", "https://polyuploader.vercel.app/get-api-keys#dropdownload");
upload_preparation(BUTTONS_HOST.filemoon, ["filemoon.sx"], "FileMoon takes a long time to encode videos.", "https://filemoon.sx/tos", "https://polyuploader.vercel.app/get-api-keys#filemoon");
upload_preparation(BUTTONS_HOST.catbox, ["files.catbox.moe"], "Catbox occasionally returns 512 errors.", "https://catbox.moe/legal.php", "https://polyuploader.vercel.app/get-api-keys#catbox");
upload_preparation(BUTTONS_HOST.sendvid, ["sendvid.com"], "Sendvid takes a long time to encode videos.", "https://sendvid.com/help/tos");
upload_preparation(BUTTONS_HOST.upstore, ["upstore.net"], "Upstore imposes a waiting time of 60 seconds before downloading.", "https://upstore.net/terms");
upload_preparation(BUTTONS_HOST.ddownload, ["ddownload.com"], "ddownload imposes a captcha before downloading a file.", "https://ddownload.com/tos.html", "https://polyuploader.vercel.app/get-api-keys#ddownload");
upload_preparation(BUTTONS_HOST.mp4upload, ["mp4upload.com"], "mp4upload imposes a waiting time of 20 seconds before downloading.", "https://mp4upload.com/tos", "https://polyuploader.vercel.app/get-api-keys#mp4upload");
upload_preparation(BUTTONS_HOST.netu, ["waaw.ac"], "Netu has lots of ads.", "https://netu.ac/view_page.php?pid=12");
upload_preparation(BUTTONS_HOST.dropgalaxy, ["dropgalaxy.com"], "DropGalaxy imposes a waiting time of 20 seconds and a captcha before downloading and has lots of ads.", "https://dropgalaxy.com/tos.html", "https://polyuploader.vercel.app/get-api-keys#dropgalaxy");
upload_preparation(BUTTONS_HOST.nitroflare, ["nitroflare.com"], "Nitroflare imposes a waiting time of 2 minutes and a captcha before downloading and limits bandwidth.", "https://nitroflare.com/tos", "https://polyuploader.vercel.app/get-api-keys#nitroflare");
upload_preparation(BUTTONS_HOST.vidoza, ["vidoza.net"], "Vidoza imposes a captcha before downloading.", "https://vidoza.net/tos", "https://polyuploader.vercel.app/get-api-keys#vidoza");
upload_preparation(BUTTONS_HOST.katfile, ["katfile.com"], "Katfile imposes a waiting time of 2 hours between file downloads.", "https://katfile.com/tos.html", "https://polyuploader.vercel.app/get-api-keys#katfile");
upload_preparation(BUTTONS_HOST.rapidgator, ["rapidgator.net"], "Rapidgator limits bandwidth during download and imposes a waiting time of 2 hours between file downloads.", "https://rapidgator.net/article/terms", "https://polyuploader.vercel.app/get-api-keys#rapidgator");
upload_preparation(BUTTONS_HOST.fastupload, ["fastupload.io"], "Fastupload imposes a waiting time of 5 seconds before downloading.", "https://fastupload.io/terms");
upload_preparation(BUTTONS_HOST.imgbb, ["ibb.co"], "ImgBB has no known bugs or problems.", "https://imgbb.com/tos");
upload_preparation(BUTTONS_HOST.buzzheavier, ["buzzheavier.com"], "Buzzheavier has no known bugs or problems.", "https://buzzheavier.com/terms");
upload_preparation(BUTTONS_HOST.doodstream, ["do7go.com"], "DoodStream has no known bugs or problems.", "https://doodstream.com/terms-and-conditions", "https://polyuploader.vercel.app/get-api-keys#doodstream");
upload_preparation(BUTTONS_HOST.streama2z, ["streama2z.xyz"], "StreamA2Z prevents ad blockers and forces you to disable them.", "https://streama2z.com/tos", "https://polyuploader.vercel.app/get-api-keys#streama2z");
upload_preparation(BUTTONS_HOST.streamwish, ["strwish.com"], "StreamWish has no known bugs or problems.", "https://streamwish.com/tos", "https://polyuploader.vercel.app/get-api-keys#streamwish");
upload_preparation(BUTTONS_HOST.streamruby, ["rubystm.com"], "StreamRuby does not accept short videos (less than 5 seconds).", "https://streamruby.com/tos", "https://polyuploader.vercel.app/get-api-keys#streamruby");
upload_preparation(BUTTONS_HOST.voesx, ["voe.sx"], "Voe.sx has no known bugs or problems.", "https://voe.sx/tos", "https://polyuploader.vercel.app/get-api-keys#voesx");
upload_preparation(BUTTONS_HOST.devuploads, ["devuploads.com"], "DevUploads has no known bugs or problems.", "https://devuploads.com/tos", "https://polyuploader.vercel.app/get-api-keys#devuploads");
upload_preparation(BUTTONS_HOST.mediacm, ["media.cm"], "Media.cm has no known bugs or problems.", "https://media.cm/terms");
upload_preparation(BUTTONS_HOST.dailyuploads, ["dailyuploads.net"], "DailyUploads has no known bugs or problems.", "https://dailyuploads.net/tos.html");
upload_preparation(BUTTONS_HOST.uploady, ["uploady.io"], "Uploady imposes a waiting time of 1 minute and a captcha before downloading, and 30 minutes between file downloads.", "https://uploady.io/tos.html");
upload_preparation(BUTTONS_HOST.dosyaco, ["dosya.co"], "Dosya.co has no known bugs or problems.", "https://dosya.co/tos.html");
upload_preparation(BUTTONS_HOST.dbreeme, ["dbree.org"], "Dbree has no known bugs or problems.", "https://dbree.me/terms.html");
upload_preparation(BUTTONS_HOST.douploads, ["douploads.net"], "DoUploads imposes a waiting time of 12 seconds and a captcha before downloading.", "https://douploads.net/tos.html");
upload_preparation(BUTTONS_HOST.uptomega, ["uptomega.net"], "Uptomega has no known bugs or problems.", "https://uptomega.net/pages/tos/");
upload_preparation(BUTTONS_HOST.vikingfile, ["vikingfile.com"], "VikingFile has no known bugs or problems.", "https://vikingfile.com/terms");
upload_preparation(BUTTONS_HOST.fileditch, ["fileditchfiles.me"], "Fileditch has no known bugs or problems.", "https://fileditch.com/faq.html");
upload_preparation(BUTTONS_HOST.s3kai, ["s3k.ai"], "s3kai has no known bugs or problems.", "https://up.s3k.ai/");
upload_preparation(BUTTONS_HOST.m1rai, ["m1r.ai"], "m1rai has no known bugs or problems.", "https://up.m1r.ai/");
upload_preparation(BUTTONS_HOST.lurkmoreuguu, ["lurkmore.com"], "lurkmore Uguu has no known bugs or problems.", "https://upload.lurkmore.com/faq.html");
upload_preparation(BUTTONS_HOST.uguu, ["aishiteiru.moe"], "Uguu has no known bugs or problems.", "https://uguu.aishiteiru.moe/faq.html");
upload_preparation(BUTTONS_HOST.rapidshareio, ["rapidshare.io"], "Rapidshare.io imposes a waiting time of 1 minute before downloading.", "https://rapidshare.io/terms");
upload_preparation(BUTTONS_HOST.filer, ["filer.net"], "Filer limits bandwidth during download and imposes a waiting time of 1 minute before downloading.", "https://filer.net/terms");
upload_preparation(BUTTONS_HOST.dataupload, ["dataupload.net"], "Dataupload imposes a waiting time of 8 seconds before downloading.", "https://dataupload.net/pages/tos");
upload_preparation(BUTTONS_HOST.uploadhive, ["uploadhive.com"], "UploadHive imposes a waiting time of 10 seconds before downloading.", "https://uploadhive.com/pages/tos");
upload_preparation(BUTTONS_HOST.kawaiisu, ["kawaii.su"], "imouto.kawaii.su has no known bugs or problems.", "https://imouto.kawaii.su/faq");
upload_preparation(BUTTONS_HOST.quax, ["qu.ax"], "qu.ax has no known bugs or problems.", "https://qu.ax/tos.html");
upload_preparation(BUTTONS_HOST.end2end, ["end2end.tech"], "The end2end interface is in japanese.", "https://end2end.tech/license");
upload_preparation(BUTTONS_HOST.up2share, ["up2sha.re"], "Up2Share has no known bugs or problems.", "https://up2sha.re/terms-of-service");
upload_preparation(BUTTONS_HOST.atomauth, ["atomauth.com"], "Atomauth has no known bugs or problems.", "https://atomauth.com");
upload_preparation(BUTTONS_HOST.darkibox, ["darkibox.com"], "Darkibox imposes a waiting time of 1 minute before viewing/downloading.", "https://darkibox.com/tos", "https://polyuploader.vercel.app/get-api-keys#darkibox");
upload_preparation(BUTTONS_HOST.desiupload, ["desiupload.co"], "DesiUpload imposes a waiting time of 14 seconds and a captcha before downloading.", "https://desiupload.co/pages/tos/");
upload_preparation(BUTTONS_HOST.gofileto, ["gofile.to"], "Gofile.to has no known bugs or problems.", "https://gofile.to/terms");
upload_preparation(BUTTONS_HOST.ayayabeauty, ["ayaya.beauty"], "ayaya.beauty has no known bugs or problems.", "https://ayaya.beauty");
upload_preparation(BUTTONS_HOST.filegram, ["filegram.to"], "Filegram has no known bugs or problems.", "https://filegram.to/tos", "https://polyuploader.vercel.app/get-api-keys#filegram");
upload_preparation(BUTTONS_HOST.goodstream, ["goodstream.one"], "Goodstream has no known bugs or problems.", "https://goodstream.one/tos", "https://polyuploader.vercel.app/get-api-keys#goodstream");
upload_preparation(BUTTONS_HOST.dropload, ["dropload.io"], "Dropload has no known bugs or problems.", "https://dropload.io/tos", "https://polyuploader.vercel.app/get-api-keys#dropload");
upload_preparation(BUTTONS_HOST.gettsu, ["gett.su"], "GeTT imposes a waiting time of 10 seconds before downloading.", "https://gett.su/tos.html", "https://polyuploader.vercel.app/get-api-keys#gett");
upload_preparation(BUTTONS_HOST.oneupload, ["oneupload.to"], "OneUpload has no known bugs or problems.", "https://oneupload.to/tos", "https://polyuploader.vercel.app/get-api-keys#oneupload");
upload_preparation(BUTTONS_HOST.earnvids, ["smoothpre.com"], "EarnVids has no known bugs or problems.", "https://earnvids.com/tos", "https://polyuploader.vercel.app/get-api-keys#earnvids");
upload_preparation(BUTTONS_HOST.vinovo, ["vinovo.to"], "Vinovo has no known bugs or problems.", "https://vinovo.si/terms", "https://polyuploader.vercel.app/get-api-keys#vinovo");
upload_preparation(BUTTONS_HOST.uploadrar, ["uploadrar.com"], "Uploadrar has no known bugs or problems.", "https://uploadrar.com/pages/tos", "https://polyuploader.vercel.app/get-api-keys#uploadrar");
upload_preparation(BUTTONS_HOST.vidguard, ["listeamed.net"], "Vidguard has no known bugs or problems.", "https://vidguard.to/terms", "https://polyuploader.vercel.app/get-api-keys#vidguard");
upload_preparation(BUTTONS_HOST.savefiles, ["savefiles.com"], "SaveFiles has no known bugs or problems.", "https://savefiles.com/tos", "https://polyuploader.vercel.app/get-api-keys#savefiles");
upload_preparation(BUTTONS_HOST.filespayouts, ["filespayouts.com"], "Filespayouts has no known bugs or problems.", "https://filespayouts.com/pages/tos", "https://polyuploader.vercel.app/get-api-keys#filespayouts");
upload_preparation(BUTTONS_HOST.fileaxa, ["fileaxa.com"], "Fileaxa imposes a waiting time of 15 seconds before downloading.", "https://fileaxa.com/tos.html", "https://polyuploader.vercel.app/get-api-keys#fileaxa");
upload_preparation(BUTTONS_HOST.nelion, ["nelion.me"], "Nelion imposes a waiting time of 90 seconds before downloading.", "https://nelion.me/tos.html");
upload_preparation(BUTTONS_HOST.uploadflix, ["uploadflix.com"], "UploadFlix has no known bugs or problems.", "https://uploadflix.cc/tos.html");
upload_preparation(BUTTONS_HOST.filepv, ["filepv.com"], "Filepv imposes a waiting time of 15 seconds and a captcha before downloading.", "https://filepv.com/pages/tos");
upload_preparation(BUTTONS_HOST.filestore, ["filestore.to"], "Filestore has no known bugs or problems.", "https://filestore.to/terms");
upload_preparation(BUTTONS_HOST.dz4up, ["dz4up.com"], "DZ4Up imposes a waiting time of 10 seconds and a captcha before downloading.", "https://dz4up.com/terms.html");
upload_preparation(BUTTONS_HOST.wdfiles, ["wdfiles.ru"], "WDFiles imposes a waiting time of 12 seconds and a captcha before downloading.", "https://wdfiles.ru/terms.html");
upload_preparation(BUTTONS_HOST.xupin, ["xup.in"], "XUP has no known bugs or problems.", "https://www.xup.in/terms");
upload_preparation(BUTTONS_HOST.fastdown, ["fast-down.com"], "Fast Down imposes a waiting time of 30 seconds and a captcha before downloading.", "https://down.fast-down.com/tos.html");
upload_preparation(BUTTONS_HOST.f2h, ["f2h.io"], "F2H imposes a waiting time of 10 seconds before downloading.", "https://f2h.io/pages/terms");
upload_preparation(BUTTONS_HOST.nippyfile, ["nippyfile.com"], "NippyFile has no known bugs or problems.", "https://nippyfile.com/terms.html");
upload_preparation(BUTTONS_HOST.uploadfilepl, ["uploadfile.pl"], "The UploadFile.pl interface is in polish.", "https://uploadfile.pl/regulamin.html");
upload_preparation(BUTTONS_HOST.mega4up, ["mega4upload.net"], "Mega4up imposes a waiting time of 20 seconds before downloading.", "https://mega4upload.net/tos.html");
upload_preparation(BUTTONS_HOST.hostuje, ["hostuje.net"], "The Hostuje interface is in polish.", "http://hostuje.net/regulamin.php");
upload_preparation(BUTTONS_HOST.supervideo, ["supervideo.cc"], "SuperVideo has no known bugs or problems.", "https://supervideo.cc/tos", "https://polyuploader.vercel.app/get-api-keys#supervideo");
upload_preparation(BUTTONS_HOST.mixloads, ["mixloads.to"], "MixLoads has no known bugs or problems.", "https://mixloads.to/pages/tos", "https://polyuploader.vercel.app/get-api-keys#mixloads");
upload_preparation(BUTTONS_HOST.up4stream, ["ups2up.fun"], "Up4Stream has no known bugs or problems.", "https://up4stream.com/tos", "https://polyuploader.vercel.app/get-api-keys#up4stream");
upload_preparation(BUTTONS_HOST.uqload, ["uqload.cx"], "Uqload has no known bugs or problems.", "https://uqload.cx/tos", "https://polyuploader.vercel.app/get-api-keys#uqload");
upload_preparation(BUTTONS_HOST.lulustream, ["lulustream.com"], "LuluStream does not accept short videos (less than 5 seconds).", "https://lulustream.com/tos", "https://polyuploader.vercel.app/get-api-keys#lulustream");
upload_preparation(BUTTONS_HOST.upfiles, ["upfiles.com"], "UpFiles prevents ad blockers and forces you to disable them.", "https://upfiles.com/page/terms", "https://polyuploader.vercel.app/get-api-keys#upfiles");
upload_preparation(BUTTONS_HOST.streambolt, ["streambolt.tv"], "StreamBolt prevents ad blockers and forces you to disable them.", "https://streambolt.tv/tos", "https://polyuploader.vercel.app/get-api-keys#streambolt");
upload_preparation(BUTTONS_HOST.megaup, ["megaup.net"], "MegaUp imposes a waiting time of 5 seconds before the file can be downloaded.", "https://megaup.net/terms.html");
upload_preparation(BUTTONS_HOST._1filesharing, ["1filesharing.com"], "1filesharing imposes a waiting time of 60 seconds and a captcha before the file can be downloaded.", "https://1filesharing.com/terms.html");
upload_preparation(BUTTONS_HOST.datavaults, ["datavaults.co"], "Data Vaults imposes a waiting time of 30 seconds and a captcha before the file can be downloaded.", "https://datavaults.co/pages/tos");
upload_preparation(BUTTONS_HOST.dropmb, ["dropmb.com"], "DropMB has no known bugs or problems.", "https://dropmb.com/privacy");
upload_preparation(BUTTONS_HOST.filemirage, ["filemirage.com"], "FileMirage has no known bugs or problems.", "https://filemirage.com/terms-of-use");
upload_preparation(BUTTONS_HOST.pomflainla, ["lain.la"], "Pomf.lain.la is a bit slow.", "https://pomf.lain.la/f/faq.html");

BUTTONS.popup_upload_local.addEventListener("click", start_upload);
BUTTONS.popup_upload_url.addEventListener("click", start_upload);
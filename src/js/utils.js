import { get_api_key } from './upload.js';
import { BUTTONS, SELECTS, ELEMENT_DISPLAYS, POPUPS, INPUTS, STATE, URL_FOR_BYPASS_CORS, HOST_SITES } from './globals.js';
import { resolveResource, convertFileSrc, getVersion, invoke } from './tauri.js';

export function disabled_upload_button() {
    BUTTONS.popup_upload_local.setAttribute("disabled", "");
    BUTTONS.popup_upload_local.classList.add("cursor-not-allowed");
    BUTTONS.popup_upload_local.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500", "active:scale-105", "active:scale-110", "hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)]");
    BUTTONS.popup_upload_url.setAttribute("disabled", "");
    BUTTONS.popup_upload_url.classList.add("cursor-not-allowed");
    BUTTONS.popup_upload_url.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500", "active:scale-105", "active:scale-110", "hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)]");
    
    if (STATE.upload_mode == "url") {
      INPUTS.url_upload.classList.add("cursor-not-allowed", "opacity-50");
      INPUTS.url_upload.setAttribute("disabled", "")
      INPUTS.url_upload.classList.remove("active:scale-[1.05]")
    };
};

export function enable_upload_button() {
  BUTTONS.popup_upload_local.innerHTML = "Upload";
  BUTTONS.popup_upload_local.classList.remove("transition", "active:scale-110");
  BUTTONS.popup_upload_local.classList.add("cursor-not-allowed", "opacity-50");
  BUTTONS.popup_upload_url.innerHTML = "Upload";
  BUTTONS.popup_upload_url.classList.remove("transition", "active:scale-110");
  BUTTONS.popup_upload_url.classList.add("cursor-not-allowed", "opacity-50");

  if (STATE.upload_mode == "url") {
    INPUTS.url_upload.classList.remove("cursor-not-allowed", "opacity-50");
    INPUTS.url_upload.removeAttribute("disabled", "")
    INPUTS.url_upload.classList.add("active:scale-[1.05]");
  };
};

export async function get_resource_path() {
  try {
    const resource_path = await resolveResource("Resources");
    return resource_path;
  } catch (error) {
    console.error("Error obtaining local data directory : ", error);
  };
};

export function get_file_name_from_url(url) {
    try {
      const url_object = new URL(url);
      const pathname = url_object.pathname;
      const last_segment = pathname.split('/').filter(segment => segment);
  
      if (last_segment.length === 0) {
          throw new Error("The URL provided does not contain a valid path.");
      };

      const filename = last_segment[last_segment.length - 1];
      return filename;
    } catch {
        return null;
    };
};

export function get_site_name(url) {
  let url_process = url.replace(URL_FOR_BYPASS_CORS, "");
  
  if (!url_process.startsWith("https://") && !url_process.startsWith("http://")) {
    url_process = "https://" + url_process
  };

  const parsed_url = new URL(url_process);
  let hostname = parsed_url.hostname;
  const parts = hostname.split('.');

  if (parts.length > 2) {
    hostname =  parts.slice(parts.length - 2).join('.');
  };

  if (parts.length === 4 && parts.every(part => !isNaN(part))) {
    hostname = parsed_url.hostname;
  };

  const domain_name = {
    "catbox.moe": "litter.catbox.moe",
    "fdfiles.net": "torbobit.net",
    "file-upload.download": "file-upload.org",
    "agrachimp.xyz": "hexload.com",
    "userdrive.org": "usersdrive.com",
    "clicknupload.net": "clicknupload.click",
    "scdns.link": "gulf-up.com",
    "iliad.fr": "free.fr",
    "cdn112.com": "filemoon.sx",
    "catbox.moe": "files.catbox.moe",
    "ucdn.to": "ddownload.com",
    "cfglobalcdn.com": "waaw.ac",
    "netu.tv": "waaw.ac",
    "imgbb.com": "ibb.co",
    "cloudatacdn.com": "do7go.com",
    "smartkhabrinews.com": "streama2z.xyz",
    "cdn-centaurus.com": "strwish.com",
    "streamruby.net": "rubystm.com",
    "voe-network.net": "voe.sx",
    "uploady.download": "uploady.io",
    "zipcluster.com": "dbree.org",
    "douploads.com": "douploads.net",
    "uptomega.com": "uptomega.net",
    "fileditch.com": "fileditchfiles.me",
    "desifile.in": "desiupload.co",
    "milocdn.com": "smoothpre.com",
    "vincdn.net": "vinovo.to",
    "guardstorage.net": "listeamed.net",
    "dogerlinks.xyz": "filespayouts.com",
    "uploadflix.cyou": "uploadflix.com",
    "zipcluster.com": "nippyfile.com",
    "mega4down.com": "mega4upload.net",
    "serversicuro.cc": "supervideo.cc",
    "up4stream.com": "ups2up.fun",
    "tnmr.org": "lulustream.com"
  };

  let host = null;

  if (domain_name[hostname]) {
    host = domain_name[hostname];
  } else {
    host = hostname;
  };

  return HOST_SITES.find(site => site.discriminator === host)?.name;
};

export function get_value_from_path(path, json_data) {
  return path.reduce((current, key) => current?.[key], json_data);
};

export function get_values_from_paths(paths, data) {
  const assembling_element = paths.pop();

  return paths.map(path => {
    if (!Array.isArray(path)) {
        return path;
    };
    
    if (path[0] === "match") {
        return data.match(path[1])[path[2]];
    } else {
        return path.reduce((current, key) => current?.[key], data);
    };
  }).join(assembling_element);
};

export function resolve_value(value, data) {
  if (Array.isArray(value)) {
    if (value[0] === "match") {
      return data.match(value[1])[value[2]];
    };

    if (value.every(k => typeof k === "string" || typeof k === "number")) {
      return get_value_from_path(value, data);
    };

    return value.map(item => resolve_value(item, data));
  } else if (typeof value === "object" && value !== null) {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = resolve_value(val, data);
    };
    return result;
  } else {
    return value;
  }
};

export function get_domain_name(url) {
  try {
    const url_obj = new URL(url);
    const hostname_parts = url_obj.hostname.split('.');

    if (hostname_parts.length > 2 && hostname_parts[0] != "litter") {
      return hostname_parts.slice(-2).join('.');
    }

    return url_obj.hostname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  };
};

export function get_retention_duration(host) {
  const table_rows = document.querySelectorAll(".alternate-row");

  for (const row of table_rows) {
    const checkbox_element = row.querySelector('input[type="checkbox"]');

    const checkbox_value = checkbox_element.value;

    if (checkbox_value === host) {
      const retention_element = row.querySelector("td:nth-child(3)");

      const retention_value = retention_element.textContent.trim();

      return retention_value;
    };
  };
};

export function copy_to_clipboard(url) {
    navigator.clipboard.writeText(url);
};

export function disable_button(button) {
    button.classList.add("opacity-50", "cursor-not-allowed");
    button.classList.remove("transition", "hover:scale-105", "hover:from-rose-500", "hover:to-red-500", "hover:scale-[1.01]", "hover:from-indigo-600", "hover:to-[#7072ee]", "hover:scale-[1.03]", "active:scale-[1.03]", "active:scale-[1.05]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.2)]", "hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)]");
    button.setAttribute("disabled", "");
};

export function enable_button(button, color, size) {
  button.classList.remove("opacity-50", "cursor-not-allowed", "pointer-events-none");

  if (color == "red") {
    button.classList.add("transition", "hover:from-rose-500", "hover:to-red-500", "hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)]");
  } else if (color == "indigo") {
    button.classList.add("transition", "hover:from-indigo-600", "hover:to-[#7072ee]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.2)]");
  }

  if (size == "small") {
    button.classList.add("hover:scale-[1.01]", "active:scale-[1.03]")
  } else if (size == "big") {
    button.classList.add("hover:scale-[1.03]", "active:scale-[1.05]")
  }
  
  button.removeAttribute("disabled", "");
};


export function reset_popup() {
  POPUPS.upload.classList.remove("hidden");
  if (STATE.force_keep_file == 0) {
    INPUTS.popup_file.value = "";
    BUTTONS.popup_browse.innerHTML = `<i class="mr-2 fa-sharp-duotone fa-solid fa-file-medical"></i>Add a file`;
    disable_button(BUTTONS.popup_upload_local);
    BUTTONS.delete_file_input.classList.add("hidden");
  } else {
    STATE.force_keep_file = 0;
  };
  INPUTS.url_upload.value = "";
  INPUTS.url_upload.classList.remove("hidden");
  ELEMENT_DISPLAYS.final_upload_url.textContent = "";
  ELEMENT_DISPLAYS.final_upload_url.classList.remove("hidden");
  disable_button(BUTTONS.popup_upload_url);
  BUTTONS.popup_upload_local.innerHTML = "Upload";
  BUTTONS.popup_upload_local.classList.remove("hidden");
  BUTTONS.popup_upload_url.innerText = "Upload";
  BUTTONS.popup_upload_url.classList.remove("hidden");
  BUTTONS.copy.classList.add("hidden");
  SELECTS.profile_menu.classList.add("hidden");
  BUTTONS.select_host.innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-database"></i> Select hosts`;
  ELEMENT_DISPLAYS.conditions_of_use.classList.remove("hidden");
  INPUTS.url_upload.classList.remove("cursor-not-allowed", "opacity-50");
  INPUTS.url_upload.removeAttribute("disabled", "")
  INPUTS.url_upload.classList.add("active:scale-[1.05]")
  BUTTONS.popup_browse.classList.remove("hidden");
  BUTTONS.upload_local_file.classList.remove("hidden");
  BUTTONS.upload_from_url.classList.remove("hidden");
  ELEMENT_DISPLAYS.set_api_key.classList.add("hidden");
  STATE.set_api_key_popup = false;
  ELEMENT_DISPLAYS.conditions_of_use_link.textContent = "See conditions of use of the host";
  enable_button(BUTTONS.popup_browse, "indigo", "small");
  BUTTONS.popup_upload_local.classList.remove("animate-pulse");
  BUTTONS.popup_upload_url.classList.remove("animate-pulse");
  document.getElementById("hr-separator").classList.remove("hidden");
  if (STATE.upload_mode == "local") {
    BUTTONS.upload_local_file.className = "mr-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/60 border border-indigo-300/30 transition duration-3.5 rounded-lg text-white";
    BUTTONS.upload_from_url.className = "ml-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/20 border border-indigo-300/20 hover:bg-indigo-500/50 transition text-indigo-100 duration-3.5 rounded-lg hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.15)] active:scale-[1.02]";
  } else {
    BUTTONS.upload_local_file.className = "mr-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/20 border border-indigo-300/20 hover:bg-indigo-500/50 transition text-indigo-100 duration-3.5 rounded-lg hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.15)] active:scale-[1.02]";
    BUTTONS.upload_from_url.className = "ml-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/60 border border-indigo-300/30 transition duration-3.5 rounded-lg cursor-not-allowed pointer-events-none text-white";
  }
  BUTTONS.upload_local_file.style.pointerEvents = "";
  BUTTONS.upload_from_url.style.pointerEvents = "";
  ELEMENT_DISPLAYS.filename_url_info.innerHTML = "";
  SELECTS.profile_menu.classList.remove("pointer-events-none", "opacity-50");
  ELEMENT_DISPLAYS.connected_info_text.classList.add("hidden");
  STATE.link_receive = 0;
};

export async function get_prohibited_formats(host) {
  let prohibited_formats = [];
  try {
    const result = await get_resource_path();
    const response = await fetch(convertFileSrc(result + "/prohibited_format.json"));
    const data = await response.json();

    if (host in data) {
      prohibited_formats = data[host];
    };

  } catch (error) {
    console.error("Error retrieving path to local application data: " + error);
  };

  return prohibited_formats;
};

export function drag_and_drop_hover() {
  if (STATE.upload_mode == "local" && !STATE.set_api_key_popup) {
    POPUPS.upload_container.classList.add("border-4", "p-20", "border-dashed", "border-slate-300");
    POPUPS.upload_container.classList.remove("border", "border-[#4c5666]");
  } else if (STATE.upload_mode == "url" || STATE.set_api_key_popup) {
    POPUPS.upload_container.classList.add("bg-red-500/20");
    POPUPS.upload_container.classList.add('animate-wiggle');

    setTimeout(function() {
      POPUPS.upload_container.classList.remove('animate-wiggle');
    }, 600);
  }
};

export function drag_and_drop_cancel() {
  POPUPS.upload_container.classList.remove("border-4", "p-20", "bg-red-500/20", "border-dashed", "border-slate-300");
  POPUPS.upload_container.classList.add("border", "border-[#4c5666]");
};

export function get_host_name_by_discriminator(discriminator) {
  const host = HOST_SITES.find(h => h.discriminator === discriminator);
  return host ? host.name : discriminator;
}

export async function check_prohibited_format(selected_file_name) {
  let prohibited_format = false;
  let prohibited_hosts = [];

  try {
    const result = await get_resource_path();
    const response = await fetch(convertFileSrc(result + "/prohibited_format.json"));
    const data = await response.json();

    const file_extension = selected_file_name.split('.').pop();

    const hosts = Array.isArray(STATE.host) ? STATE.host : [STATE.host];

    for (const host of hosts) {
      if (host in data) {
        const prohibited_formats_for_host = data[host];

        if (prohibited_formats_for_host[0] === "*") {
          if (!prohibited_formats_for_host.includes(file_extension)) {
            prohibited_format = true;
            const host_name = get_host_name_by_discriminator(host);
            prohibited_hosts = [...prohibited_hosts, host_name];
          };
        } else if (prohibited_formats_for_host.includes(file_extension)) {
          prohibited_format = true;
          const host_name = get_host_name_by_discriminator(host);
          prohibited_hosts = [...prohibited_hosts, host_name];
        }
      };
    };
  } catch (error) {
    console.error("Error retrieving path to local application data: " + error);
  };

  return { prohibited_format, prohibited_hosts };
}

export function display_info(text) {
    POPUPS.info.classList.remove("hidden");
    ELEMENT_DISPLAYS.info_text.innerHTML = `<i class="mr-1 fa-sharp fa-solid fa-circle-info"></i>` + text;
  
    POPUPS.info.addEventListener("click", function () {
      POPUPS.info.classList.add("hidden");
    });
};
  
export function upload_preparation(upload_button, host_name, indications_of_host, condition_of_use_url, api_key_link) {
  upload_button.addEventListener("click", async function () {
    STATE.last_clicked_button = this;
    POPUPS.info.classList.add("hidden");

    if (upload_button.textContent.includes("Set API key")) {
      disable_button(BUTTONS.set_api_key);
      STATE.set_api_key_popup = true;
      POPUPS.upload.classList.remove("hidden");
      INPUTS.url_upload.value = "";
      ELEMENT_DISPLAYS.final_upload_url.textContent = "";
      ELEMENT_DISPLAYS.conditions_of_use.classList.remove("hidden");
      disable_button(BUTTONS.popup_upload_url);
      INPUTS.api_key.value = "";
      BUTTONS.popup_upload_local.classList.add("hidden");
      BUTTONS.popup_upload_url.classList.add("hidden");
      BUTTONS.copy.classList.add("hidden");
      BUTTONS.popup_browse.classList.add("hidden");
      BUTTONS.upload_local_file.classList.add("hidden");
      INPUTS.url_upload.classList.add("hidden");
      BUTTONS.upload_from_url.classList.add("hidden");
      BUTTONS.delete_file_input.classList.add("hidden");
      ELEMENT_DISPLAYS.conditions_of_use_link.textContent = "Get my API key for this host (account required)";
      SELECTS.profile_menu.classList.add("hidden");
      document.getElementById("hr-separator").classList.add("hidden");
      ELEMENT_DISPLAYS.conditions_of_use_link.href = api_key_link;

      ELEMENT_DISPLAYS.set_api_key.classList.remove("hidden");

      INPUTS.api_key.addEventListener("input", function () {
        if (INPUTS.api_key.value != "") {
          enable_button(BUTTONS.set_api_key, "red", "small");
        } else if (INPUTS.api_key.value == "") {
          disable_button(BUTTONS.set_api_key);
        }
      })

      BUTTONS.set_api_key.addEventListener("click", function () {
        invoke("update_api_key", {hostName: STATE.last_clicked_button.getAttribute("api_needed"), apiKey: INPUTS.api_key.value});
        STATE.last_clicked_button.textContent = "Upload";
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
        reset_popup();
        POPUPS.upload.classList.add("hidden");
        BUTTONS.save_selected_host.classList.add("hidden");
        BUTTONS.cancel_selected_host.classList.add("hidden");
      });
    } else {
      reset_popup();

      STATE.host = host_name;

      const indication_of_host_text = document.createElement("p");
      indication_of_host_text.innerHTML = `<i class="mr-0.5 fa-sharp-duotone fa-solid fa-circle-info"></i> ${indications_of_host}`;

      const api_key_host = await get_api_key(host_name);
      if (api_key_host) {
        ELEMENT_DISPLAYS.connected_info_text.classList.remove("hidden");
      };

      const prohibited_formats = document.createElement("p");

      const result = await get_prohibited_formats(STATE.host);

      let list_content = "";

      if (result[0] == "*") {
        list_content = `<i class="mt-2 fa-sharp-duotone fa-solid fa-file-check mr-1.5"></i><strong>Only authorized</strong> file formats: `;
        result.shift();
      } else {
        list_content = `<i class="mt-2 fa-sharp-duotone fa-solid fa-file-slash mr-1"></i><strong>Forbidden</strong> file formats: `;
      };
      
      let index = 0;

      result.forEach(format => {
        const pre_element = document.createElement('pre');
        pre_element.classList.add('bg-slate-900', 'rounded-lg', 'border-separate', 'border-slate-950', 'border', 'w-fit', 'pl-1', 'pr-1', 'text-sm');
        pre_element.style.display = "inline-flex"
        pre_element.textContent = format;
        index += 1;

        if (index !== result.length) {
          list_content += pre_element.outerHTML + ', ';
        } else {
          list_content += pre_element.outerHTML;
        };
        
        prohibited_formats.innerHTML = list_content;
      });

      const indication_of_host = document.createElement("div");
      indication_of_host.classList.add("indication_of_host");
      indication_of_host.appendChild(indication_of_host_text);
      indication_of_host.appendChild(prohibited_formats);

      ELEMENT_DISPLAYS.final_upload_url.appendChild(indication_of_host);

      ELEMENT_DISPLAYS.conditions_of_use_link.href = condition_of_use_url;
    };
  });
};

export async function get_app_version() {
  try {
    const appVersion = await getVersion();
    return appVersion;
  } catch (error) {
    console.error("Error obtaining current app version: ", error);
  };
};

export function reset_table_order() {
  ELEMENT_DISPLAYS.tbody_of_providers.innerHTML = "";
  
  STATE.original_order.forEach((row, index) => {
    const original_class = index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
    row.classList.remove("bg-slate-800", "bg-gray-900");
    row.classList.add(original_class, "alternate-row");
    ELEMENT_DISPLAYS.tbody_of_providers.appendChild(row);
  });

  apply_alternate_row_colors();

  STATE.sort_states.fill(null);

  const reset_order_button = document.getElementsByClassName("ml-5 fa-sharp fa-solid fa-arrow-rotate-left");

  if (reset_order_button) {
    Array.from(reset_order_button).forEach(element => element.remove())
  };
};

export function reset_upload_profile() {
  POPUPS.profile_maker.classList.add("hidden");
  BUTTONS.popup_new_profile.innerHTML = `<i class="fa-sharp fa-solid fa-plus"></i>`;
  BUTTONS.popup_new_profile.classList.add("hidden");
  STATE.selected_profile = "";
  document.getElementById("profile_name_text").innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-pen-to-square"></i> Profile name:`;
  BUTTONS.delete_profiles.classList.add("hidden");
  BUTTONS.rename_profiles.classList.add("hidden");
  INPUTS.profile_name.value = "";
  STATE.profile_status = 0;
  disable_button(BUTTONS.rename_profiles);
  disable_button(BUTTONS.select_host);
  disable_button(BUTTONS.multiple_host_popup);

  SELECTS.select_box.forEach((checkbox) => {
    checkbox.checked = false;
  });
};

export function apply_alternate_row_colors() {
  const rows = Array.from(ELEMENT_DISPLAYS.tbody_of_providers.querySelectorAll('tr:not(.hidden)'));
  rows.forEach((row, index) => {
    row.classList.remove('bg-slate-800', 'bg-gray-900');
    row.classList.add(index % 2 === 0 ? 'bg-slate-800' : 'bg-gray-900');
  });
};
const { appWindow } = window.__TAURI__.window;
const { invoke, convertFileSrc } = window.__TAURI__.tauri;
const { resolveResource } = window.__TAURI__.path;
const { getVersion } = window.__TAURI__.app;

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener('contextmenu', event => event.preventDefault());

  const url_for_bypass_cors = "http://127.0.0.1:61337/";

  const button_gofile = document.getElementById("button_gofile");
  const button_litterbox = document.getElementById("button_litterbox");
  const button_fileio = document.getElementById("button_fileio");
  const button_tmpfilesorg = document.getElementById("button_tmpfilesorg");
  const button_0x0 = document.getElementById("button_0x0");
  const button_cvsh = document.getElementById("button_cvsh");
  const button_kitc = document.getElementById("button_kitc");
  const button_oshi = document.getElementById("button_oshi");
  const button_filebin = document.getElementById("button_filebin");
  const button_transfersh = document.getElementById("button_transfersh");
  const button_bashupload = document.getElementById("button_bashupload");
  const button_curlby = document.getElementById("button_curlby");
  const button_x0at = document.getElementById("button_x0at");
  const button_uplooad = document.getElementById("button_uplooad");
  const button_tommoteam = document.getElementById("button_tommoteam");
  const button_tempfilesninja = document.getElementById("button_tempfilesninja");
  const button_pixeldrain = document.getElementById("button_pixeldrain");
  const button_1cloudfile = document.getElementById("button_1cloudfile");
  const button_bowfile = document.getElementById("button_bowfile");
  const button_uploadify = document.getElementById("button_uploadify");
  const button_anontransfer = document.getElementById("button_anontransfer");
  const button_anonsharing = document.getElementById("button_anonsharing");
  const button_tempsh = document.getElementById("button_tempsh");
  const button_uguuse = document.getElementById("button_uguuse");
  const button_nopaste = document.getElementById("button_nopaste");
  const button_udrop = document.getElementById("button_udrop");
  const button_tempsend = document.getElementById("button_tempsend");
  const button_1fichier = document.getElementById("button_1fichier");
  const button_turbobit = document.getElementById("button_turbobit");
  const button_hitfile = document.getElementById("button_hitfile");
  const button_fileupload = document.getElementById("button_fileupload");
  const button_hexupload = document.getElementById("button_hexupload");
  const button_mexash = document.getElementById("button_mexash");
  const button_rapidfileshare = document.getElementById("button_rapidfileshare");
  const button_sendcm = document.getElementById("button_sendcm");
  const button_uploadio = document.getElementById("button_uploadio");
  const button_usercloud = document.getElementById("button_usercloud");
  const button_filetmp = document.getElementById("button_filetmp");
  const button_usersdrive = document.getElementById("button_usersdrive");
  const button_downloadgg = document.getElementById("button_downloadgg");
  const button_megaup = document.getElementById("button_megaup");
  const button_krakenfiles = document.getElementById("button_krakenfiles");
  const button_clicknupload = document.getElementById("button_clicknupload");
  const button_dailyuploads = document.getElementById("button_dailyuploads");
  const button_uploadee = document.getElementById("button_uploadee");

  const toggle_upload_mode = document.getElementById("toggle_upload_mode");
  const button_multiple_host_popup = document.getElementById("button_multiple_host_popup");

  const upload_button_generic = document.querySelectorAll('[value="upload_button"]');
  const select_box_container = document.querySelectorAll('[id="select_box_container"]');
  const select_box = document.querySelectorAll('[id="select_box"]');
  const button_save_selected_host = document.getElementById("button_save_selected_host");
  const button_cancel_selected_host = document.getElementById("button_cancel_selected_host");

  const upload_name = document.getElementById("upload_name");

  const button_upload_profile = document.getElementById("button_upload_profile");
  const profile_select = document.getElementById("profile_select");

  const popup_new_profile_button = document.getElementById("popup_new_profile_button");
  const profile_maker_popup = document.getElementById("profile_maker_popup");
  const select_host_button = document.getElementById("select_host_button");
  const profile_name_input = document.getElementById("profile_name");
  const delete_profiles_button = document.getElementById("delete_profiles_button");
  const rename_profiles_button = document.getElementById("rename_profiles_button");

  const close_button = document.getElementById("close_button");
  const minimize_button = document.getElementById("minimize_button");
  const maximize_button = document.getElementById("maximize_button");

  const update_popup = document.getElementById("update_popup");
  const new_version_text = document.getElementById("new_version_text");
  const current_version_text = document.getElementById("current_version_text");
  const popup_new_version_download = document.getElementById("popup_new_version_download");

  const upload_popup = document.getElementById("upload_popup");
  const popup_container = document.getElementById("popup_container")
  const popup_browse_button = document.getElementById("popup_browse_button");
  const popup_upload_button = document.getElementById("popup_upload_button");
  const popup_file_input = document.getElementById("popup_file_input");
  const final_upload_url = document.getElementById("final_upload_url");
  const copy_button = document.getElementById("copy_button");
  const delete_file_input = document.getElementById("delete_file_input_button");

  const select_profile_menu = document.getElementById("profile_selector");

  const conditions_of_use_link = document.getElementById("conditions_of_use_link");
  const table_of_providers = document.querySelector('[value="host"]');
  const tbody_of_providers = table_of_providers.querySelector("tbody");
  const rows_of_providers = Array.from(tbody_of_providers.querySelectorAll("tr"));

  const history_table_body = document.getElementById("history_table_body");
  const upload_history_button = document.getElementById("upload_history_button");
  const uploaded_files_history_popup = document.getElementById("uploaded_files_history_popup");
  const clear_history_button = document.getElementById("clear_history_button");

  const check_status_button = document.getElementById("check_status_button");

  const sort_states = [null, null, null];

  let window_status = "minimize";

  let requests_controller = new AbortController();
  let controller_signal = requests_controller.signal;

  close_button.addEventListener("click", () => {
    appWindow.close();
    invoke("kill_warp_cors");
  });

  minimize_button.addEventListener("click", () => {
    appWindow.minimize();
  });

  maximize_button.addEventListener("click", () => {
    if (window_status == "minimize") {
      appWindow.maximize();
      window_status = "maximize"
    } else {
      appWindow.unmaximize();
      window_status = "minimize"
    }
  })

  tbody_of_providers.innerHTML = "";
    rows_of_providers.forEach((row, index) => {
      const originalClass = index % 2 === 0 ? "bg-slate-800" : "bg-slate-700";
      row.classList.remove("bg-slate-800", "bg-slate-700");
      row.classList.add(originalClass, "alternate-row");
      tbody_of_providers.appendChild(row);
    });

  const host_sites = [
    { url: 'https://gofile.io', discriminator: 'gofile.io' },
    { url: 'https://litterbox.catbox.moe/', discriminator: 'litter.catbox.moe' },
    { url: 'https://file.io/', discriminator: 'file.io' },
    { url: 'https://tmpfiles.org/', discriminator: 'tmpfiles.org' },
    { url: 'https://0x0.st/', discriminator: '0x0.st' },
    { url: 'https://c-v.sh/', discriminator: 'c-v.sh' },
    { url: 'https://ki.tc/', discriminator: 'ki.tc' },
    { url: 'https://oshi.at/', discriminator: 'oshi.at' },
    { url: 'https://filebin.net/', discriminator: 'filebin.net' },
    { url: 'https://transfer.sh/', discriminator: 'transfer.sh' },
    { url: 'https://bashupload.com/', discriminator: 'bashupload.com' },
    { url: 'https://www.curl.by/', discriminator: 'curl.by' },
    { url: 'https://x0.at/', discriminator: 'x0.at' },
    { url: 'https://uplooad.net/', discriminator: 'uplooad.net' },
    { url: 'https://tommo.team/', discriminator: 'a.tommo.team' },
    { url: 'https://tempfiles.ninja/', discriminator: 'tempfiles.ninja' },
    { url: 'https://pixeldrain.com/', discriminator: 'pixeldrain.com' },
    { url: 'https://1cloudfile.com/', discriminator: '1cloudfile.com' },
    { url: 'https://bowfile.com/', discriminator: 'bowfile.com' },
    { url: 'https://uploadify.net/', discriminator: 'uploadify.net' },
    { url: 'https://anontransfer.com/', discriminator: 'anontransfer.com' },
    { url: 'https://anonsharing.com/', discriminator: 'anonsharing.com' },
    { url: 'https://temp.sh/', discriminator: 'temp.sh' },
    { url: 'https://uguu.se/', discriminator: 'a.uguu.se' },
    { url: 'https://nopaste.net/', discriminator: 'nopaste.net' },
    { url: 'https://www.udrop.com/', discriminator: 'www.udrop.com' },
    { url: 'https://tempsend.com/', discriminator: 'tempsend.com' },
    { url: 'https://1fichier.com/', discriminator: '1fichier.com' },
    { url: 'https://turbobit.net/', discriminator: 'turbobit.net' },
    { url: 'https://hitfile.net/', discriminator: 'hitfile.net' },
    { url: 'https://file-upload.org/', discriminator: 'file-upload.org' },
    { url: 'https://hexload.com/', discriminator: 'hexload.com' },
    { url: 'https://mexa.sh/', discriminator: 'mexa.sh' },
    { url: 'http://rapidfileshare.net/', discriminator: 'www.rapidfileshare.net' },
    { url: 'https://send.cm/', discriminator: 'send.cm' },
    { url: 'https://up-load.io/', discriminator: 'up-load.io' },
    { url: 'https://userscloud.com/', discriminator: 'userscloud.com' },
    { url: 'https://filetmp.com/', discriminator: 'filetmp.com' },
    { url: 'https://usersdrive.com/', discriminator: 'usersdrive.com' },
    { url: 'https://download.gg/', discriminator: 'download.gg' },
    { url: 'https://megaup.net/', discriminator: 'megaup.net' },
    { url: 'https://krakenfiles.com/', discriminator: 'krakenfiles.com' },
    { url: 'https://clicknupload.click/', discriminator: 'clicknupload.click' },
    { url: 'https://dailyuploads.net/', discriminator: 'dailyuploads.net' },
    { url: 'https://www.upload.ee/', discriminator: 'www.upload.ee' }
  ];

  function check_host_status(forced) {
    const requests_promises = [];
    host_sites.forEach((site) => {
    
      const last_check_date = localStorage.getItem(`${site.discriminator}_last_check_date`);
      const current_time = new Date().getTime();
  
      const last_check_status = localStorage.getItem(`${site.discriminator}_status`);

        if (forced || !last_check_date || (current_time - last_check_date > 12 * 60 * 60 * 1000)) {
          const requests_promise = fetch(url_for_bypass_cors + site.url)
              .then((response) => {
                  if (!response.ok) {
                    disable_host(site.discriminator);
                    localStorage.setItem(`${site.discriminator}_status`, 'offline');
                  } else {
                    localStorage.setItem(`${site.discriminator}_status`, 'online');
                  }
              })
              .catch(() => {
                disable_host(site.discriminator);
                localStorage.setItem(`${site.discriminator}_status`, 'offline');
              })
              .finally(() => {
                  localStorage.setItem(`${site.discriminator}_last_check_date`, current_time);
              });

          requests_promises.push(requests_promise);
        } else if (last_check_status === 'offline') {
            disable_host(site.discriminator);
        }
    });

    Promise.all(requests_promises)
    .then(() => {
      check_status_button.innerHTML = `Check host status <i class="fa-solid fa-arrows-rotate" style="color: #fefefe;"></i>`;
    })
    .catch((error) => {
      console.log(error)
    })
    
  }
  
  check_host_status(false);

  function disable_host(host) {
    const table_rows = document.querySelectorAll(".search-result");
  
    for (const row of table_rows) {
      const checkbox_element = row.querySelector('input[type="checkbox"]');
      const checkbox_value = checkbox_element.value;
  
      if (checkbox_value === host) {
        row.classList.add("opacity-50", "cursor-not-allowed", "pointer-events-none");
        row.setAttribute("disabled", "");

        const host_element = row.querySelector("td:nth-child(1)");

        const host_name = host_element.innerHTML;

        host_element.innerHTML = host_name + `<p class="ml-2" style="color: #ff2828;"><i class="fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>Offline</strong></p>`   
      }
    }
  
    return null;
  }

  function enable_hosts() {
    const table_rows = document.querySelectorAll(".search-result");

    for (const row of table_rows) {
        const host_element = row.querySelector("td:nth-child(1)");
        const host_name = host_element.innerHTML;

        if (host_name.includes("Offline")) {
            host_element.innerHTML = host_name.replace(`<p class="ml-2" style="color: #ff2828;"><i class="fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>Offline</strong></p>`, "");
            row.classList.remove("opacity-50", "cursor-not-allowed", "pointer-events-none");
            const checkbox_element = row.querySelector('input[type="checkbox"]');
            checkbox_element.removeAttribute("disabled");
        }     
    }
  }

  async function get_resource_path() {
    try {
      const resource_path = await resolveResource("Resources");
      return resource_path.slice(4);
    } catch (error) {
      console.error("Error obtaining local data directory : ", error);
    }
  }

  async function get_app_version() {
    try {
      const appVersion = await getVersion();
      return appVersion;
    } catch (error) {
      console.error("Error obtaining current app version : ", error);
    }
  }

  function is_update_available(current_version, latest_version){
    let current_version_parts = current_version.split('.');
    let latest_version_parts = latest_version.split('.');

    for (let i = 0; i < current_version_parts.length; ++i) {
        if (current_version_parts[i] === latest_version_parts[i]) {
            continue;
        }
        
        if (latest_version_parts[i] > current_version_parts[i]) {
            return true;
        }
    }
    
    return false;
  }

  get_app_version()
    .then((result) => {
      const current_version = result;
      document.getElementById("window_title").textContent = "Automatic File Uploader - " + current_version;

      fetch("https://api.github.com/repos/spel987/Automatic-File-Uploader/releases", {method: "GET"})
        .then((response) => response.json())
        .then((data) => {
          const latest_version = data[0].tag_name;

          new_version_text.innerHTML = "A new version of Automatic-File-Downloader is now available : <b>" + latest_version +"<b>";
          popup_new_version_download.href = "https://github.com/spel987/Automatic-File-Uploader/releases/latest";
          current_version_text.innerHTML = "(Current version : <b>" + current_version + "</b>)";

          if (is_update_available(current_version, latest_version)) {
            update_popup.classList.remove("hidden");
          }

          update_popup.addEventListener("click", function (event) {
            if (event.target === update_popup) {
              update_popup.classList.add("hidden");
            }
          });
        });
    })
    .catch((error) => {
      console.error("Error retrieving current app version : " + error);
    });

  let host = "";

  let is_drag_file = false

  let link_receive = 0;

  function get_value_from_path(path, json_data) {
    return path.reduce((current, key) => current?.[key], json_data);
  }

  function get_values_from_paths(paths, json_data) {
      return paths.map(path => 
          path.reduce((current, key) => current?.[key], json_data)
      ).join('/');
  }

  function disable_button(button) {
    button.classList.add("opacity-50", "cursor-not-allowed");
    button.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500", "hover:scale-[1.01]", "hover:from-violet-600", "hover:to-purple-500", "hover:scale-[1.03]", "active:scale-[1.03]", "active:scale-[1.05]");
    button.setAttribute("disabled", "");
  }

  function enable_button(button, color, size) {
    button.classList.remove("opacity-50", "cursor-not-allowed");

    if (color == "red") {
      button.classList.add("transition", "hover:from-red-500", "hover:to-rose-500");
    } else if (color == "purple") {
      button.classList.add("transition", "hover:from-violet-600", "hover:to-purple-500");
    }

    if (size == "small") {
      button.classList.add("hover:scale-[1.01]", "active:scale-[1.03]")
    } else if (size == "big") {
      button.classList.add("hover:scale-105", "active:scale-110")
    }
    
    button.removeAttribute("disabled", "");
  }

  function upload_to_host(request_data, response_format, link_extraction = [], affix = [], manage_file = []) {
    disabled_upload_button();

    fetch(request_data[0], {
      method: request_data[1],
      body: request_data[2],
      signal: controller_signal,
      headers: {
        'X-Requested-With': '*'
      },
    })
      .then((response) => {
        if (response.status === 415 || response.status === 412) {
          return Promise.reject(new Error('File format not supported by host'));
        } else if (response.status === 507) {
          return Promise.reject(new Error('Insufficient storage space'));
        } else if (response.ok) {
          if (response_format === "json") {
            return response.json();
          } else if (response_format === "text") {
            return response.text();
          }
        }
      })

      .then((data) => {
        let final_url = null;
        let delete_url = "";
        let delete_method = "";
        let delete_data = {};
        let delete_url_core = "";

        const url_prefix = (affix[0] ? affix[0] : "");
        const url_suffix = (affix[1] ? affix[1] : "");

        let url_cores = "";

        if (String(link_extraction[0]).includes("https://")) {
          url_cores = link_extraction[0];

        } else if (link_extraction[0] === "match") {
          url_cores = data.match(link_extraction[1])[link_extraction[2]];

        } else if (link_extraction[0] === "replace") {
          url_cores = data.replace(link_extraction[1], link_extraction[2]);

        } else {
          url_cores = get_value_from_path(link_extraction, data);
        }

        final_url = url_prefix + url_cores + url_suffix

        if (manage_file[0]) {
          const url_delete_prefix = (manage_file[3] && manage_file[3][0]) ?? "";
          const url_delete_suffix = (manage_file[3] && manage_file[3][1]) ?? "";
          if (manage_file[0][0] === "match") {
            delete_url_core = data.match(manage_file[0][1])[0];
          } else if (Array.isArray(manage_file[0])) {
            delete_url_core = get_values_from_paths(manage_file[0], data);
          } else {
            delete_url_core = manage_file[0];
          }

          delete_url = url_delete_prefix + delete_url_core + url_delete_suffix;
        }

        if (manage_file[1]) {
          delete_method = manage_file[1];
        }

        let delete_data_promise = new Promise((resolve) => {
        
        if (manage_file[2]) {
            let promises = [];
        
            for (const key in manage_file[2]) {
              if (manage_file[2].hasOwnProperty(key) && Array.isArray(manage_file[2][key]) && manage_file[2][key][0] === "killcode") {
                let file_id = "";

                if (manage_file[2][key][3][0] === "match"){
                  file_id = data.match(manage_file[2][key][3][1])[manage_file[2][key][3][2]]
                } else {
                  file_id = get_value_from_path(manage_file[2][key][3], data);
                }
                
                let promise = fetch(url_for_bypass_cors + manage_file[2][key][2] + file_id, {method: "GET"})
                  .then((response) => response.text())
                  .then((html_response) => {
                    const killcode_url = html_response.match(manage_file[2][key][1])[0];
                    const killcode = killcode_url.match(/killcode=([^&]+)/)[1];
                    delete_data[key] = killcode;

                    if (delete_data["token"]) {
                      return fetch(url_for_bypass_cors + killcode_url, { method: "GET" })
                        .then((response) => response.text())
                        .then((html_response) => {
                          const csrf_token = html_response.match(/<input type="hidden" name="token" value="([^"]+)">/)[1];
                          delete_data["token"] = csrf_token;
                        });
                    }
                  });
        
                promises.push(promise);

              } else if (manage_file[2].hasOwnProperty(key) && Array.isArray(manage_file[2][key]) && manage_file[2][key][0] === "match") {
                delete_data[key] = data.match(manage_file[2][key][1])[manage_file[2][key][2]];

              } else if (manage_file[2].hasOwnProperty(key) && Array.isArray(manage_file[2][key])) {
                delete_data[key] = get_value_from_path(manage_file[2][key], data);

              } else {
                delete_data = manage_file[2];
              }
            }
        
            Promise.all(promises).then(() => {
              resolve(delete_data);
            });
          } else {
            resolve(delete_data);
          }
        });

        if (final_url) {
          if (Array.isArray(final_url)) {
            final_url = final_url.join("");
          }

          if (final_url.endsWith("\n")) {
            final_url = final_url.slice(0, final_url.length - "\n".length);
          }
          const new_upload_date = new Date().toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true}).replace(",", "");

          const host_index = host.indexOf(final_url.split("/")[2]);

          const retention_duration = get_retention_duration(host[host_index]);

          const new_upload_date_formatted = new Date(new_upload_date);

          let new_expiration_date = "";

          if (retention_duration.endsWith("days")) {
            new_upload_date_formatted.setDate(new_upload_date_formatted.getDate() + parseInt(retention_duration.slice(0, -1)));
            new_expiration_date = new_upload_date_formatted.toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true}).replace(",", "");

          } else if (retention_duration.endsWith("hours")) {
            new_upload_date_formatted.setHours(new_upload_date_formatted.getHours() + parseInt(retention_duration.slice(0, -1)));
            new_expiration_date = new_upload_date_formatted.toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true,}).replace(",", "");
            
          } else if (retention_duration === "infinite") {
            new_expiration_date = "Infinite";

          } else if (retention_duration === "depends on the size of your file") {
            new_expiration_date = "Depends on the size of your file";
          }

          delete_data_promise.then((delete_data) => {
            invoke("add_history_json", {newLink: final_url, newUploadDate: new_upload_date, newExpirationDate: new_expiration_date, manageLink: delete_url, deleteMethod: delete_method, deleteParameters: JSON.stringify(delete_data)});
          });   

          display_final_url(final_url);

        } else {
          display_final_url('Unable to retrieve the download link.');
        }
      })

      .catch((error) => {
          display_final_url(error);
      });
  }

  function copy_to_clipboard(url) {
    navigator.clipboard.writeText(url);
  }

  function reset_popup() {
    upload_popup.classList.remove("hidden");
    popup_file_input.value = "";
    final_upload_url.textContent = "";
    popup_browse_button.textContent = "Browse";
    disable_button(popup_upload_button);
    popup_upload_button.innerHTML = "Upload";
    copy_button.classList.add("hidden");
    select_profile_menu.classList.add("hidden");
    document.getElementById("p-for-margin").classList.remove("hidden");
    select_host_button.textContent = "Select host";
    conditions_of_use_link.classList.remove("hidden");
    delete_file_input.classList.add("hidden");
  }

  function drag_and_drop_hover() {
    popup_container.classList.add("border-4", "p-20");
  }

  function drag_and_drop_cancel() {
    popup_container.classList.remove("border-4", "p-20");
  }

  function disabled_upload_button() {
    popup_upload_button.setAttribute("disabled", "");
    popup_upload_button.classList.add("cursor-not-allowed");
    popup_upload_button.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500", "active:scale-105");
  }

  function enable_upload_button() {
    popup_upload_button.innerHTML = "Upload";
    popup_upload_button.classList.remove("transition", "active:scale-110");
    popup_upload_button.classList.add("cursor-not-allowed", "opacity-50");
  }

  function display_final_url(result) {
    if (link_receive == 0) {
      final_upload_url.innerHTML = '';
    }

    link_receive++;

    const link_to_receive = host.length;

    const indication_of_host = document.getElementsByClassName("indication_of_host")[0];
    document.getElementById("p-for-margin").classList.remove("hidden");

    if (indication_of_host) {
      indication_of_host.classList.add("hidden");
    }

    if (String(result).includes('File format not supported by host')) {
      const final_url = document.createElement("a");
      final_url.href = "#";
      final_url.textContent = 'Error : File format are not allowed by the host.';
      
      const final_url_container = document.createElement("a");
      final_url_container.style.display = "block";
      final_url_container.appendChild(final_url);

      final_upload_url.appendChild(final_url_container);

    } else if (String(result).includes('Insufficient storage space')) {
      const final_url = document.createElement("a");
      final_url.href = "#";
      final_url.textContent = 'Error : Insufficient storage space.';

      const final_url_container = document.createElement("a");
      final_url_container.style.display = "block";
      final_url_container.appendChild(final_url);

      final_upload_url.appendChild(final_url_container);

    } else if (String(result).includes("https://") || String(result).includes("http://")) {
      const final_url = document.createElement("a");
      final_url.href = result;
      final_url.textContent = result;

      const final_url_container = document.createElement("a");
      final_url_container.href = "#";
      final_url_container.style.display = "block";
      final_url_container.innerHTML = `<a href="${result}" target="_blank">${result}</a><button id="copy_button" class="ml-2 transition active:scale-125" alt="Copy link" link_to_copy="${result}"><i class="far fa-copy"></i></button>`;

      final_upload_url.appendChild(final_url_container);

      const copy_buttons = document.querySelectorAll("[id='copy_button']");
      copy_buttons.forEach((button) => {
        button.addEventListener("click", function () {
          copy_to_clipboard(button.getAttribute("link_to_copy"));
        });
      });

    } else {
      const final_url = document.createElement("a");
      final_url.href = "#";
      final_url.textContent = 'Error : ' + result + '\n For more information, open the developper tool and look in the console and/or in the requests.';

      const final_url_container = document.createElement("a");
      final_url_container.style.display = "block";
      final_url_container.appendChild(final_url);

      final_upload_url.appendChild(final_url_container);
    }

    popup_upload_button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading... (' + link_receive + '/' + link_to_receive + ')';

    if (link_receive === link_to_receive) {
      enable_upload_button();
      link_receive = 0;

      if (link_to_receive >= 2) {
        const copy_all_button = document.createElement("a");
        copy_all_button.href = "#";
        copy_all_button.innerHTML = `<button id="copy_all_button" class="mt-5 underline transition duration-200 hover:scale-[1.02] active:scale-[1.05]">Copy all links</button>`;

        final_upload_url.appendChild(copy_all_button);

        document.getElementById("copy_all_button").addEventListener("click", function () {
            const all_links_to_copy = document.querySelectorAll("button[link_to_copy]");
            let all_links_copy = "";
            let current_link_index = 1;

            all_links_to_copy.forEach(function (link_button) {
              const link = link_button.getAttribute("link_to_copy");

              if (current_link_index < all_links_to_copy.length) {
                all_links_copy += link + "\n";

              } else {
                all_links_copy += link;
              }
              current_link_index++;
            });
            copy_to_clipboard(all_links_copy);
          });
      }
    }
  }

  function enable_drag_file() {
    upload_popup.addEventListener('dragover', function(event) {
        event.preventDefault();
        drag_and_drop_hover();
    });

    upload_popup.addEventListener('drop', function(event) {
        event.preventDefault();
        drag_and_drop_cancel();

        drag_file = event.dataTransfer.files[0];
        let filename = drag_file.name;
        drag_file_name = filename;

        if (filename.length > 30) {
            popup_browse_button.textContent = filename.substring(0, 30) + "...";
        } else {
            popup_browse_button.textContent = filename;
        }

        check_prohibited_format(filename).then((response) => {
            let prohibited_format = response;

            delete_file_input.classList.remove("hidden");

            if (host && JSON.stringify(host) !== "[]" && prohibited_format === false) {
              enable_button(popup_upload_button, "red", "big")
            }
        });

        is_drag_file = true;
    });

    upload_popup.addEventListener('dragleave', function(event) {
        drag_and_drop_cancel();
    });
  }

  let drag_file = null;
  let drag_file_name = null;

  function upload_preparation(uploadButton, hostName, indicationsSendingFiles, conditionOfUseUrl) {
    uploadButton.addEventListener("click", function () {
      reset_popup();
      
      enable_drag_file();

      host = hostName;

      const indication_of_host_text = document.createElement("a");
      indication_of_host_text.href = "#";
      indication_of_host_text.textContent = indicationsSendingFiles;

      const indication_of_host = document.createElement("div");
      indication_of_host.classList.add("indication_of_host");
      indication_of_host.appendChild(indication_of_host_text);

      final_upload_url.appendChild(indication_of_host);

      conditions_of_use_link.href = conditionOfUseUrl;
    });
  }

  function reset_upload_profile() {
    profile_maker_popup.classList.add("hidden");
    popup_new_profile_button.textContent = "Create a new profile";
    popup_new_profile_button.classList.add("hidden");
    selected_profile = "";
    document.getElementById("profile_name_text").textContent = "Profile name:";
    delete_profiles_button.classList.add("hidden");
    rename_profiles_button.classList.add("hidden");
    profile_name_input.value = "";
    profile_status = 0;
    disable_button(rename_profiles_button);
    disable_button(select_host_button);
    disable_button(button_multiple_host_popup);

    select_box.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  function get_retention_duration(host) {
    const table_rows = document.querySelectorAll(".search-result");

    for (const row of table_rows) {
      const checkbox_element = row.querySelector('input[type="checkbox"]');

      const checkbox_value = checkbox_element.value;

      if (checkbox_value === host) {
        const retention_element = row.querySelector("td:nth-child(3)");

        const retention_value = retention_element.textContent.trim();

        return retention_value;
      }
    }
  }
  
  async function check_prohibited_format(selected_file_name) {
    let prohibited_format = false;
  
    try {
      const result = await get_resource_path();
      const response = await fetch(convertFileSrc(result + "/prohibited_format.json"));
      const data = await response.json();
  
      if (host in data) {
        const prohibited_formats_for_host = data[host];
        const file_extension = selected_file_name.split('.').pop();
  
        if (prohibited_formats_for_host.includes(file_extension)) {
          prohibited_format = true;
        }
      }
  
    } catch (error) {
      console.error("Error retrieving path to local application data: " + error);
    }
  
    return prohibited_format;
  }

  popup_browse_button.addEventListener("click", function () {
    popup_file_input.click();
  });

  popup_file_input.addEventListener("change", function () {
    const filename = popup_file_input.files[0].name;
    is_drag_file = false

    if (filename.length > 30) {
      popup_browse_button.textContent = filename.substring(0, 30) + "...";
    } else {
      popup_browse_button.textContent = filename;
    }

    check_prohibited_format(popup_file_input.files[0].name).then((response) => {
      let prohibited_format = response

      delete_file_input.classList.remove("hidden");

      if (host && JSON.stringify(host) !== "[]" && prohibited_format === false) {
        enable_button(popup_upload_button, "red", "big")
      }
    });
  });

  upload_popup.addEventListener("click", function (event) {
    if (event.target === upload_popup) {
      requests_controller.abort();
      requests_controller = new AbortController();
      controller_signal = requests_controller.signal;
      upload_popup.classList.add("hidden");
      popup_new_profile_button.classList.add("hidden");
      popup_new_profile_button.textContent = "Create a new profile";
      reset_upload_profile();
    }
  });

  let selected_profile = "";

  function load_profiles() {
    get_resource_path()
      .then((result) => {
        fetch(convertFileSrc(result + "/profiles.json"))
          .then((response) => response.json())
          .then((data) => {
            profile_select.innerHTML = `<option id="default_option" value="default" disabled selected>Select a profile</option>`;
            for (const profil in data) {
              if (data.hasOwnProperty(profil)) {
                const option = document.createElement("option");
                option.value = profil;
                option.text = profil;
                profile_select.appendChild(option);
              }
            }

            profile_select.addEventListener("change", function () {
              selected_profile = profile_select.value;
              const values = data[selected_profile];

              popup_new_profile_button.textContent = 'Edit "' + selected_profile + '"';

              host = [];

              for (const host_site of values) {
                host.push(host_site);
              }

              if (host && JSON.stringify(host) !== "[]" && popup_file_input.files.length > 0) {
                enable_button(popup_upload_button, "red", "big");
              }
            });
          });
      })
      .catch((error) => {
        console.error("Error retrieving path app data local : " + error);
      });
  }

  button_upload_profile.addEventListener("click", function () {
    load_profiles();
    host = [];
    reset_popup();
    conditions_of_use_link.classList.add("hidden");
    select_profile_menu.classList.remove("hidden");
    popup_new_profile_button.classList.remove("hidden");
    upload_button_generic.forEach((element) => {
      element.classList.remove("hidden");
    });
    select_box_container.forEach((element) => {
      element.classList.add("hidden");
    });

    upload_name.textContent = "Upload";
    toggle_upload_mode.textContent = "Switch to multiple upload mode";
    button_multiple_host_popup.classList.add("hidden");
    button_upload_status = 0;
    profile_select.value = "default";
  });

  let profile_status = 0;

  popup_new_profile_button.addEventListener("click", function () {
    if (selected_profile !== "") {
      document.getElementById("profile_name_text").textContent = 'New profile name:';
      delete_profiles_button.classList.remove("hidden");
      delete_profiles_button.innerHTML = 'Delete profile';
      rename_profiles_button.classList.remove("hidden");
      rename_profiles_button.innerHTML = 'Rename profile';
      select_host_button.textContent = 'Change selected hosts';
      profile_status = 1;
      enable_button(select_host_button, "purple", "small");
    }
    upload_popup.classList.add("hidden");
    profile_maker_popup.classList.remove("hidden");
  });

  profile_maker_popup.addEventListener("click", function (event) {
    if (event.target === profile_maker_popup) {
      reset_upload_profile();
    }
  });

  select_host_button.addEventListener("click", function () {
    disable_button(button_save_selected_host);
    profile_maker_popup.classList.add("hidden");
    upload_button_generic.forEach((element) => {
      element.classList.add("hidden");
    });
    select_box_container.forEach((element) => {
      element.classList.remove("hidden");
    });

    upload_name.textContent = "Selected";

    select_box.forEach((checkbox) => {
      if (host.includes(checkbox.value)) {
          checkbox.checked = true;
      }
    });

    button_save_selected_host.classList.remove("hidden");
    button_cancel_selected_host.classList.remove("hidden");
  });

  button_save_selected_host.addEventListener("click", function () {
    const selected_host = [];

    select_box.forEach((checkbox) => {
      if (checkbox.checked) {
        selected_host.push(checkbox.value);
      }
    });

    let profile_name = "";

    if (profile_status === 0) {
      profile_name = profile_name_input.value;
    } else if (profile_status === 1) {
      profile_name = selected_profile;
    }

    invoke("add_profile_json", {profileName: profile_name, selectedHost: selected_host});

    upload_button_generic.forEach((element) => {
      element.classList.remove("hidden");
    });
    select_box_container.forEach((element) => {
      element.classList.add("hidden");
    });
    upload_name.textContent = "Upload";
    button_save_selected_host.classList.add("hidden");
    button_cancel_selected_host.classList.add("hidden");
    reset_upload_profile();
  });

  button_cancel_selected_host.addEventListener("click", function () {
    upload_button_generic.forEach((element) => {
      element.classList.remove("hidden");
    });
    select_box_container.forEach((element) => {
      element.classList.add("hidden");
    });
    upload_name.textContent = "Upload";

    button_save_selected_host.classList.add("hidden");
    button_cancel_selected_host.classList.add("hidden");
    reset_upload_profile();
  })

  let button_upload_status = 0;

  toggle_upload_mode.addEventListener("click", function () {
    if (button_upload_status === 0) {
      upload_button_generic.forEach((element) => {
        element.classList.add("hidden");
      });
      select_box_container.forEach((element) => {
        element.classList.remove("hidden");
      });

      upload_name.textContent = "Selected";
      toggle_upload_mode.textContent = "Switch to single upload mode";
      button_multiple_host_popup.classList.remove("hidden");
      button_upload_status = 1;

    } else if (button_upload_status === 1) {
      upload_button_generic.forEach((element) => {
        element.classList.remove("hidden");
      });
      select_box_container.forEach((element) => {
        element.classList.add("hidden");
      });

      upload_name.textContent = "Upload";
      toggle_upload_mode.textContent = "Switch to multiple upload mode";
      button_multiple_host_popup.classList.add("hidden");
      button_upload_status = 0;
    }
  });

  select_box.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (Array.from(select_box).some(checkbox => checkbox.checked)) {
            enable_button(button_save_selected_host, "purple", "small");
            enable_button(button_multiple_host_popup, "red", "small");
        } else {
            disable_button(button_save_selected_host);
            disable_button(button_multiple_host_popup);
        }
    });
  });

  button_multiple_host_popup.addEventListener("click", function () {
    reset_popup();

    enable_drag_file();

    const selected_host = [];

    select_box.forEach((checkbox) => {
      if (checkbox.checked) {
        selected_host.push(checkbox.value);
      }
    });

    host = selected_host;
    document.getElementById("p-for-margin").classList.add("hidden");
    conditions_of_use_link.classList.add("hidden");
  });

  delete_file_input.addEventListener("click", function () {
    popup_file_input.value = "";
    disabled_upload_button();
    popup_upload_button.classList.add("opacity-50");
    popup_browse_button.textContent = "Browse";
    delete_file_input.classList.add("hidden");
  });

  delete_profiles_button.addEventListener("click", function () {
    invoke("delete_profile_json", { profileName: selected_profile });
    profile_maker_popup.classList.add("hidden");
    reset_upload_profile();
  });

  rename_profiles_button.addEventListener("click", function () {
    invoke("rename_profile_json", {
      oldProfileName: selected_profile,
      newProfileName: profile_name_input.value,
    });
    reset_upload_profile();
  });

  profile_name_input.addEventListener("input", function () {
    if (profile_name_input.value) {
      enable_button(rename_profiles_button, "purple", "small");

      if (profile_status === 0) {
        enable_button(select_host_button, "purple", "small");
      }

    } else {
      disable_button(rename_profiles_button);

      if (profile_status === 0) {
        disable_button(select_host_button);
      }
    }
  });

  upload_history_button.addEventListener("click", function () {
    uploaded_files_history_popup.classList.remove("hidden");

    while (history_table_body.firstChild) {
      history_table_body.removeChild(history_table_body.firstChild);
    }

    get_resource_path()
      .then((result) => {
        fetch(convertFileSrc(result + "/history.json"))
          .then((response) => response.json())
          .then((data) => {
            const keys = Object.keys(data).reverse();

            for (const link of keys) {
              const row = document.createElement("tr");
              const link_cell = document.createElement("td");
              const link_text = document.createElement("a");
              link_cell.className = "border px-4 py-2 max-w-sm truncate";
              link_text.textContent = link;
              link_cell.classList.add("text-sky-400");
              link_text.href = link;
              link_text.target = '_blank'

              enable_button(clear_history_button, "red", "big");

              const upload_date_cell = document.createElement("td");
              upload_date_cell.className = "border px-4 py-2";
              upload_date_cell.textContent = data[link].date_upload;

              const expiration_date_cell = document.createElement("td");
              expiration_date_cell.className = "border px-4 py-2";

              const expiry_date = new Date(data[link].date_expires);
              const current_date = new Date();

              const difference_in_milliseconds = Math.abs(current_date - expiry_date);
              const difference_in_minutes = Math.floor(difference_in_milliseconds / (1000 * 60));
              const difference_in_hours = Math.floor(difference_in_minutes / 60);
              const difference_in_days = Math.floor(difference_in_hours / 24);
              const remaining_hours = difference_in_hours % 24;
              const remaining_minutes = difference_in_minutes % 60;

              let time_to_expiration = "";
              
              if (current_date > expiry_date ) {
                time_to_expiration = `<p style="color: #ff2828;"><i class="fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>Expired file</strong></p>`;
              } else if (localStorage.getItem(`${link}_alive`) == "deleted") {
                time_to_expiration = `<p style="color: #ff2828;"><i class="fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>File deleted</strong></p>`;
              } else if (data[link].date_expires == "Depends on the size of your file") {
                time_to_expiration = "Depends on the size of your file";
              } else if (data[link].date_expires == "Infinite") {
                time_to_expiration = "Infinite";
              } else if (difference_in_days >= 1) {
                time_to_expiration = difference_in_days + "d " + remaining_hours + "h";
              } else if (difference_in_hours >= 1){
                time_to_expiration = remaining_hours + "h " + remaining_minutes + "min";
              } else {
                time_to_expiration = difference_in_minutes + "min";
              }

              expiration_date_cell.innerHTML = time_to_expiration;

              const delete_link_cell = document.createElement("td");
              const delete_link_button = document.createElement("button");
              delete_link_cell.className = "border px-4 py-2";

              const file_status = localStorage.getItem(`${link}_file_status`);

              if (data[link].manage[0] && file_status != "delete") {
                delete_link_button.innerHTML = `<button class="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg transition duration-200 hover:scale-[1.03] hover:from-red-500 hover:to-rose-500 active:scale-[1.05]" id="delete_file" value=${link}>Delete file <i class="fa-solid fa-trash"></i></button>`;
              } else {
                delete_link_button.innerHTML = `<div class="inline-block relative group">
                <button class="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg transition duration-200 opacity-50 cursor-not-allowed" id="delete_file" disabled>Delete file <i class="fa-solid fa-trash"></i></button>
            
                  <div class="absolute bottom-full mb-1 group-hover:block w-48 hidden">
                      <div class="bg-slate-900 text-white text-xs rounded-lg py-1 px-2">
                      The host doesn't offer a delete option, or the file has already been deleted.
                      </div>
                  </div>
                </div>`;
              }

              link_cell.appendChild(link_text);
              row.appendChild(link_cell);
              row.appendChild(upload_date_cell);
              row.appendChild(expiration_date_cell);
              delete_link_cell.appendChild(delete_link_button);
              row.appendChild(delete_link_cell);

              history_table_body.appendChild(row);

            }

            document.querySelectorAll("#delete_file").forEach(button => {
              button.addEventListener("click", function () {               
                const delete_url = data[button.value].manage[0]
                const delete_method = data[button.value].manage[1]
                const delete_data = data[button.value].manage[2]
                button.innerHTML = `Delete file <i class="fas fa-spinner fa-spin"></i>`

                let delete_data_formatted = Object.keys(delete_data).map(key => {
                  return encodeURIComponent(key) + '=' + encodeURIComponent(delete_data[key]);
                }).join('&');

                let delete_request_config = {
                  method: delete_method,
                  headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"
                  }
                };

                if (delete_method !== "GET") {
                  delete_request_config.body = delete_data_formatted;
                }

                fetch(url_for_bypass_cors + delete_url, delete_request_config)
                .then(response => {
                  disable_button(button);
                  const time_to_expiration = button.parentNode.parentNode.parentNode.children[2];                  
                  button.innerHTML = `Delete file <i class="fa-solid fa-check"></i>`
                  setTimeout(function() {
                    button.innerHTML = 'Delete file <i class="fa-solid fa-trash"></i>';
                  }, 1500);
                  time_to_expiration.innerHTML = `<p style="color: #ff2828;"><i class="fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>File deleted</strong></p>`;
                  localStorage.setItem(`${button.value}_file_status`, 'delete');
                  localStorage.setItem(`${button.value}_alive`, 'deleted');
                })
              })
            })
          });
      })
      .catch((error) => {
        console.error("Error retrieving path to local application data : " + error);
      });
  });

  uploaded_files_history_popup.addEventListener("click", function (event) {
    if (event.target === uploaded_files_history_popup) {
      uploaded_files_history_popup.classList.add("hidden");
    }
  });

  clear_history_button.addEventListener("click", function () {
    invoke("clear_history_json");

    uploaded_files_history_popup.classList.add("hidden");
    disable_button(clear_history_button);
  });

  check_status_button.addEventListener("click", function () {
    enable_hosts();
    check_status_button.innerHTML = `Check host status <i class="fas fa-spinner fa-spin"></i>`;
    check_host_status(true);
  })

  upload_preparation(button_gofile, ["gofile.io"], "Gofile has no known bugs or problems.", "https://gofile.io/terms");
  upload_preparation(button_litterbox, ["litter.catbox.moe"], "Litterbox is regularly down and does not accept .exe, .scr, .cpl, .doc*, .jar files.", "https://litterbox.catbox.moe/faq.php");
  upload_preparation(button_fileio, ["file.io"], "File.io has no known bugs or problems.", "https://www.file.io/tos/");
  upload_preparation(button_tmpfilesorg, ["tmpfiles.org"], "TmpFiles.org does not accept .js, .html files.", "https://tmpfiles.org/about");
  upload_preparation(button_0x0, ["0x0.st"], "0x0.st doe not accept .exe, .rar, .jar, .apk, .scr, .dll files", "https://0x0.st/");
  upload_preparation(button_cvsh, ["c-v.sh"], "C-V.sh has no known bugs or problems.", "https://c-v.sh/");
  upload_preparation(button_kitc, ["ki.tc"], "Ki.tc has no known bugs or problems.", "https://logic-gate-demo.readthedocs.io/en/latest/readme.html");
  upload_preparation(button_oshi, ["oshi.at"], "Oshi.at is inaccessible from certain IPs with the error \"Connection reset\".", "https://oshi.at/abuse");
  upload_preparation(button_filebin, ["filebin.net"], "Filebin often runs out of storage.", "https://filebin.net/terms");
  upload_preparation(button_transfersh, ["transfer.sh"], "Transfer.sh has no known bugs or problems.", "https://transfer.sh/");
  upload_preparation(button_bashupload, ["bashupload.com"], "Bashupload.com allows only one download per link.", "https://bashupload.com/disclaimer");
  upload_preparation(button_curlby, ["curl.by"], "Curl.by has no known bugs or problems.", "https://www.curl.by/disclaimer");
  upload_preparation(button_x0at, ["x0.at"], "x0.at does not accept .exe, .rar, .jar, .apk, .scr, .dll files.", "https://x0.at/");
  upload_preparation(button_uplooad, ["uplooad.net"], "Uplooad has no known bugs or problems.", "https://uplooad.net/tos.html");
  upload_preparation(button_tommoteam, ["a.tommo.team"], "Tommo.team has no known bugs or problems.", "https://tommo.team/faq.html");
  upload_preparation(button_tempfilesninja, ["tempfiles.ninja"], "tempfiles.ninja has no known bugs or problems.", "https://tempfiles.ninja/");
  upload_preparation(button_pixeldrain, ["pixeldrain.com"], "Pixeldrain has no known bugs or problems.", "https://pixeldrain.com/abuse");
  upload_preparation(button_1cloudfile, ["1cloudfile.com"], "1Cloudfile has no known bugs or problems.", "https://1cloudfile.com/terms");
  upload_preparation(button_bowfile, ["bowfile.com"], "Bowfile has no known bugs or problems.", "https://bowfile.com/terms");
  upload_preparation(button_uploadify, ["uploadify.net"], "Uplodify imposes a 20-second waiting time before the file can be downloaded.", "https://uploadify.net/terms.html");
  upload_preparation(button_anontransfer, ["anontransfer.com"], "AnonTransfer does not accept all file formats.", "https://anontransfer.com/terms");
  upload_preparation(button_anonsharing, ["anonsharing.com"], "AnonSharing imposes a 20-second waiting time before the file can be downloaded.", "https://anonsharing.com/terms");
  upload_preparation(button_tempsh, ["temp.sh"], "Temp.sh has no known bugs or problems.", "https://temp.sh/");
  upload_preparation(button_uguuse, ["a.uguu.se"], "Uguu.se does not accept .exe files.", "https://uguu.se/faq.html");
  upload_preparation(button_nopaste, ["nopaste.net"], "Nopaste has no known bugs or problems.", "https://nopaste.net/");
  upload_preparation(button_udrop, ["www.udrop.com"], "udrop does not accept .exe, .dll, .apk files.", "https://www.udrop.com/terms");
  upload_preparation(button_tempsend, ["tempsend.com"], "Tempsend has no known bugs or problems.", "https://tempsend.com/");
  upload_preparation(button_1fichier, ["1fichier.com"], "1fichier limits the connection during download and imposes a waiting time between file downloads.", "https://img.1fichier.com/2021-10-01-CGU.pdf");
  upload_preparation(button_turbobit, ["turbobit.net"], "Turbobit limits the connection during download and imposes a waiting time between file downloads.", "https://turbobit.net/rules");
  upload_preparation(button_hitfile, ["hitfile.net"], "Hitfile limits the connection during download and imposes a waiting time between file downloads.", "https://hitfile.net/rules");
  upload_preparation(button_fileupload, ["file-upload.org"], "file-upload.org limits the connection during download and imposes a waiting time before the file can be downloaded.", "https://www.file-upload.org/tos.html");
  upload_preparation(button_hexupload, ["hexload.com"], "HexUpload does not accept .jpeg, .jpg, .png files.", "https://hexload.com/tos.html");
  upload_preparation(button_mexash, ["mexa.sh"], "Mexa.sh does not accept .exe files.", "https://mexa.sh/tos.html");
  upload_preparation(button_rapidfileshare, ["www.rapidfileshare.net"], "RapidFileShare limits the connection and restricts downloads to 1GB per day.", "http://rapidfileshare.net/tos.html");
  upload_preparation(button_sendcm, ["send.cm"], "Send.cm has no known bugs or problems.", "https://send.cm/terms");
  upload_preparation(button_uploadio, ["up-load.io"], "up-load.io imposes a 30-second delay before the file can be downloaded.", "https://up-load.io/tos.html");
  upload_preparation(button_usercloud, ["userscloud.com"], "Userscloud has no known bugs or problems.", "https://userscloud.com/tos.html");
  upload_preparation(button_filetmp, ["filetmp.com"], "FileTmp has no known bugs or problems.", "https://filetmp.com/");
  upload_preparation(button_usersdrive, ["usersdrive.com"], "UsersDrive imposes a 17-second waiting time before the file can be downloaded.", "https://usersdrive.com/tos.html");
  upload_preparation(button_downloadgg, ["download.gg"], "Download.gg has no known bugs or problems.", "https://download.gg");
  upload_preparation(button_megaup, ["megaup.net"], "MegaUp imposes a 5-second waiting time before the file can be downloaded.", "https://megaup.net/terms.html");
  upload_preparation(button_krakenfiles, ["krakenfiles.com"], "KrakenFiles has no known bugs or problems.", "https://krakenfiles.com/terms");
  upload_preparation(button_clicknupload, ["clicknupload.click"], "Clicknupload imposes a 12-second waiting time before the file can be downloaded.", "https://clicknupload.click/tos.html");
  upload_preparation(button_dailyuploads, ["dailyuploads.net"], "Daily Uploads has no known bugs or problems.", "https://dailyuploads.net/tos.html");
  upload_preparation(button_uploadee, ["www.upload.ee"], "Upload.ee has no known bugs or problems.", "https://www.upload.ee/rules.html");

  popup_upload_button.addEventListener("click", function (event) {
    event.preventDefault();

    popup_upload_button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    let file_to_upload = "";
    let file_to_upload_name = "";

    if (is_drag_file === false) {
      file_to_upload = popup_file_input.files[0];
      file_to_upload_name = popup_file_input.files[0].name;
    } else {
      file_to_upload = drag_file;
      file_to_upload_name = drag_file_name;
    }

    host.forEach(function (current_host) {
      const sent_data_form = new FormData();

      if (current_host === "gofile.io") {
        fetch(url_for_bypass_cors + "https://api.gofile.io/getServer", {method: "GET", headers: {"Content-Type": "application/json", "X-Requested-With": "*"}})
          .then((response) => response.json())
          .then((data) => {
            const gofile_server = data.data.server;
            sent_data_form.append("file", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://" + gofile_server + ".gofile.io/uploadFile", "POST", sent_data_form], "json", ["data", "downloadPage"], [], ["https://api.gofile.io/deleteContent", "DELETE", {"contentsId": ["data", "parentFolder"], "token": ["data", "guestToken"]}]);
        });

      } else if (current_host === "litter.catbox.moe") {
        sent_data_form.append("reqtype", "fileupload");
        sent_data_form.append("time", "24h");
        sent_data_form.append("fileToUpload", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://litterbox.catbox.moe/resources/internals/api.php", "POST", sent_data_form], "text");

      } else if (current_host === "file.io") {
        sent_data_form.append("file", file_to_upload);
        upload_to_host(["https://file.io/", "POST", sent_data_form], "json", ["link"]);

      } else if (current_host === "tmpfiles.org") {
        sent_data_form.append("file", file_to_upload);
        upload_to_host(["https://tmpfiles.org/api/v1/upload", "POST", sent_data_form], "json", ["data", "url"]);

      } else if (current_host === "0x0.st") {
        sent_data_form.append("file", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://0x0.st/", "POST", sent_data_form], "text");

      } else if (current_host === "c-v.sh") {
        sent_data_form.append("a", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://c-v.sh/", "POST", sent_data_form], "text", ["match", /https:\/\/c-v\.sh\/[^\s]+/, 0]);

      } else if (current_host === "ki.tc") {
        sent_data_form.append("file", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://ki.tc/file/u/", "POST", sent_data_form], "json", ["file", "download_page"]);

      } else if (current_host === "oshi.at") {
        sent_data_form.append("f", file_to_upload);
        sent_data_form.append("expire", "120");
        upload_to_host([url_for_bypass_cors + "https://oshi.at/", "POST", sent_data_form], "text", ["match", /(?<=DL: )\S+/, 0], [], [["match", /(?<=MANAGE: )\S+/], "GET", {}, ["", "?delete=1"]]);

      } else if (current_host === "filebin.net") {
        const bin = (Math.random() + 1).toString(36).substring(2, 12);
        const filename = (Math.random() + 1).toString(36).substring(2, 12);
        const url_filebin = "https://filebin.net/" + bin + "/" + filename;
        upload_to_host([url_for_bypass_cors + url_filebin, "POST", file_to_upload], "json", [url_filebin], [], [url_filebin, "DELETE"]);

      } else if (current_host === "transfer.sh") {
        upload_to_host([url_for_bypass_cors + "https://transfer.sh/" + file_to_upload_name, "PUT", file_to_upload], "text");

      } else if (current_host === "bashupload.com") {
        sent_data_form.append("file_1", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://bashupload.com/", "POST", sent_data_form], "text", ["match", /https:\/\/bashupload\.com\/[^\s]+/, 0]);

      } else if (current_host === "curl.by") {
        sent_data_form.append("file_3", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://curl.by/", "POST", sent_data_form], "text", ["match", /http:\/\/curl\.by\/[^\s]+/, 0]);

      } else if (current_host === "x0.at") {
        sent_data_form.append("file", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://x0.at/", "POST", sent_data_form], "text");

      } else if (current_host === "uplooad.net") {
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://serv1.uplooad.net/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://uplooad.net/"], ["https://uplooad.net", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/www\.uplooad\.net\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://uplooad.net/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);

      } else if (current_host === "a.tommo.team") {
        sent_data_form.append("files[]", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://www.tommo.team/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);

      } else if (current_host === "tempfiles.ninja") {
        upload_to_host([url_for_bypass_cors + "https://tempfiles.ninja/api/upload?filename=" + file_to_upload_name, "POST", file_to_upload], "json", ["download_url"], [], [[["id"], ["delete_password"]], "DELETE", {}, ["https://tempfiles.ninja/api/delete/"]]);

      } else if (current_host === "pixeldrain.com") {
        upload_to_host([url_for_bypass_cors + "https://pixeldrain.com/api/file/" + file_to_upload_name, "PUT", file_to_upload], "json", ["id"], ["https://pixeldrain.com/u/"]);

      } else if (current_host === "1cloudfile.com") {
        sent_data_form.append("files[]", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://fs2.1cloudfile.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"]], "POST", {"submitted": "1"}]);

      } else if (current_host === "bowfile.com") {
        sent_data_form.append("files[]", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://fs1.bowfile.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"]], "POST", {"submitted": "1"}]);

      } else if (current_host === "uploadify.net") {
        sent_data_form.append("files[]", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://uploadify.net/core/page/ajax/file_upload_handler.ajax.php", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"]], "POST", {"delete": "1", "submitme": "1", "returnAccount": "0", "submit": ""}]);

      } else if (current_host === "anontransfer.com") {
        sent_data_form.append("file", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://www.anontransfer.com/upload.php", "POST", sent_data_form], "json", ["uri"]);

      } else if (current_host === "anonsharing.com") {
        sent_data_form.append("files[]", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://anonsharing.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"]], "POST", {"submitted": "1"}]);

      } else if (current_host === "temp.sh") {
        sent_data_form.append("file", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://temp.sh/upload", "POST", sent_data_form], "text");

      } else if (current_host === "a.uguu.se") {
        sent_data_form.append("files[]", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://uguu.se/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);

      } else if (current_host === "nopaste.net") {
        upload_to_host([url_for_bypass_cors + "https://nopaste.net/", "PUT", file_to_upload], "text", ["match", /https:\/\/nopaste\.net\/([A-Za-z0-9]+)/, 0]);

      } else if (current_host === "www.udrop.com") {
        sent_data_form.append("files[]", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://www.udrop.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"]], "POST", {"submitted": "1"}]);

      } else if (current_host === "tempsend.com") {
        sent_data_form.append("file", file_to_upload);
        sent_data_form.append("expire", "604800");
        upload_to_host([url_for_bypass_cors + "https://tempsend.com/send", "POST", sent_data_form], "text", ["match", /https:\/\/tempsend\.com\/([A-Za-z0-9]+)/, 0]);

      } else if (current_host === "1fichier.com") {
        disabled_upload_button();

        fetch(url_for_bypass_cors + "https://api.1fichier.com/v1/upload/get_upload_server.cgi", {method: "POST", headers: {"Content-Type": "application/json", "X-Requested-With": "*"}})
          .then((response) => response.json())
          .then((data) => {
            const url_1fichier_for_upload = data.url;
            const id_1fichier_for_upload = data.id;

            sent_data_form.append("file[]", file_to_upload);
            sent_data_form.append("send_ssl", "on");
            sent_data_form.append("domain", "0");
            sent_data_form.append("mail", "");
            sent_data_form.append("dpass", "");
            sent_data_form.append("mails", "");
            sent_data_form.append("message", "");
            sent_data_form.append("did", "0");
            sent_data_form.append("submit", "Envoyer");
            upload_to_host([url_for_bypass_cors + "https://" + url_1fichier_for_upload + "/upload.cgi?id=" + id_1fichier_for_upload, "POST", sent_data_form], "text", ["match", /https:\/\/1fichier\.com\/\?([A-Za-z0-9]+)/, 0], [], [["match", /https:\/\/1fichier\.com\/remove\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)/], "POST", {"force": "1"}]);
        });

      } else if (current_host === "turbobit.net") {
        sent_data_form.append("apptype", "fd1");
        sent_data_form.append("sort-by", "defaultSort");
        sent_data_form.append("sort-by", "defaultSort");
        sent_data_form.append("sort-by", "defaultSort");
        sent_data_form.append("Filedata", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://s341.turbobit.net/uploadfile", "POST", sent_data_form], "json", ["id"], ["https://turbobit.net/", ".html"]);

      } else if (current_host === "hitfile.net") {
        sent_data_form.append("apptype", "fd2");
        sent_data_form.append("Filedata", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://s379.hitfile.net/uploadfile", "POST", sent_data_form], "json", ["id"], ["https://hitfile.net/"]);

      } else if (current_host === "file-upload.org") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("file_descr", "");
        sent_data_form.append("file_public", "1");
        sent_data_form.append("link_rcpt", "");
        sent_data_form.append("link_pass", "");
        sent_data_form.append("to_folder", "");
        sent_data_form.append("upload", "Start upload");
        sent_data_form.append("", "Add more");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://f3.file-upload.download/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://file-upload.org/"], ["https://file-upload.org", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/www\.file-upload\.org\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://file-upload.org/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);

      } else if (current_host === "hexload.com") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("mode", "");
        sent_data_form.append("file_public", "");
        sent_data_form.append("link_rcpt", "");
        sent_data_form.append("link_pass", "");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://hetbuild860092.takeplcdn.art/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://hexload.com/"], ["https://hexload.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/hexload\.com\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://hexload.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);

      } else if (current_host === "mexa.sh") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("to_folder", "");
        sent_data_form.append("", "Start upload");
        sent_data_form.append("", "Add more");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://srv68.mexa.sh/cgi-bin/upload.cgi?upload_type=file", "POST", sent_data_form], "json", [0, "file_code"], ["https://mexa.sh/", ".html"], ["https://mexa.sh", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/mexa\.sh\/[A-Za-z0-9]+\/[A-Za-z0-9\W]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://mexa.sh/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes"}]);

      } else if (current_host === "www.rapidfileshare.net") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("file_descr", "");
        sent_data_form.append("file_public", "");
        sent_data_form.append("link_rcpt", "");
        sent_data_form.append("link_pass", "");
        sent_data_form.append("to_folder", "");
        sent_data_form.append("upload", "Start upload");
        sent_data_form.append("", "Add more");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "http://trinity.rapidfileshare.net/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["http://www.rapidfileshare.net/", ".html"], ["http://www.rapidfileshare.net", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /http:\/\/www\.rapidfileshare\.net\/[A-Za-z0-9]+\/[A-Za-z0-9\W]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "http://www.rapidfileshare.net/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);

      } else if (current_host === "send.cm") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("hidden", "");
        sent_data_form.append("file_public", "");
        sent_data_form.append("enableemail", "");
        sent_data_form.append("link_rcpt", "");
        sent_data_form.append("link_pass", "");
        sent_data_form.append("file_expire_time", "15");
        sent_data_form.append("file_expire_unit", "DAY");
        sent_data_form.append("file_max_dl", "");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://u1534.send.cm/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://send.cm/"]);

      } else if (current_host === "up-load.io") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("file_public", "1");
        sent_data_form.append("link_rcpt", "");
        sent_data_form.append("link_pass", "");
        sent_data_form.append("to_folder", "");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://s2.up-load.download/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://up-load.io/"], ["https://up-load.io", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/up-load\.io\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://up-load.io/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);

      } else if (current_host === "userscloud.com") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("link_rcpt", "");
        sent_data_form.append("link_pass", "");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://u1241.userscloud.com/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://userscloud.com/"], ["https://userscloud.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/userscloud\.com\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://userscloud.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes"}]);

      } else if (current_host === "filetmp.com") {
        fetch(url_for_bypass_cors + "https://filetmp.com/upload/genid?_=" + Date.now(), {method: "GET", headers: {"Content-Type": "application/json", "X-Requested-With": "*"}})
          .then((response) => response.json())
          .then((data) => {
            const filetmp_upload_id = data.upload_id;

            const data_filetmp = {destruct: "no", "email_to[]": "", share: "link", email_from: "", message: "", password: "", expire: "3600", upload_id: filetmp_upload_id};

            const data_filetmp_encoded = new URLSearchParams(data_filetmp).toString();

            fetch(url_for_bypass_cors + "https://filetmp.com/upload/register", {method: "POST", body: data_filetmp_encoded, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest"}})
              .then((response) => response.json())
              .then((data) => {
                sent_data_form.append("upload_id", filetmp_upload_id);
                sent_data_form.append("files[]", file_to_upload);
                upload_to_host([url_for_bypass_cors + "https://filetmp.com/upload", "POST", sent_data_form], "json", ["https://filetmp.com/" + filetmp_upload_id]);
              });
        });

      } else if (current_host === "usersdrive.com") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("link_rcpt", "");
        sent_data_form.append("link_pass", "");
        sent_data_form.append("to_folder", "");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://d600.userdrive.me/cgi-bin/upload.cgi?upload_type=file", "POST", sent_data_form], "json", [0, "file_code"], ["https://usersdrive.com/", ".html"], ["https://usersdrive.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/usersdrive\.com\/[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://usersdrive.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);

      } else if (current_host === "download.gg") {
        sent_data_form.append("file[]", file_to_upload);
        upload_to_host([url_for_bypass_cors + "https://download.gg/server/upload.php", "POST", sent_data_form], "text", ["replace", "&", "_"], ["https://download.gg/file-"], ["https://download.gg/server/delete.php", "POST", {"send-id-file-delete": ["match", /^\d+/]}]);

      } else if (current_host === "megaup.net") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("cTracker", "");
        sent_data_form.append("maxChunkSize", "100000000");
        sent_data_form.append("folderId", "");
        sent_data_form.append("files[]", file_to_upload);

        upload_to_host([url_for_bypass_cors + "https://f8.megaup.net/core/page/ajax/file_upload_handler.ajax.php", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"]], "POST", {"delete": "1", "submitme": "1", "returnAccount": "0", "submit": ""}]);

      } else if (current_host === "krakenfiles.com") {
        disabled_upload_button();

        fetch(url_for_bypass_cors + "https://krakenfiles.com/api/server/available", {method: "GET"})
          .then((response) => response.json())
          .then((data) => {
            const url_krakenfiles_upload = data.data.url;
            const server_krakenfiles = url_krakenfiles_upload.match(/^https:\/\/([^/]+)/)[0];

            sent_data_form.append("files[]", file_to_upload);
            upload_to_host([url_for_bypass_cors + server_krakenfiles + "/_uploader/gallery/upload", "POST", sent_data_form], "json", ["files", "0", "url"], ["https://krakenfiles.com"]);
        });

      } else if (current_host === "clicknupload.click") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("utype", "anon");
        sent_data_form.append("file_descr", "");
        sent_data_form.append("file_public", "1");
        sent_data_form.append("link_rcpt", "");
        sent_data_form.append("link_pass", "");
        sent_data_form.append("to_folder", "");
        sent_data_form.append("upload", "Start upload");
        sent_data_form.append("", "Add more");
        sent_data_form.append("keepalive", "1");
        sent_data_form.append("file_0", file_to_upload);

        upload_to_host([url_for_bypass_cors + "https://mover08.clicknupload.net/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://clicknupload.click/"], ["https://clicknupload.click", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/clicknupload\.click\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://clicknupload.click/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);

      } else if (current_host === "dailyuploads.net") {
        sent_data_form.append("sess_id", "");
        sent_data_form.append("upload_type", "file");
        sent_data_form.append("srv_tmp_url", "https://down100.dailyuploads.net/tmp");
        sent_data_form.append("file_0", file_to_upload);

        upload_to_host([url_for_bypass_cors + "https://down100.dailyuploads.net/cgi-bin/upload.cgi?js_on=1&utype=anon&upload_type=file", "POST", sent_data_form], "text", ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1], ["https://dailyuploads.net/"], ["https://dailyuploads.net", "POST", {"op": "del_file", "id": ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1], "del_id": ["killcode", /https:\/\/dailyuploads\.net\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://dailyuploads.net/?op=upload_result&st=OK&fn=", ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1]], "confirm": "yes"}]);

      } else if (current_host === "www.upload.ee") {
        disabled_upload_button();

        const timestamp_date = new Date().getTime();

        fetch(url_for_bypass_cors + "https://www.upload.ee/ubr_link_upload.php?page=uploadsimple&rnd_id=" + timestamp_date, {method: "GET"})
          .then((response) => response.text())
          .then((data) => {
            const uploadee_upload_id = data.match(/"[A-Za-z0-9]+/)[0].slice(1);

            sent_data_form.append("link", "");
            sent_data_form.append("email", "");
            sent_data_form.append("category", "cat_file");
            sent_data_form.append("big_resize", "none");
            sent_data_form.append("upfile_0", file_to_upload);

            fetch(url_for_bypass_cors + "https://www.upload.ee/cgi-bin/ubr_upload.pl?X-Progress-ID=" + uploadee_upload_id + "&upload_id=" + uploadee_upload_id, {method:"POST", body:sent_data_form})
            .then((response) => response.text())
            .then(data => {
              const uploadee_upload_url = "https://www.upload.ee/?page=finishedsimple&upload_id=" + uploadee_upload_id;

              fetch(url_for_bypass_cors + uploadee_upload_url, {method:"GET"})
              .then((response) => response.text())
              .then(data => {
                const uploadee_killcode_url = data.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/[^"]+\?killcode=[A-Za-z0-9]+/)[0];
                const uploadee_url = data.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/.+(\.[A-Za-z0-9]+)+/)[0];

                console.log(uploadee_url)

                fetch(url_for_bypass_cors + uploadee_killcode_url, {method:"GET"})
                .then((response) => response.text())
                .then(data => {
                  const uploadee_delete_url = data.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/[^"]+\?killcode=[A-Za-z0-9]+&amp;confirm=([A-Za-z0-9_\-]+)[^"]+/)[0].replace("amp;", "");
                  
                  upload_to_host([url_for_bypass_cors + uploadee_upload_url, "GET"], "text", [uploadee_url], [], [uploadee_delete_url, "POST", {}]);
                })
              })
            })
            
        });

      }
    });
  });

  const sort_table = (sortIndex, getValue) => {
    const sort_order = sort_states[sortIndex] === "asc" ? -1 : 1;

    rows_of_providers.sort((rowA, rowB) => {
      const valueA = getValue(rowA.cells[sortIndex]);
      const valueB = getValue(rowB.cells[sortIndex]);

      if (valueA === "depends" && valueB !== "depends") {
        return 1;
      } else if (valueB === "depends" && valueA !== "depends") {
        return -1;
      }

      return sort_order * (valueB - valueA);
    });

    tbody_of_providers.innerHTML = "";
    rows_of_providers.forEach((row, index) => {
      const originalClass = index % 2 === 0 ? "bg-slate-800" : "bg-slate-700";
      row.classList.remove("bg-slate-800", "bg-slate-700");
      row.classList.add(originalClass, "alternate-row");
      tbody_of_providers.appendChild(row);
    });

    sort_states[sortIndex] = sort_states[sortIndex] === "asc" ? "desc" : "asc";
  };

  const get_max_size_file_value = (cell) => {
    const text = cell.textContent.trim().toLowerCase();
    if (text === "infinite") return Infinity;

    const unit = text.slice(-2);
    const size = parseFloat(text);
    switch (unit) {
      case "gb":
        return size * 1024;
      case "mb":
        return size;
      default:
        return 0;
    }
  };

  const get_expire_value = (cell) => {
    const text = cell.textContent.trim();
    if (text === "infinite") return Infinity;
    if (text.includes("depends on the size of your file")) return "depends";
  
    const hasDays = text.includes("days");
    const time = parseFloat(hasDays ? text.replace(" days", "") : text);
  
    return hasDays ? time * 24 * 60 : time;
  };
  

  document.getElementById("max_file_size_header").addEventListener("click", () => {sort_table(1, get_max_size_file_value)});

  document.getElementById("expire_header").addEventListener("click", () => {sort_table(2, get_expire_value)});

  const search_input = document.getElementById("search_input");

  search_input.addEventListener("input", () => {
    const searchTerm = search_input.value.toLowerCase();

    rows_of_providers.forEach((row) => {
      const providerName = row.cells[0].textContent.toLowerCase();
      const isSearchResult = providerName.includes(searchTerm);

      if (isSearchResult) {
        row.classList.add("search-result");
        row.classList.remove("cursor-not-allowed", "blur-[2px]");
      } else {
        row.classList.remove("search-result");
        row.classList.add("cursor-not-allowed", "blur-[2px]");
      }
    });

    rows_of_providers.sort((rowA, rowB) => {
      const isSearchResultA = rowA.classList.contains("search-result");
      const isSearchResultB = rowB.classList.contains("search-result");

      if (isSearchResultA && !isSearchResultB) {
        return -1;
      } else if (!isSearchResultA && isSearchResultB) {
        return 1;
      } else {
        return 0;
      }
    });

    tbody_of_providers.innerHTML = "";
    rows_of_providers.forEach((row, index) => {
      const originalClass = index % 2 === 0 ? "bg-slate-800" : "bg-slate-700";
      row.classList.remove("bg-slate-800", "bg-slate-700");
      row.classList.add(originalClass, "alternate-row");
      tbody_of_providers.appendChild(row);
    });
  });
});

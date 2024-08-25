const { appWindow } = window.__TAURI__.window;
const { invoke, convertFileSrc } = window.__TAURI__.tauri;
const { resolveResource } = window.__TAURI__.path;
const { getVersion } = window.__TAURI__.app;
const { checkUpdate, installUpdate } = window.__TAURI__.updater;
const { save, open } = window.__TAURI__.dialog;

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
  const button_filetmp = document.getElementById("button_filetmp");
  const button_usersdrive = document.getElementById("button_usersdrive");
  const button_downloadgg = document.getElementById("button_downloadgg");
  const button_megaup = document.getElementById("button_megaup");
  const button_krakenfiles = document.getElementById("button_krakenfiles");
  const button_clicknupload = document.getElementById("button_clicknupload");
  const button_uploadee = document.getElementById("button_uploadee");
  const button_ccuto = document.getElementById("button_ccuto");
  const button_filespacecom = document.getElementById("button_filespacecom");
  const button_gulfup = document.getElementById("button_gulfup");
  const button_cyberfile = document.getElementById("button_cyberfile");
  const button_freefr = document.getElementById("button_freefr");
  const button_depositfiles = document.getElementById("button_depositfiles");
  const button_tmpsend = document.getElementById("button_tmpsend");
  const button_ufile = document.getElementById("button_ufile");
  const button_dropdownload = document.getElementById("button_dropdownload");
  const button_filemoon = document.getElementById("button_filemoon");
  const button_catbox = document.getElementById("button_catbox");
  const button_sendvid = document.getElementById("button_sendvid");
  const button_upstore = document.getElementById("button_upstore");
  const button_ddownload = document.getElementById("button_ddownload");
  const button_mp4upload = document.getElementById("button_mp4upload");
  const button_netu = document.getElementById("button_netu");
  const button_dropgalaxy = document.getElementById("button_dropgalaxy");
  const button_nitroflare = document.getElementById("button_nitroflare");
  const button_vidoza = document.getElementById("button_vidoza");
  const button_katfile = document.getElementById("button_katfile");
  const button_rapidgator = document.getElementById("button_rapidgator");
  const button_fastupload = document.getElementById("button_fastupload");
  const button_imgbb = document.getElementById("button_imgbb");
  const button_buzzheavier = document.getElementById("button_buzzheavier");
  const button_doodstream = document.getElementById("button_doodstream");
  const button_streama2z = document.getElementById("button_streama2z");
  const button_streamwish = document.getElementById("button_streamwish");
  const button_streamruby = document.getElementById("button_streamruby");
  const button_voesx = document.getElementById("button_voesx");
  const button_devuploads = document.getElementById("button_devuploads");
  const button_mediacm = document.getElementById("button_mediacm");
  const button_uploadev = document.getElementById("button_uploadev");
  const button_isracloud = document.getElementById("button_isracloud");
  const button_dailyuploads = document.getElementById("button_dailyuploads");
  const button_worldbytez = document.getElementById("button_worldbytez");

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
  const popup_upload_button_local = document.getElementById("popup_upload_button_local");
  const popup_upload_button_url = document.getElementById("popup_upload_button_url");
  const popup_file_input = document.getElementById("popup_file_input");
  const url_upload_input = document.getElementById("url_upload_input");
  const filename_url_info = document.getElementById("filename_url_info");
  const final_upload_url = document.getElementById("final_upload_url");
  const copy_button = document.getElementById("copy_button");
  const delete_file_input = document.getElementById("delete_file_input_button");
  const drag_file_withtout_host = document.getElementById("drag_file_withtout_host");

  const set_api_key = document.getElementById("set_api_key");
  const api_key_input = document.getElementById("api_key_input");
  const set_api_key_button = document.getElementById("set_api_key_button");

  const upload_local_file_button = document.getElementById("upload_local_file_button");
  const upload_from_url_button = document.getElementById("upload_from_url_button");
  const local_upload_file = document.getElementById("local_upload_file");
  const url_upload_file = document.getElementById("url_upload_file");

  let upload_mode = "local";

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
  const stats_text = document.getElementById("stats_text");

  const manage_api_keys_button = document.getElementById("manage_api_keys_button");
  const manage_api_keys_popup = document.getElementById("manage_api_keys_popup");
  const manage_api_keys_body = document.getElementById("manage_api_keys_body");

  const search_icon = document.getElementById("search_icon");

  const import_button_popup = document.getElementById("import_button_popup");
  const export_button_popup = document.getElementById("export_button_popup");
  const import_button = document.getElementById("import_button");
  const export_button = document.getElementById("export_button");
  const import_popup = document.getElementById("import_popup");
  const export_popup = document.getElementById("export_popup");
  const import_export_popup = document.getElementById("import_export_popup");

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
    const original_class = index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
    row.classList.remove("bg-slate-800", "bg-gray-900");
    row.classList.add(original_class, "alternate-row");
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
    { url: 'https://filetmp.com/', discriminator: 'filetmp.com' },
    { url: 'https://usersdrive.com/', discriminator: 'usersdrive.com' },
    { url: 'https://download.gg/', discriminator: 'download.gg' },
    { url: 'https://megaup.net/', discriminator: 'megaup.net' },
    { url: 'https://krakenfiles.com/', discriminator: 'krakenfiles.com' },
    { url: 'https://clicknupload.click/', discriminator: 'clicknupload.click' },
    { url: 'https://www.upload.ee/', discriminator: 'www.upload.ee' },
    { url: 'https://ccu.to/', discriminator: 'ccu.to' },
    { url: 'https://rachel.filespace.com/', discriminator: 'filespace.com' },
    { url: 'https://www.gulf-up.com/', discriminator: 'www.gulf-up.com' },
    { url: 'https://cyberfile.me/', discriminator: 'cyberfile.me' },
    { url: 'https://transfert.free.fr/', discriminator: 'transfert.free.fr' },
    { url: 'https://dfiles.eu/', discriminator: 'dfiles.eu' },
    { url: 'https://tmpsend.com/', discriminator: 'tmpsend.com' },
    { url: 'https://ufile.io/', discriminator: 'ufile.io' },
    { url: 'https://drop.download/', discriminator: 'drop.download' },
    { url: 'https://filemoon.sx/', discriminator: 'filemoon.sx' },
    { url: 'https://catbox.moe/', discriminator: 'files.catbox.moe' },
    { url: 'https://sendvid.com/', discriminator: 'sendvid.com' },
    { url: 'https://upstore.net/', discriminator: 'upstore.net' },
    { url: 'https://ddownload.com/', discriminator: 'ddownload.com' },
    { url: 'https://mp4upload.com/', discriminator: 'mp4upload.com' },
    { url: 'https://netu.ac/', discriminator: 'waaw.ac' },
    { url: 'https://dropgalaxy.com/', discriminator: 'dropgalaxy.com' },
    { url: 'https://nitroflare.com/', discriminator: 'nitroflare.com' },
    { url: 'https://vidoza.net/', discriminator: 'vidoza.net' },
    { url: 'https://katfile.com/', discriminator: 'katfile.com' },
    { url: 'https://rapidgator.net/', discriminator: 'rapidgator.net' },
    { url: 'https://fastupload.io/', discriminator: 'fastupload.io' },
    { url: 'https://imgbb.com/', discriminator: 'ibb.co' },
    { url: 'https://buzzheavier.com/', discriminator: 'buzzheavier.co' },
    { url: 'https://doodstream.com/', discriminator: 'dood.li' },
    { url: 'https://streama2z.com/', discriminator: 'streama2z.xyz' },
    { url: 'https://streamwish.com/', discriminator: 'strwish.com' },
    { url: 'https://streamruby.com/', discriminator: 'rubystm.com' },
    { url: 'https://voe.sx/', discriminator: 'voe.sx' },
    { url: 'https://devuploads.com/', discriminator: 'devuploads.com' },
    { url: 'https://media.cm/', discriminator: 'media.cm' },
    { url: 'https://uploadev.org/', discriminator: 'uploadev.org' },
    { url: 'https://isra.cloud/', discriminator: 'isra.cloud' },
    { url: 'https://dailyuploads.net/', discriminator: 'dailyuploads.net' },
    { url: 'https://worldbytez.com/', discriminator: 'worldbytez.com' }
  ];

  function check_host_status(forced) {
    let offline_hosts = 0;
    let total_hosts = 0;
    let last_check_date_global = null;

    const requests_promises = [];
    host_sites.forEach((site) => {
      total_hosts++
    
      const last_check_date = localStorage.getItem(`${site.discriminator}_last_check_date`);
      const current_time = new Date().getTime();
  
      const last_check_status = localStorage.getItem(`${site.discriminator}_status`);

      if (last_check_date) {
        last_check_date_global = last_check_date;
      } else {
        last_check_date_global = current_time;
      }

      if (forced || !last_check_date || (current_time - last_check_date > 12 * 60 * 60 * 1000)) {
        const requests_promise = fetch(url_for_bypass_cors + site.url)
            .then((response) => {
                if (!response.ok) {
                  disable_host(site.discriminator);
                  localStorage.setItem(`${site.discriminator}_status`, 'offline');
                  offline_hosts++;
                } else {
                  localStorage.setItem(`${site.discriminator}_status`, 'online');
                }
            })
            .catch(() => {
              disable_host(site.discriminator);
              localStorage.setItem(`${site.discriminator}_status`, 'offline');
              offline_hosts++;
            })
            .finally(() => {
                localStorage.setItem(`${site.discriminator}_last_check_date`, current_time);
            });

        requests_promises.push(requests_promise);
      } else if (last_check_status === 'offline') {
          disable_host(site.discriminator);
          offline_hosts++;
      }
    });

    Promise.all(requests_promises)
    .then(() => {
      check_status_button.innerHTML = `Check host status <i class="fa-solid fa-arrows-rotate" style="color: #fefefe;"></i>`;
      stats_text.classList.remove("hidden");
      check_status_button.classList.remove("animate-pulse", "pointer-events-none");
      stats_text.innerHTML = total_hosts - offline_hosts + "/" + total_hosts + " online hosts. Last check: " + new Date(parseInt(last_check_date_global)).toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true,}).replace(",", "");
    })
    .catch((error) => {
      console.error(error)
    })
    
  }
  
  check_host_status(false);

  function disable_host(host) {
    const table_rows = document.querySelectorAll(".search-result");
  
    for (const row of table_rows) {
      const checkbox_element = row.querySelector('input[type="checkbox"]');
      const checkbox_value = checkbox_element.value;
  
      if (checkbox_value === host) {
        row.classList.add("opacity-60", "cursor-not-allowed", "pointer-events-none");
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
            row.classList.remove("opacity-60", "cursor-not-allowed", "pointer-events-none");
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

  async function export_data() {
    try {
      const open_path = await save({filters: [{name: 'PolyUploader data', extensions: ['zip']}]});
      if (!open_path) return
      await invoke("create_zip", { zipPath: open_path })
    } catch (error) {
      console.error("Error saving zip file: ", error);
    }
  }

  async function import_data() {
    try {
      const save_path = await open({filters: [{name: 'PolyUploader data', extensions: ['zip']}]});
      if (!save_path) return
      await invoke("extract_zip", { zipPath: save_path })
      import_export_popup.classList.add("hidden");
      window.location.reload();
    } catch (error) {
      console.error("Error extracting zip file: ", error);
    }
  }

  export_button_popup.addEventListener("click", function () {
    import_export_popup.classList.remove("hidden");
    export_popup.classList.remove("hidden");
    import_popup.classList.add("hidden");
  })

  import_button_popup.addEventListener("click", function () {
    import_export_popup.classList.remove("hidden");
    import_popup.classList.remove("hidden");
    export_popup.classList.add("hidden");
  })

  export_button.addEventListener("click", function() {export_data()});
  import_button.addEventListener("click", function() {import_data()});

  import_export_popup.addEventListener("click", function (event) {
    if (event.target === import_export_popup) {
      import_export_popup.classList.add("hidden");
    }
  });

  async function get_app_version() {
    try {
      const appVersion = await getVersion();
      return appVersion;
    } catch (error) {
      console.error("Error obtaining current app version: ", error);
    }
  }

  get_app_version()
    .then((result) => {
      const current_version = result;
      document.getElementById("footer_text").innerHTML = "PolyUploader <strong>" + current_version + "</strong> (latest)"
    })
    .catch((error) => {
      console.error("Error retrieving current app version : " + error);
  });

  async function check_update() {
    try {
      const { shouldUpdate, manifest } = await checkUpdate();
      if (shouldUpdate) {
        get_app_version()
        .then((result) => {
          const latest_version = manifest.version;
          const current_version = result;
          new_version_text.innerHTML = "A new version of PolyUploader is now available: <b>" + latest_version +"<b>";
          current_version_text.innerHTML = "(Current version: <b>" + current_version + "</b>)";
          update_popup.classList.remove("hidden");
          document.getElementById("footer_text").innerHTML = "PolyUploader <strong>" + current_version + "</strong> (update available: <strong>" + latest_version + "</strong>)"

          popup_new_version_download.addEventListener("click", function () {
            popup_new_version_download.innerHTML = 'Downloading the update <i class="fas fa-spinner fa-spin"></i>';
            document.body.classList.add("cursor-not-allowed", "pointer-events-none")
            installUpdate();
          })

          update_popup.addEventListener("click", function (event) {
            if (event.target === update_popup) {
              update_popup.classList.add("hidden");
            }
          });
          document.getElementById("window_title").textContent = "PolyUploader - " + current_version;
        })
        .catch((error) => {
          console.error("Error retrieving current app version : " + error);
        });
      }
    } catch (error) {
      console.error('Error checking or installing update:', error);
    }
  }

  check_update();

  let host = "";
  let force_keep_file = 0;
  let is_drag_file = false
  let link_receive = 0;

  let file_to_upload = "";
  let file_to_upload_name = "";
  let file_to_upload_size = "";

  let set_api_key_popup = false;

  get_resource_path()
  .then((result) => {
    fetch(convertFileSrc(result + "/history.json"))
      .then((response) => response.json())
      .then((data) => {
        if (Object.keys(data).length == 0) {
          upload_history_button.classList.add("opacity-50", "cursor-not-allowed", "pointer-events-none");
        }
      });
  })
  .catch((error) => {
    console.error("Error retrieving path app data local : " + error);
  });

  function get_value_from_path(path, json_data) {
    return path.reduce((current, key) => current?.[key], json_data);
  }

  function get_values_from_paths(paths, json_data) {
      const assembling_element = paths.pop();

      return paths.map(path => 
          path.reduce((current, key) => current?.[key], json_data)
      ).join(assembling_element);
  }

  function disable_button(button) {
    button.classList.add("opacity-50", "cursor-not-allowed");
    button.classList.remove("transition", "hover:scale-105", "hover:from-rose-500", "hover:to-red-500", "hover:scale-[1.01]", "hover:from-indigo-600", "hover:to-[#7072ee]", "hover:scale-[1.03]", "active:scale-[1.03]", "active:scale-[1.05]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.2)]", "hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)]");
    button.setAttribute("disabled", "");
  }

  function enable_button(button, color, size) {
    button.classList.remove("opacity-50", "cursor-not-allowed");

    if (color == "red") {
      button.classList.add("transition", "hover:from-rose-500", "hover:to-red-500", "hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)]");
    } else if (color == "indigo") {
      button.classList.add("transition", "hover:from-indigo-600", "hover:to-[#7072ee]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.2)]");
    }

    if (size == "small") {
      button.classList.add("hover:scale-[1.01]", "active:scale-[1.03]")
    } else if (size == "big") {
      button.classList.add("hover:scale-105", "active:scale-110")
    }
    
    button.removeAttribute("disabled", "");
  }

   upload_button_generic.forEach((element) => {
    if (element.hasAttribute("api_needed")) {
      get_resource_path()
      .then((result) => {
        fetch(convertFileSrc(result + "/api_keys.json"))
          .then((response) => response.json())
          .then((data) => {
            if (Object.keys(data).length !== 0) {;
              manage_api_keys_button.classList.remove("opacity-50", "pointer-events-none");
            }
            if (!data[element.getAttribute("api_needed")]) {
              element.innerHTML = `Set API key
              <div class="inline-block relative group text-left">
                <i class="fa-solid fa-circle-question" style="color: #ffffff;"></i>
            
                <div class="absolute bottom-full group-hover:block w-24 hidden" style="margin-left: -80px;">
                    <div class="bg-slate-900 text-white text-xs rounded-lg py-1 px-2 shadow-[0_5px_15px_rgba(0,_0,_0,_0.4)]">To use this host, enter your personal API key.</div>
                </div>
              </div>`;
            } else {
              element.textContent = "Upload";
            }
          });
      })
      .catch((error) => {
        console.error("Error retrieving path app data local : " + error);
      });
    }
  });

  function upload_to_host(request_data, response_format, link_extraction = [], affix = [], manage_file = []) {
    disabled_upload_button();

    const request_options = {
      method: request_data[1],
      body: request_data[2],
      signal: controller_signal,
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': '*'
      }
    };

    if (request_data[3]) {
      request_options.headers = {...request_options.headers, ...request_data[3]};
    }

    fetch(request_data[0], request_options)
      .then((response) => {
        if (response.status === 415) {
          return Promise.reject(new Error(['File format not supported by host', get_site_name(request_data[0])]));
        } else if (response.status === 507) {
          return Promise.reject(new Error(['Insufficient storage space', get_site_name(request_data[0])]));
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
        let url_delete_prefix = "";
        let delete_headers = {};

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
          if (manage_file[3] && manage_file[3][0]) {
            if (manage_file[3][0][0].includes("final_url")) {
                url_delete_prefix = manage_file[3][0][0].replace("final_url", final_url);
            } else {
                url_delete_prefix = manage_file[3][0]
            }
          }
          const url_delete_suffix = (manage_file[3] && manage_file[3][1]) ?? "";
          if (manage_file[0][0] === "match") {
            if (data.endsWith("\n")) {
              data = data.slice(0, data.length - "\n".length);
            }
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

        if (manage_file[4]) {
          delete_headers = manage_file[4];
        }

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

          } else if (retention_duration.startsWith("depends on the file size")) {
            new_expiration_date = "Depends on the file size";
          }

          delete_data_promise.then((delete_data) => {
            invoke("add_history_json", {newLink: final_url, newUploadDate: new_upload_date, newExpirationDate: new_expiration_date, manageLink: delete_url, deleteMethod: delete_method, deleteParameters: JSON.stringify(delete_data), deleteHeaders: JSON.stringify(delete_headers)});
            upload_history_button.classList.remove("opacity-50", "cursor-not-allowed", "pointer-events-none");
          });   

          display_final_url(final_url);

        } else {
          display_final_url("Unable to retrieve the download link.");
        }
      })

      .catch((error) => {
          display_final_url([error, get_site_name(request_data[0])]);
      });
  }

  function copy_to_clipboard(url) {
    navigator.clipboard.writeText(url);
  }

  function reset_popup() {
    upload_popup.classList.remove("hidden");
    if (force_keep_file == 0) {
      popup_file_input.value = "";
      popup_browse_button.textContent = "Browse";
      disable_button(popup_upload_button_local);
      delete_file_input.classList.add("hidden");
    } else {
      force_keep_file = 0;
    }
    url_upload_input.value = "";
    url_upload_input.classList.remove("hidden");
    final_upload_url.textContent = "";
    disable_button(popup_upload_button_url);
    popup_upload_button_local.innerHTML = "Upload";
    popup_upload_button_local.classList.remove("hidden");
    popup_upload_button_url.innerText = "Upload";
    popup_upload_button_url.classList.remove("hidden");
    copy_button.classList.add("hidden");
    select_profile_menu.classList.add("hidden");
    select_host_button.textContent = "Select host";
    conditions_of_use_link.classList.remove("hidden");
    url_upload_input.classList.remove("cursor-not-allowed", "opacity-50");
    url_upload_input.removeAttribute("disabled", "")
    url_upload_input.classList.add("active:scale-[1.05]")
    popup_browse_button.classList.remove("hidden");
    upload_local_file_button.classList.remove("hidden");
    upload_from_url_button.classList.remove("hidden");
    set_api_key.classList.add("hidden");
    set_api_key_popup = false;
    conditions_of_use_link.textContent = "See conditions of use of the host";
    enable_button(popup_browse_button, "indigo", "small");
    popup_upload_button_local.classList.remove("animate-pulse");
    popup_upload_button_url.classList.remove("animate-pulse");
    document.getElementById("hr-separator").classList.remove("hidden");
  }

  function drag_and_drop_hover() {
    if (upload_mode == "local" && !set_api_key_popup) {
      popup_container.classList.add("border-4", "p-20", "border-dashed", "border-slate-300");
      popup_container.classList.remove("border", "border-[#4c5666]");
    } else if (upload_mode == "url" || set_api_key_popup) {
      popup_container.classList.add("bg-red-500/20");
      popup_container.classList.add('animate-wiggle');

      setTimeout(function() {
        popup_container.classList.remove('animate-wiggle');
      }, 600);
    }
  }

  function drag_and_drop_cancel() {
    popup_container.classList.remove("border-4", "p-20", "bg-red-500/20", "border-dashed", "border-slate-300");
    popup_container.classList.add("border", "border-[#4c5666]");
  }

  function disabled_upload_button() {
    popup_upload_button_local.setAttribute("disabled", "");
    popup_upload_button_local.classList.add("cursor-not-allowed");
    popup_upload_button_local.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500", "active:scale-105", "active:scale-110", "hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)]");
    popup_upload_button_url.setAttribute("disabled", "");
    popup_upload_button_url.classList.add("cursor-not-allowed");
    popup_upload_button_url.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500", "active:scale-105", "active:scale-110", "hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)]");
    
    if (upload_mode == "url") {
      url_upload_input.classList.add("cursor-not-allowed", "opacity-50");
      url_upload_input.setAttribute("disabled", "")
      url_upload_input.classList.remove("active:scale-[1.05]")
    }
  }

  function enable_upload_button() {
    popup_upload_button_local.innerHTML = "Upload";
    popup_upload_button_local.classList.remove("transition", "active:scale-110");
    popup_upload_button_local.classList.add("cursor-not-allowed", "opacity-50");
    popup_upload_button_url.innerHTML = "Upload";
    popup_upload_button_url.classList.remove("transition", "active:scale-110");
    popup_upload_button_url.classList.add("cursor-not-allowed", "opacity-50");

    if (upload_mode == "url") {
      url_upload_input.classList.remove("cursor-not-allowed", "opacity-50");
      url_upload_input.removeAttribute("disabled", "")
      url_upload_input.classList.add("active:scale-[1.05]")
    }
  }

  function display_final_url(result) {
    if (link_receive == 0) {
      final_upload_url.innerHTML = '';
    }
    let all_links_copy = "";

    link_receive++;
    filename_url_info.classList.add("hidden");

    const link_to_receive = host.length;

    const indication_of_host = document.getElementsByClassName("indication_of_host")[0];

    if (indication_of_host) {
      indication_of_host.classList.add("hidden");
    }

    if (String(result[0]).includes('File format not supported by host')) {
      const final_url = document.createElement("a");
      final_url.href = "#";
      final_url.innerHTML = '<i class="fa-solid fa-circle-exclamation ml-2" style="color: #ffae00;"></i> <span style="color: #ffae00;"> <strong>' + result[1] + '</strong> </span> - File format are not allowed by the host.';
      
      const final_url_container = document.createElement("div");
      final_url_container.style.display = "block";
      final_url_container.appendChild(final_url);

      final_upload_url.appendChild(final_url_container);

    } else if (String(result[0]).includes('Insufficient storage space')) {
      const final_url = document.createElement("a");
      final_url.href = "#";
      final_url.innerHTML = '<i class="fa-solid fa-circle-exclamation ml-2" style="color: #ffae00;"></i> <span style="color: #ffae00;"> <strong>' + result[1] + '</strong> </span> - Insufficient storage space.';

      const final_url_container = document.createElement("div");
      final_url_container.style.display = "block";
      final_url_container.appendChild(final_url);

      final_upload_url.appendChild(final_url_container);

    } else if (String(result).includes("https://") || String(result).includes("http://")) {
      const final_url = document.createElement("a");
      final_url.href = result;
      final_url.textContent = result;

      const final_url_container = document.createElement("div");
      final_url_container.href = "#";
      final_url_container.style.display = "block";
      final_url_container.innerHTML = `<a href="${result}" target="_blank" class="hover:underline transition duration-20">${result}</a><button id="copy_button" class="ml-2 transition active:scale-125" alt="Copy link" link_to_copy="${result}"><i class="far fa-copy"></i></button>`;

      final_upload_url.appendChild(final_url_container);

      const copy_buttons = document.querySelectorAll("[id='copy_button']");
      copy_buttons.forEach((button) => {
        button.addEventListener("click", function () {
          copy_to_clipboard(button.getAttribute("link_to_copy"));
        });
      });

    } else {
      const final_url = document.createElement("div");
      final_url.href = "#";
      final_url.innerHTML = '<i class="fa-solid fa-circle-exclamation ml-2" style="color: #ffae00;"></i> <span style="color: #ffae00;"> <strong>' + result[1] + '</strong> </span> - ' + result[0];

      const final_url_container = document.createElement("a");
      final_url_container.style.display = "block";
      final_url_container.appendChild(final_url);

      final_upload_url.appendChild(final_url_container);
    }

    if (upload_mode == "local") {
      popup_upload_button_local.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading... (' + link_receive + '/' + link_to_receive + ')';
      popup_upload_button_local.classList.add("animate-pulse");
    } else if (upload_mode == "url") {
      popup_upload_button_url.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading... (' + link_receive + '/' + link_to_receive + ')';
      popup_upload_button_url.classList.add("animate-pulse");
    }

    if (link_receive === link_to_receive) {
      enable_upload_button();
      upload_local_file_button.style.pointerEvents = "";
      upload_local_file_button.classList.remove("opacity-50");
      upload_from_url_button.style.pointerEvents = "";
      upload_from_url_button.classList.remove("opacity-50");
      popup_upload_button_local.classList.remove("animate-pulse");
      popup_upload_button_url.classList.remove("animate-pulse");

      popup_browse_button.classList.remove("opacity-50", "cursor-not-allowed");
      popup_browse_button.removeAttribute("disabled", "");
      popup_browse_button.classList.add("hover:scale-[1.01]", "hover:from-indigo-500", "hover:to-[#7072ee]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.3)]", "active:scale-[1.03]");
      delete_file_input.classList.remove("opacity-50", "cursor-not-allowed");
      delete_file_input.removeAttribute("disabled", "");
      delete_file_input.classList.add("active:scale-125")

      link_receive = 0;

      const all_links_to_copy = document.querySelectorAll("button[link_to_copy]");
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

      if (link_to_receive >= 2) {
        const copy_all_button = document.createElement("div");
        const share_link_button = document.createElement("div");
        copy_all_button.href = "#";
        share_link_button.href = "#";
        copy_all_button.innerHTML = `<button id="copy_all_button" class="mt-5 transition duration-200 hover:scale-[1.02] active:scale-[1.05] hover:underline">Copy all links <i class="fa-solid fa-clone"></i></button><br>`;
        share_link_button.innerHTML = `<button id="share_link_button" class="mt-1 transition duration-200 hover:scale-[1.02] active:scale-[1.05] hover:underline">Create a single share link <i class="fa-solid fa-up-right-from-square"></i></button>`;

        final_upload_url.appendChild(copy_all_button);
        final_upload_url.appendChild(share_link_button);

        let share_link_created = 0;

        document.getElementById("copy_all_button").addEventListener("click", function () {
            copy_to_clipboard(all_links_copy);
          });

        document.getElementById("share_link_button").addEventListener("click", function () {
          document.getElementById("share_link_button").innerHTML = `Create a single share link <i class="fas fa-spinner fa-spin"></i>`;
          document.getElementById("share_link_button").classList.remove("hover:scale-[1.02]", "active:scale-[1.05]", "hover:underline")

          if (share_link_created == 0) {
            const upload_date = new Date().toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true}).replace(",", "");
            
            fetch("https://p-u.vercel.app/api/bins", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                title: file_to_upload_name,
                upload_date: upload_date,
                links: all_links_copy
              })
            })
            .then(response => response.json())
            .then((data) => {
              share_link = data.data.url;
              copy_to_clipboard(share_link);
              share_link_created = 1;
              const id_bin = data.data.id;
              const token_bin = data.data.token;
              document.getElementById("share_link_button").innerHTML = `<button id="share_link_button" class="mt-1 transition duration-200 hover:underline">Copy a single share link <i class="fa-solid fa-check"></i></button>`;
              setTimeout(function() {
                document.getElementById("share_link_button").innerHTML = `<a id="share_link_button_link" class="mt-1 transition duration-200 hover:underline" href="${share_link}" target="_blank">${share_link} <button id="copy_button_share_link" class="ml-2 transition active:scale-125" alt="Copy link"><i class="far fa-copy"></i></a>`;

                document.getElementById("copy_button_share_link").addEventListener("click", function() {
                  copy_to_clipboard(share_link);
                }) 
              }, 500);
              invoke("add_history_json", {newLink: share_link, newUploadDate: upload_date, newExpirationDate: "Infinite", manageLink: "https://p-u.vercel.app/api/bins", deleteMethod: "DELETE", deleteParameters: JSON.stringify({"id": id_bin, "token": token_bin}), deleteHeaders: JSON.stringify({})});
            })
          } else {
            document.getElementById("share_link_button").innerHTML = `<a id="share_link_button" class="mt-1 transition duration-200 hover:underline">${share_link} <button id="copy_button_share_link" class="ml-2 transition active:scale-125" alt="Copy link"><i class="far fa-copy"></i></a>`;

            document.getElementById("copy_button_share_link").addEventListener("click", function() {
              copy_to_clipboard(share_link);
            }) 
          }
        })
      }
    }
  }

  let is_dragging_over = false;

  function handle_dragover(event) {
    event.preventDefault();
      if (!is_dragging_over) {
          is_dragging_over = true;
          if (upload_popup.classList.contains("hidden")) {
            drag_file_withtout_host.classList.remove("hidden");
            force_keep_file = 1;
            enable_button(popup_upload_button_local, "red", "big");
          } else {
            force_keep_file = 0;
          }

          requestAnimationFrame(drag_and_drop_hover);
      }
  }

  function handle_drop(event) {
    event.preventDefault();
    is_dragging_over = false;
    drag_and_drop_cancel();
    drag_file_withtout_host.classList.add("hidden");

    if (upload_mode == "local" && !set_api_key_popup) {
      drag_file = event.dataTransfer.files[0];
      let filename = drag_file.name;
      let size = drag_file.size;
      drag_file_name = filename;
      drag_file_size = size;
  
      if (filename.length > 30) {
          popup_browse_button.textContent = filename.substring(0, 30) + "...";
      } else {
          popup_browse_button.textContent = filename;
      }
  
      check_prohibited_format(filename).then((response) => {
          let prohibited_format = response;
  
          delete_file_input.classList.remove("hidden");
  
          if (host && JSON.stringify(host) !== "[]" && prohibited_format === false) {
            enable_button(popup_upload_button_local, "red", "big")
          }
      });
  
      is_drag_file = true;
    } 
  }
  
  function handle_dropleave(event) {
    setTimeout(function() {if (!is_dragging_over) {drag_file_withtout_host.classList.add("hidden")}}, 10);
    is_dragging_over = false;
    drag_and_drop_cancel();
  }

  document.addEventListener('dragover', handle_dragover);
  document.addEventListener('drop', handle_drop);
  document.addEventListener('dragleave', handle_dropleave);

  let drag_file = null;
  let drag_file_name = null;
  let drag_file_size = null;
  let last_clicked_button = null;

  function upload_preparation(uploadButton, hostName, indicationsSendingFiles, conditionOfUseUrl, apiKeyLink) {
    uploadButton.addEventListener("click", function () {
      last_clicked_button = this;

      if (uploadButton.textContent.includes("Set API key")) {
        disable_button(set_api_key_button);
        set_api_key_popup = true;
        upload_popup.classList.remove("hidden");
        url_upload_input.value = "";
        final_upload_url.textContent = "";
        conditions_of_use_link.classList.remove("hidden");
        disable_button(popup_upload_button_url);
        api_key_input.value = "";
        popup_upload_button_local.classList.add("hidden");
        popup_upload_button_url.classList.add("hidden");
        copy_button.classList.add("hidden");
        popup_browse_button.classList.add("hidden");
        upload_local_file_button.classList.add("hidden");
        url_upload_input.classList.add("hidden");
        upload_from_url_button.classList.add("hidden");
        delete_file_input.classList.add("hidden");
        conditions_of_use_link.textContent = "Get my API key for this host (account required)";
        select_profile_menu.classList.add("hidden");
        document.getElementById("hr-separator").classList.add("hidden");
        conditions_of_use_link.href = apiKeyLink;

        set_api_key.classList.remove("hidden");

        api_key_input.addEventListener("input", function () {
          if (api_key_input.value != "") {
            enable_button(set_api_key_button, "red", "big");
          } else if (api_key_input.value == "") {
            disable_button(set_api_key_button);
          }
        })

        set_api_key_button.addEventListener("click", function () {
          invoke("update_api_key", {hostName: last_clicked_button.getAttribute("api_needed"), apiKey: api_key_input.value});
          last_clicked_button.textContent = "Upload";
          upload_button_generic.forEach((element) => {
            element.classList.remove("hidden");
          });
          select_box_container.forEach((element) => {
            element.classList.add("hidden");
          });
    
          upload_name.textContent = "Upload";
          toggle_upload_mode.innerHTML = `Switch to multiple upload mode <i class="fa-solid fa-arrows-turn-right ml-1"></i>`;
          button_multiple_host_popup.classList.add("hidden");
          button_upload_status = 0;
          reset_popup();
          upload_popup.classList.add("hidden");
          manage_api_keys_button.classList.remove("opacity-50", "pointer-events-none");
        })
      } else {
        reset_popup();

        host = hostName;

        const indication_of_host_text = document.createElement("p");
        indication_of_host_text.textContent = indicationsSendingFiles;

        const prohibited_formats = document.createElement("p");

        get_prohibited_formats(host)
        .then((result) => {
          if (result) {
            let list_content = "";

            if (result[0] == "*") {
              list_content = "<strong>Only authorized</strong> file formats: ";
              result.shift();
            } else {
              list_content = "<strong>Forbidden</strong> file formats: ";
            }
            
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
              }
              
              prohibited_formats.innerHTML = list_content;
              
            });
          }
        })
  
        const indication_of_host = document.createElement("div");
        indication_of_host.classList.add("indication_of_host");
        indication_of_host.appendChild(indication_of_host_text);
        indication_of_host.appendChild(prohibited_formats);
  
        final_upload_url.appendChild(indication_of_host);
  
        conditions_of_use_link.href = conditionOfUseUrl;
      }
      
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


  function get_site_name(url) {
    const parsed_url = new URL(url.replace(/^http:\/\/127\.0\.0\.1:61337\//, ""));
    let hostname = parsed_url.hostname;
    const parts = hostname.split('.');
  
    if (parts.length > 2) {
      hostname =  parts.slice(parts.length - 2).join('.');
    }

    if (parts.length === 4 && parts.every(part => !isNaN(part))) {
      hostname = parsed_url.hostname;
    }

    const domain_name = {
      "gofile.io": "gofile.io",
      "catbox.moe": "litter.catbox.moe",
      "file.io": "file.io",
      "tmpfiles.org": "tmpfiles.org",
      "0x0.st": "0x0.st",
      "c-v.sh": "c-v.sh",
      "ki.tc": "ki.tc",
      "oshi.at": "oshi.at",
      "filebin.net": "filebin.net",
      "transfer.sh": "transfer.sh",
      "bashupload.com": "bashupload.com",
      "curl.by": "curl.by",
      "x0.at": "x0.at",
      "uplooad.net": "uplooad.net",
      "tommo.team": "a.tommo.team",
      "tempfiles.ninja": "tempfiles.ninja",
      "pixeldrain.com": "pixeldrain.com",
      "1cloudfile.com": "1cloudfile.com",
      "bowfile.com": "bowfile.com",
      "uploadify.net": "uploadify.net",
      "anontransfer.com": "anontransfer.com",
      "anonsharing.com": "anonsharing.com",
      "temp.sh": "temp.sh",
      "uguu.se": "a.uguu.se",
      "nopaste.net": "nopaste.net",
      "udrop.com": "www.udrop.com",
      "tempsend.com": "tempsend.com",
      "1fichier.com": "1fichier.com",
      "turbobit.net": "turbobit.net",
      "hitfile.net": "hitfile.net",
      "file-upload.download": "file-upload.org",
      "takeplcdn.art": "hexload.com",
      "mexa.sh": "mexa.sh",
      "rapidfileshare.net": "www.rapidfileshare.net",
      "send.cm": "send.cm",
      "filetmp.com": "filetmp.com",
      "userdrive.org": "usersdrive.com",
      "download.gg": "download.gg",
      "megaup.net": "megaup.net",
      "krakenfiles.com": "krakenfiles.com",
      "clicknupload.click": "clicknupload.click",
      "upload.ee": "www.upload.ee",
      "ccu.to": "ccu.to",
      "filespace.com": "filespace.com",
      "scdns.link": "www.gulf-up.com",
      "cyberfile.me": "cyberfile.me",
      "iliad.fr": "transfert.free.fr",
      "dfiles.eu": "dfiles.eu",
      "tmpsend.com": "tmpsend.com",
      "ufile.io": "ufile.io",
      "drop.download": "drop.download",
      "cdn112.com": "filemoon.sx",
      "catbox.moe": "files.catbox.moe",
      "sendvid.com": "sendvid.com",
      "upstore.net": "upstore.net",
      "ucdn.to": "ddownload.com",
      "mp4upload.com": "mp4upload.com",
      "cfglobalcdn.com": "waaw.ac",
      "dropgalaxy.com": "dropgalaxy.com",
      "nitroflare.com": "nitroflare.com",
      "vidoza.net": "vidoza.net",
      "katfile.com": "katfile.com",
      "rapidgator.net": "rapidgator.net",
      "fastupload.io": "fastupload.io",
      "imgbb.com": "ibb.co",
      "buzzheavier.com": "buzzheavier.com",
      "video-delivery.net": "dood.li",
      "smartkhabrinews.com": "streama2z.xyz",
      "streamruby.net": "rubystm.com",
      "voe-network.net": "voe.sx",
      "devuploads.com": "devuploads.com",
      "media.cm": "media.cm",
      "uploadev.org": "uploadev.org",
      "isra.cloud": "isra.cloud",
      "dailyuploads.net": "dailyuploads.net",
      "w-555.org": "worldbytez.com"
    };
  
    let host = domain_name[hostname];
    const table_rows = document.querySelectorAll(".search-result");

    for (const row of table_rows) {
        const checkbox_element = row.querySelector('input[type="checkbox"]');
        const checkbox_value = checkbox_element.value;
        if (checkbox_value === host) {
            const name_element = row.querySelector("td:nth-child(1)");
            const name_text = name_element.childNodes[2].nodeValue.trim();
            return name_text.slice(0, -2);
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
  
        if (prohibited_formats_for_host[0] == "*") {
          if (!prohibited_formats_for_host.includes(file_extension)) {
            prohibited_format = true;
          }
        } else if (prohibited_formats_for_host.includes(file_extension)) {
          prohibited_format = true;
        }
      }
  
    } catch (error) {
      console.error("Error retrieving path to local application data: " + error);
    }
  
    return prohibited_format;
  }

  async function get_prohibited_formats(host) {
    let prohibited_formats = [];
    try {
      const result = await get_resource_path();
      const response = await fetch(convertFileSrc(result + "/prohibited_format.json"));
      const data = await response.json();
  
      if (host in data) {
        prohibited_formats = data[host];
      }
  
    } catch (error) {
      console.error("Error retrieving path to local application data: " + error);
    }
  
    return prohibited_formats;
  }

  popup_browse_button.addEventListener("click", function () {
    popup_file_input.click();
  });

  url_upload_input.addEventListener("input", function () {

    const filename_url = get_file_name_from_url(url_upload_input.value)

    if (host && JSON.stringify(host) !== "[]" && url_upload_input.value != "" && url_upload_input.value.startsWith("https://") || url_upload_input.value.startsWith("http://")) {
      enable_button(popup_upload_button_url, "red", "big")
    } else if (url_upload_input.value == "") {
      disable_button(popup_upload_button_url);
    }

    if (filename_url) {
      check_prohibited_format(filename_url).then((response) => {
        let prohibited_format = response;

        if (prohibited_format) {
          disable_button(popup_upload_button_url);
        } else {
          filename_url_info.classList.remove("hidden");
          filename_url_info.innerHTML = `This file will be upload: <strong>${filename_url}</strong>`;
        }
      });
    } else {
      filename_url_info.classList.add("hidden");
    }  
  })

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
        enable_button(popup_upload_button_local, "red", "big")
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
    }
  });

  upload_local_file_button.addEventListener("click", function () {
    if (upload_mode != "local") {
      upload_mode = "local";
      upload_local_file_button.className = "mr-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/60 border border-indigo-300/30 transition duration-3.5 rounded-lg cursor-not-allowed pointer-events-none text-white";
      upload_from_url_button.className = "ml-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/20 border border-indigo-300/20 hover:bg-indigo-500/50 transition text-indigo-100 duration-3.5 rounded-lg hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.15)] active:scale-[1.02]";
      local_upload_file.classList.remove("hidden");
      url_upload_file.classList.add("hidden");
    }
  })

  upload_from_url_button.addEventListener("click", function () {
    if (upload_mode != "url") {
      upload_mode = "url";
      upload_from_url_button.className = "ml-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/60 border border-indigo-300/30 transition duration-3.5 rounded-lg cursor-not-allowed pointer-events-none text-white";
      upload_local_file_button.className = "mr-4 text-sm px-3 py-2 cursor-pointer bg-indigo-500/20 border border-indigo-300/20 hover:bg-indigo-500/50 transition text-indigo-100 duration-3.5 rounded-lg hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.15)] active:scale-[1.02]";
      local_upload_file.classList.add("hidden");
      url_upload_file.classList.remove("hidden");
    }
  })

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
                if (localStorage.getItem(`${host_site}_status`) == "online") {
                  host.push(host_site);
                }
              }

              if (upload_mode == "local" && host && JSON.stringify(host) !== "[]" && popup_file_input.files.length > 0) {
                enable_button(popup_upload_button_local, "red", "big");
              } else if (upload_mode == "url" && host && JSON.stringify(host) !== "[]" && url_upload_input.value != "") {
                enable_button(popup_upload_button_url, "red", "big")
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
    toggle_upload_mode.innerHTML = `Switch to multiple upload mode <i class="fa-solid fa-arrows-turn-right ml-1"></i>`;
    button_multiple_host_popup.classList.add("hidden");
    button_upload_status = 0;
    profile_select.value = "default";
  });

  let profile_status = 0;

  popup_new_profile_button.addEventListener("click", function () {
    select_box.forEach((checkbox) => {
      checkbox.checked = false;
    });

    if (selected_profile !== "") {
      document.getElementById("profile_name_text").textContent = 'New profile name:';
      delete_profiles_button.classList.remove("hidden");
      delete_profiles_button.innerHTML = 'Delete profile';
      rename_profiles_button.classList.remove("hidden");
      rename_profiles_button.innerHTML = 'Rename profile';
      select_host_button.textContent = 'Change selected hosts';
      profile_status = 1;
      enable_button(select_host_button, "indigo", "small");
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
      select_box_container.forEach((element_checkbox) => {
        element_checkbox.classList.remove("hidden");
      });

      disable_button(button_multiple_host_popup);
      select_box.forEach((checkbox) => {
        checkbox.checked = false;
      });

      upload_button_generic.forEach((element_button) => {
        if (!element_button.textContent.includes("Set API key")) {
          element_button.classList.add("hidden");
        } else {
          const api_key_element = element_button.parentElement;
          const checkbox = api_key_element.querySelectorAll("div")
          checkbox[3].classList.add("hidden")
        }
      });
      

      upload_name.textContent = "Selected";
      toggle_upload_mode.innerHTML = `Switch to single upload mode <i class="fa-solid fa-arrow-turn-down -rotate-90 ml-1 mb-1"></i>`;
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
      toggle_upload_mode.innerHTML = `Switch to multiple upload mode <i class="fa-solid fa-arrows-turn-right ml-1"></i>`;
      button_multiple_host_popup.classList.add("hidden");
      button_upload_status = 0;
    }
  });

  select_box.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (Array.from(select_box).filter(checkbox => checkbox.checked).length >= 2) {
            enable_button(button_save_selected_host, "indigo", "small");
            enable_button(button_multiple_host_popup, "red", "small");
        } else {
            disable_button(button_save_selected_host);
            disable_button(button_multiple_host_popup);
        }
    });
  });

  button_multiple_host_popup.addEventListener("click", function () {
    reset_popup();
    
    const selected_host = [];

    select_box.forEach((checkbox) => {
      if (checkbox.checked) {
        selected_host.push(checkbox.value);
      }
    });

    host = selected_host;
    conditions_of_use_link.classList.add("hidden");
  });

  delete_file_input.addEventListener("click", function () {
    popup_file_input.value = "";
    disabled_upload_button();
    popup_upload_button_local.classList.add("opacity-50");
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
      enable_button(rename_profiles_button, "indigo", "small");

      if (profile_status === 0) {
        enable_button(select_host_button, "indigo", "small");
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

            let row_color_indicator = "bright";

            for (const link of keys) {
              const row = document.createElement("tr");
              if (row_color_indicator == "bright") {
                row.classList.add("bg-slate-800");
                row_color_indicator = "dark";
              } else {
                row.classList.add("bg-gray-900");
                row_color_indicator = "bright";
              }
              const link_cell = document.createElement("td");
              const link_text = document.createElement("div");
              link_cell.className = "px-4 py-2 max-w-sm";
              link_text.className = "flex items-center"
              link_text.innerHTML = `<a href=${link} target="_blank" class="flex-1 truncate text-sky-400">` + link + `</a><button id="copy_button" class="ml-2 transition active:scale-125" alt="Copy link" link_to_copy=${link}><i class="far fa-copy"></i></button>`;

              const copy_buttons = document.querySelectorAll("[id='copy_button']");
              copy_buttons.forEach((button) => {
                button.addEventListener("click", function () {
                  copy_to_clipboard(button.getAttribute("link_to_copy"));
                });
              });

              enable_button(clear_history_button, "red", "big");

              const upload_date_cell = document.createElement("td");
              upload_date_cell.className = "px-4 py-2";
              upload_date_cell.textContent = data[link].date_upload;

              const expiration_date_cell = document.createElement("td");
              expiration_date_cell.className = "px-4 py-2";

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
                localStorage.setItem(`${link}_file_status`, "expired")
                time_to_expiration = `<p style="color: #ff2828;"><i class="fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>Expired file</strong></p>`;
              } else if (localStorage.getItem(`${link}_alive`) == "deleted") {
                time_to_expiration = `<p style="color: #ff2828;"><i class="fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>File deleted</strong></p>`;
              } else if (data[link].date_expires == "Depends on the file size") {
                time_to_expiration = "Depends on the file size";
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
              delete_link_cell.className = "px-4 py-2";

              const file_status = localStorage.getItem(`${link}_file_status`);

              if (data[link].manage[0] && file_status != "delete" && file_status != "expired") {
                let delete_name = data[link].manage[0].startsWith("https://p-u.vercel.app/") ? "link" : "file";
                delete_link_button.innerHTML = `<button class="bg-gradient-to-t from-rose-600 to-red-500 text-white px-4 py-2 rounded-lg transition duration-200 hover:scale-[1.03] hover:from-rose-500 hover:to-red-500 hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)] active:scale-[1.05]" id="delete_file" value=${link}>Delete ${delete_name} <i class="fa-solid fa-trash"></i></button>`;
              } else {
                delete_link_button.innerHTML = `<div class="inline-block relative group">
                <button class="bg-gradient-to-t from-rose-600 to-red-500 text-white px-4 py-2 rounded-lg transition duration-200 opacity-50 cursor-not-allowed" id="delete_file" disabled>Delete file <i class="fa-solid fa-trash"></i></button>
            
                  <div class="absolute bottom-full mb-1 group-hover:block w-48 hidden">
                      <div class="bg-slate-900 text-white text-xs rounded-lg py-1 px-2 shadow-[0_5px_15px_rgba(0,_0,_0,_0.4)]">
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
                const delete_url = data[button.value].manage[0];
                const delete_method = data[button.value].manage[1];
                const delete_data = data[button.value].manage[2];
                const delete_headers = data[button.value].manage[3];
                let delete_request_config = "";
                let delete_data_formatted = "";
                button.innerHTML = `Delete file <i class="fas fa-spinner fa-spin"></i>`

                delete_data_formatted = Object.keys(delete_data).map(key => {
                  return encodeURIComponent(key) + '=' + encodeURIComponent(delete_data[key]);
                }).join('&');

                delete_request_config = {
                  method: delete_method,
                  headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"
                  }
                };

                if (delete_headers != {}) {
                  delete_request_config.headers = {...delete_request_config.headers, ...delete_headers};
                }

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
        console.error("Error retrieving path to local application data: " + error);
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
    upload_history_button.classList.add("opacity-50", "cursor-not-allowed", "pointer-events-none");
  });

  manage_api_keys_popup.addEventListener("click", function (event) {
    if (event.target === manage_api_keys_popup) {
      manage_api_keys_popup.classList.add("hidden");
    }
  })

  manage_api_keys_button.addEventListener("click", function () {
    manage_api_keys_popup.classList.remove("hidden");

    while (manage_api_keys_body.firstChild) {
      manage_api_keys_body.removeChild(manage_api_keys_body.firstChild);
    }

    get_resource_path()
      .then((result) => {
        fetch(convertFileSrc(result + "/api_keys.json"))
          .then((response) => response.json())
          .then((data) => {
            const keys = Object.keys(data).reverse();

            let row_color_indicator = "bright";

            for (const host of keys) {
              const row = document.createElement("tr");

              if (row_color_indicator == "bright") {
                row.classList.add("bg-slate-800");
                row_color_indicator = "dark";
              } else {
                row.classList.add("bg-gray-900");
                row_color_indicator = "bright";
              }
            
              const host_cell = document.createElement("td");
              host_cell.className = "px-4 py-2";
              host_cell.innerHTML = `<div class="flex items-center"><img src="images\\${host}.png" alt="${host} Logo" class="h-5 ml-1 mr-1">` + host + `</div>`;
            
              const host_api_key = document.createElement("td");
              host_api_key.className = "px-4 py-2";
            
              host_api_key.innerHTML = `
                <div class="inline-block">
                  <pre class="bg-slate-900 rounded-lg border-separate border-slate-950 border w-fit pl-2 pr-2 p-1 text-sm">${data[host]} <button id="delete_api_key" class="transition active:scale-125" value="${host}"><i class="fa-solid fa-eraser text-red-500"></i></button></pre>
                </div>
              `;
            
              row.appendChild(host_cell);
              row.appendChild(host_api_key);
            
              manage_api_keys_body.appendChild(row);
            }

            document.querySelectorAll("#delete_api_key").forEach(button => {
              button.addEventListener("click", function () {
                button.parentNode.parentNode.parentNode.parentNode.classList.add("hidden")

                upload_button_generic.forEach((element) => {
                  if (element.getAttribute("api_needed") == button.value) {
                    element.innerHTML = `Set API key
                    <div class="inline-block relative group text-left">
                      <i class="fa-solid fa-circle-question" style="color: #ffffff;"></i>
                  
                      <div class="absolute bottom-full group-hover:block w-24 hidden" style="margin-left: -80px;">
                          <div class="bg-slate-900 text-white text-xs rounded-lg py-1 px-2 shadow-[0_5px_15px_rgba(0,_0,_0,_0.4)]">To use this host, enter your personal API key.</div>
                      </div>
                    </div>`
                  }
                });
                
                invoke("delete_api_key", {"hostName": button.value});

                const visible_buttons = Array.from(document.querySelectorAll("#delete_api_key")).filter(button => {
                  return !button.parentNode.parentNode.parentNode.parentNode.classList.contains("hidden");
                });
            
                if (visible_buttons.length === 0) {
                  manage_api_keys_popup.classList.add("hidden");
                  manage_api_keys_button.classList.add("opacity-50", "pointer-events-none");
                }
              })
            })
          });
      })
      .catch((error) => {
        console.error("Error retrieving path to local application data : " + error);
      });
  })

  check_status_button.addEventListener("click", function () {
    enable_hosts();
    check_status_button.innerHTML = `Check host status <i class="fas fa-spinner fa-spin"></i>`;
    check_status_button.classList.add("animate-pulse", "pointer-events-none");
    stats_text.classList.add("hidden");
    check_host_status(true);
  })

  const button_upload_multiple_offset = button_multiple_host_popup.offsetTop;
    
  function handle_scroll() {
      if (window.scrollY - 250 > button_upload_multiple_offset) {
        button_multiple_host_popup.classList.add("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
        button_save_selected_host.classList.add("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
        button_cancel_selected_host.classList.add("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
      } else {
        button_multiple_host_popup.classList.remove("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
        button_save_selected_host.classList.remove("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
        button_cancel_selected_host.classList.remove("shadow-[0_0_70px_rgba(0,_0,_0,_1)]");
      }
  }

  window.addEventListener("scroll", handle_scroll);

  upload_preparation(button_gofile, ["gofile.io"], "Gofile has no known bugs or problems.", "https://gofile.io/terms");
  upload_preparation(button_litterbox, ["litter.catbox.moe"], "Litterbox occasionally returns 512 errors.", "https://litterbox.catbox.moe/faq.php");
  upload_preparation(button_fileio, ["file.io"], "File.io has no known bugs or problems.", "https://www.file.io/tos/");
  upload_preparation(button_tmpfilesorg, ["tmpfiles.org"], "TmpFiles.org has no known bugs or problems.", "https://tmpfiles.org/about");
  upload_preparation(button_0x0, ["0x0.st"], "0x0.st has no known bugs or problems.", "https://0x0.st/");
  upload_preparation(button_cvsh, ["c-v.sh"], "C-V.sh has no known bugs or problems.", "https://c-v.sh/");
  upload_preparation(button_kitc, ["ki.tc"], "Ki.tc has no known bugs or problems.", "https://logic-gate-demo.readthedocs.io/en/latest/readme.html");
  upload_preparation(button_oshi, ["oshi.at"], "Oshi.at is inaccessible from certain IPs with the error \"Connection reset\".", "https://oshi.at/abuse");
  upload_preparation(button_filebin, ["filebin.net"], "Filebin often runs out of storage.", "https://filebin.net/terms");
  upload_preparation(button_transfersh, ["transfer.sh"], "Transfer.sh has no known bugs or problems.", "https://transfer.sh/");
  upload_preparation(button_bashupload, ["bashupload.com"], "Bashupload.com allows only one download per link.", "https://bashupload.com/disclaimer");
  upload_preparation(button_curlby, ["curl.by"], "Curl.by has no known bugs or problems.", "https://www.curl.by/disclaimer");
  upload_preparation(button_x0at, ["x0.at"], "x0.at has no known bugs or problems.", "https://x0.at/");
  upload_preparation(button_uplooad, ["uplooad.net"], "Uplooad has no known bugs or problems.", "https://uplooad.net/tos.html");
  upload_preparation(button_tommoteam, ["a.tommo.team"], "Tommo.team has no known bugs or problems.", "https://tommo.team/faq.html");
  upload_preparation(button_tempfilesninja, ["tempfiles.ninja"], "tempfiles.ninja has no known bugs or problems.", "https://tempfiles.ninja/");
  upload_preparation(button_pixeldrain, ["pixeldrain.com"], "Pixeldrain has no known bugs or problems.", "https://pixeldrain.com/abuse", "https://pixeldrain.com/user/api_keys");
  upload_preparation(button_1cloudfile, ["1cloudfile.com"], "1Cloudfile has no known bugs or problems.", "https://1cloudfile.com/terms");
  upload_preparation(button_bowfile, ["bowfile.com"], "Bowfile imposes a waiting time of 7 seconds before the file can be downloaded.", "https://bowfile.com/terms");
  upload_preparation(button_uploadify, ["uploadify.net"], "Uplodify imposes a waiting time of 20 seconds before the file can be downloaded.", "https://uploadify.net/terms.html");
  upload_preparation(button_anontransfer, ["anontransfer.com"], "AnonTransfer has no known bugs or problems.", "https://anontransfer.com/terms");
  upload_preparation(button_anonsharing, ["anonsharing.com"], "AnonSharing imposes a waiting time of 20 seconds before the file can be downloaded.", "https://anonsharing.com/terms");
  upload_preparation(button_tempsh, ["temp.sh"], "Temp.sh has no known bugs or problems.", "https://temp.sh/");
  upload_preparation(button_uguuse, ["a.uguu.se"], "Uguu.se has no known bugs or problems.", "https://uguu.se/faq.html");
  upload_preparation(button_nopaste, ["nopaste.net"], "Nopaste has no known bugs or problems.", "https://nopaste.net/");
  upload_preparation(button_udrop, ["www.udrop.com"], "udrop has no known bugs or problems.", "https://www.udrop.com/terms");
  upload_preparation(button_tempsend, ["tempsend.com"], "Tempsend has no known bugs or problems.", "https://tempsend.com/");
  upload_preparation(button_1fichier, ["1fichier.com"], "1fichier limits bandwidth during download and imposes a waiting time between file downloads.", "https://img.1fichier.com/2021-10-01-CGU.pdf");
  upload_preparation(button_turbobit, ["turbobit.net"], "Turbobit limits bandwidth during download and imposes a waiting time between file downloads.", "https://turbobit.net/rules");
  upload_preparation(button_hitfile, ["hitfile.net"], "Hitfile limits bandwidth during download and imposes a waiting time between file downloads.", "https://hitfile.net/rules");
  upload_preparation(button_fileupload, ["file-upload.org"], "file-upload.org limits bandwidth during download and imposes a waiting time before the file can be downloaded.", "https://www.file-upload.org/tos.html");
  upload_preparation(button_hexupload, ["hexload.com"], "HexUpload has no known bugs or problems.", "https://hexload.com/tos.html");
  upload_preparation(button_mexash, ["mexa.sh"], "Mexa.sh has no known bugs or problems.", "https://mexa.sh/tos.html");
  upload_preparation(button_rapidfileshare, ["www.rapidfileshare.net"], "RapidFileShare limits bandwidth and restricts downloads to 1GB per day.", "http://rapidfileshare.net/tos.html");
  upload_preparation(button_sendcm, ["send.cm"], "Send.cm has no known bugs or problems.", "https://send.cm/terms");
  upload_preparation(button_filetmp, ["filetmp.com"], "FileTmp has no known bugs or problems.", "https://filetmp.com/");
  upload_preparation(button_usersdrive, ["usersdrive.com"], "UsersDrive imposes a waiting time of 17 seconds before the file can be downloaded.", "https://usersdrive.com/tos.html");
  upload_preparation(button_downloadgg, ["download.gg"], "Download.gg has no known bugs or problems.", "https://download.gg");
  upload_preparation(button_megaup, ["megaup.net"], "MegaUp imposes a waiting time of 5 seconds before the file can be downloaded.", "https://megaup.net/terms.html");
  upload_preparation(button_krakenfiles, ["krakenfiles.com"], "KrakenFiles has no known bugs or problems.", "https://krakenfiles.com/terms");
  upload_preparation(button_clicknupload, ["clicknupload.click"], "Clicknupload imposes a waiting time of 12 seconds before the file can be downloaded.", "https://clicknupload.click/tos.html");
  upload_preparation(button_uploadee, ["www.upload.ee"], "Upload.ee has no known bugs or problems.", "https://www.upload.ee/rules.html");
  upload_preparation(button_ccuto, ["ccu.to"], "CCU.to has no known bugs or problems.", "https://ccu.to");
  upload_preparation(button_filespacecom, ["filespace.com"], "Filespace imposes a captcha before downloading and limits bandwidth.", "https://filespace.com/tos.html");
  upload_preparation(button_gulfup, ["www.gulf-up.com"], "Gulfup imposes a waiting time of 22 seconds before the file can be downloaded.", "https://www.gulf-up.com/tos.html");
  upload_preparation(button_cyberfile, ["cyberfile.me"], "CyberFile has no known bugs or problems.", "https://cyberfile.me/terms");
  upload_preparation(button_freefr, ["transfert.free.fr"], "Free.fr has no known bugs or problems.", "https://transfert.free.fr/data/CGU_FREE_TRANSFERT_080223.pdf");
  upload_preparation(button_depositfiles, ["dfiles.eu"], "DepositFiles imposes a waiting time of 22 seconds before the file can be downloaded.", "https://dfiles.eu/user_agreement.html");
  upload_preparation(button_tmpsend, ["tmpsend.com"], "TmpSend has no known bugs or problems.", "https://tmpsend.com/faq");
  upload_preparation(button_ufile, ["ufile.io"], "uFile limits download speed to 1 Mb/s.", "https://ufile.io/terms");
  upload_preparation(button_dropdownload, ["drop.download"], "Drop.download imposes a captcha before downloading a file.", "https://drop.download/pages/tos", "https://drop.download/account");
  upload_preparation(button_filemoon, ["filemoon.sx"], "FileMoon takes a long time to encode videos.", "https://filemoon.sx/tos", "https://filemoon.sx/settings");
  upload_preparation(button_catbox, ["files.catbox.moe"], "Catbox occasionally returns 512 errors.", "https://catbox.moe/legal.php", "https://catbox.moe/user/manage.php");
  upload_preparation(button_sendvid, ["sendvid.com"], "Sendvid takes a long time to encode videos.", "https://sendvid.com/help/tos");
  upload_preparation(button_upstore, ["upstore.net"], "Upstore imposes a waiting time of 60 seconds before the file can be downloaded.", "https://upstore.net/terms");
  upload_preparation(button_ddownload, ["ddownload.com"], "ddownload imposes a captcha before downloading a file.", "https://ddownload.com/tos.html", "https://ddownload.com/?op=my_account");
  upload_preparation(button_mp4upload, ["mp4upload.com"], "mp4upload imposes a waiting time of 20 seconds before the file can be downloaded.", "https://mp4upload.com/tos", "https://www.mp4upload.com/account/");
  upload_preparation(button_netu, ["waaw.ac"], "Netu has lots of ads.", "https://netu.ac/view_page.php?pid=12");
  upload_preparation(button_dropgalaxy, ["dropgalaxy.com"], "DropGalaxy imposes a waiting time of 20 seconds and a captcha before the file can be downloaded and has lots of ads.", "https://dropgalaxy.com/tos.html", "https://dropgalaxy.com/?op=my_account");
  upload_preparation(button_nitroflare, ["nitroflare.com"], "Nitroflare imposes a waiting time of 2 minutes and a captcha before the file can be downloaded and limits bandwidth.", "https://nitroflare.com/tos", "https://nitroflare.com/user-hash");
  upload_preparation(button_vidoza, ["vidoza.net"], "Vidoza imposes a captcha before the file can be downloaded.", "https://vidoza.net/tos", "https://vidoza.net/?op=my_account");
  upload_preparation(button_katfile, ["katfile.com"], "Katfile imposes a waiting time of 2 hours between file downloads.", "https://katfile.com/tos.html", "https://katfile.com/?op=my_account");
  upload_preparation(button_rapidgator, ["rapidgator.net"], "Rapidgator limits bandwidth during download and imposes a waiting time of 2 hours between file downloads.", "https://rapidgator.net/article/terms", "https://rapidgator.net/article/api/user#login");
  upload_preparation(button_fastupload, ["fastupload.io"], "Fastupload imposes a waiting time of 5 seconds before the file can be downloaded.", "https://fastupload.io/terms");
  upload_preparation(button_imgbb, ["ibb.co"], "ImgBB has no known bugs or problems.", "https://imgbb.com/tos");
  upload_preparation(button_buzzheavier, ["buzzheavier.com"], "Buzzheavier has no known bugs or problems.", "https://buzzheavier.com/terms");
  upload_preparation(button_doodstream, ["dood.li"], "DoodStream has no known bugs or problems.", "https://doodstream.com/terms-and-conditions", "https://doodstream.com/settings");
  upload_preparation(button_streama2z, ["streama2z.xyz"], "StreamA2Z prevents ad blockers and forces you to disable them.", "https://streama2z.com/tos", "https://streama2z.com/?op=my_account");
  upload_preparation(button_streamwish, ["strwish.com"], "StreamWish has no known bugs or problems.", "https://streamwish.com/tos", "https://streamwish.com/settings");
  upload_preparation(button_streamruby, ["rubystm.com"], "StreamRuby does not accept short videos (less than 5 seconds).", "https://streamruby.com/tos", "https://streamruby.com/?op=my_account");
  upload_preparation(button_voesx, ["voe.sx"], "Voe.sx has no known bugs or problems.", "https://voe.sx/tos", "https://voe.sx/settings");
  upload_preparation(button_devuploads, ["devuploads.com"], "DevUploads has no known bugs or problems.", "https://devuploads.com/tos", "https://devuploads.com/account");
  upload_preparation(button_mediacm, ["media.cm"], "Media.cm has no known bugs or problems.", "https://media.cm/terms");
  upload_preparation(button_uploadev, ["uploadev.org"], "UploadEv imposes a waiting time of 5 seconds and a captcha before the file can be downloaded.", "https://uploadev.org/tos.html");
  upload_preparation(button_isracloud, ["isra.cloud"], "Isra.cloud has no known bugs or problems.", "https://isra.cloud/tos.html");
  upload_preparation(button_dailyuploads, ["dailyuploads.net"], "DailyUploads has no known bugs or problems.", "https://dailyuploads.net/tos.html");
  upload_preparation(button_worldbytez, ["worldbytez.com"], "Worldbytez imposes a waiting time of 180 seconds, a captcha and an account before the file can be downloaded.", "https://worldbytez.com/tos.html");
  
  function get_file_hash(file, chunk_size = 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const hash = CryptoJS.algo.MD5.create();
      let offset = 0;

      reader.onload = function (event) {
        try {
          const word_array = CryptoJS.lib.WordArray.create(event.target.result);
          hash.update(word_array);
          offset += event.target.result.byteLength;

          if (offset < file.size) {
            const slice = file.slice(offset, offset + chunk_size);
            reader.readAsArrayBuffer(slice);
          } else {
            resolve(hash.finalize().toString(CryptoJS.enc.Hex));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = function (error) {
        reject(error);
      };

      const slice = file.slice(offset, offset + chunk_size);
      reader.readAsArrayBuffer(slice);
    });
  }

  async function get_prefix_url_server(url, regex, regex_number) {
    if (upload_mode == "local") {
      popup_upload_button_local.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      popup_upload_button_local.classList.add("animate-pulse");
    } else if (upload_mode == "url") {
      popup_upload_button_url.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      popup_upload_button_url.classList.add("animate-pulse");
    }

    try {
        const response = await fetch(url_for_bypass_cors + url);
        
        if (response.ok) {
            const data = await response.text();
            const server_url = data.match(regex)[regex_number];
            return "https://" + server_url;
        } else {
            console.error("Unable to retrieve upload server. Status code: " + response.status);
        }
    } catch (error) {
        console.error("Error during fetch:", error);
    } 
}

  function get_file_name_from_url(url) {
    try {
      const url_object = new URL(url);
      const pathname = url_object.pathname;
      const last_segment = pathname.split('/').filter(segment => segment);

      if (last_segment.length === 0) {
          throw new Error("The URL provided does not contain a valid path.");
      }

      const filename = last_segment[last_segment.length - 1];
      return filename;
    } catch (error) {
        return null;
    }
  }

  async function get_api_key(host) {
    let api_key = "";
  
    try {
      const result = await get_resource_path();
      const response = await fetch(convertFileSrc(result + "/api_keys.json"));
      const data = await response.json();
  
      api_key = data[host];
  
    } catch (error) {
      console.error("Error retrieving path to local application data: " + error);
    }
  
    return api_key;
  }

  function generate_sid() {
    let sid = '';
    for (let i = 0; i < 12; i++) {
      sid += Math.floor(Math.random() * 10).toString();
    }
    return sid;
  }
  
  function start_upload(event) {
    event.preventDefault();
    disabled_upload_button();
    upload_local_file_button.style.pointerEvents = "none";
    upload_local_file_button.classList.add("opacity-50");
    upload_from_url_button.style.pointerEvents = "none";
    upload_from_url_button.classList.add("opacity-50");

    popup_browse_button.classList.add("opacity-50", "cursor-not-allowed");
    popup_browse_button.setAttribute("disabled", "");
    popup_browse_button.classList.remove("hover:scale-105", "hover:scale-[1.01]", "hover:from-indigo-500", "hover:from-indigo-600", "hover:to-[#7072ee]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.3)]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.2)]", "active:scale-110", "active:scale-[1.03]");
    delete_file_input.classList.add("opacity-50", "cursor-not-allowed");
    delete_file_input.setAttribute("disabled", "");
    delete_file_input.classList.remove("active:scale-125")

    if (upload_mode == "local") {
      popup_upload_button_local.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      popup_upload_button_local.classList.add("animate-pulse");

      if (is_drag_file === false) {
        file_to_upload = popup_file_input.files[0];
        file_to_upload_name = popup_file_input.files[0].name;
        file_to_upload_size = popup_file_input.files[0].size;
      } else {
        file_to_upload = drag_file;
        file_to_upload_name = drag_file_name;
        file_to_upload_size = drag_file_size;
      }
    }


    let url_upload_promise = new Promise((resolve) => {
    
      if (upload_mode == "url") {
        let promises = [];

        popup_upload_button_url.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        popup_upload_button_url.classList.add("animate-pulse");

        let promise = fetch(url_for_bypass_cors + url_upload_input.value)
        .then(response => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error("Failed to fetch file. HTTP status code: " + response.status);
          }
        })
        .then(blob => {
          file_to_upload_name = get_file_name_from_url(url_upload_input.value);

          if (file_to_upload_name) {
            file_to_upload = new File ([blob], file_to_upload_name, { type: blob.type })
            file_to_upload_size = file_to_upload.size;
          } else {
            final_upload_url.textContent = "Error: Unable to retrieve file name from provided URL.";
            file_to_upload = "";
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });

        promises.push(promise);

        Promise.all(promises).then(() => {
          resolve(file_to_upload);
        });
      } else {
        resolve(file_to_upload);
      }
    }); 

    host.forEach(function (current_host) {
      const sent_data_form = new FormData();

      url_upload_promise.then((file_to_upload) => {
        if (file_to_upload) {
          if (current_host === "gofile.io") {
            fetch(url_for_bypass_cors + "https://api.gofile.io/servers", {method: "GET", headers: {"Content-Type": "application/json", "X-Requested-With": "*"}, signal: controller_signal})
              .then((response) => response.json())
              .then((data) => {
                const gofile_server = data.data.servers[0].name;
                sent_data_form.append("file", file_to_upload);
                upload_to_host([url_for_bypass_cors + "https://" + gofile_server + ".gofile.io/contents/uploadfile", "POST", sent_data_form], "json", ["data", "downloadPage"], [], ["https://api.gofile.io/contents", "DELETE", {"contentsId": ["data", "parentFolder"], "token": ["data", "guestToken"]}]);
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
            upload_to_host([url_for_bypass_cors + "https://c-v.sh/", "POST", sent_data_form], "text", ["match", /https:\/\/c-v\.sh\/[^\s]+/, 0], [], [["match", /(\b\w+\b)$/], "DELETE", {}, [["final_url" + "?token="]]]);
    
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
            upload_to_host([url_for_bypass_cors + "https://bashupload.com/", "POST", sent_data_form], "text", ["match", /https:\/\/bashupload\.com\/\S+/, 0]);
    
          } else if (current_host === "curl.by") {
            sent_data_form.append("file_3", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://curl.by/", "POST", sent_data_form], "text", ["match", /https:\/\/curl\.by\/\S+/, 0]);
    
          } else if (current_host === "x0.at") {
            sent_data_form.append("file", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://x0.at/", "POST", sent_data_form], "text");
    
          } else if (current_host === "uplooad.net") {
            get_prefix_url_server("https://uplooad.net/", /https:\/\/((?!www)[a-zA-Z0-9]+)\.uplooad\.net/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("file_0", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".uplooad.net/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://uplooad.net/"], ["https://uplooad.net", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/www\.uplooad\.net\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://uplooad.net/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
            })
    
          } else if (current_host === "a.tommo.team") {
            sent_data_form.append("files[]", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://www.tommo.team/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);
    
          } else if (current_host === "tempfiles.ninja") {
            upload_to_host([url_for_bypass_cors + "https://tempfiles.ninja/api/upload?filename=" + file_to_upload_name, "POST", file_to_upload], "json", ["download_url"], [], [[["id"], ["delete_password"], "/"], "DELETE", {}, ["https://tempfiles.ninja/api/delete/"]]);
    
          } else if (current_host === "pixeldrain.com") {
            get_api_key(host).then((response) => {
              const api_key = response;

              upload_to_host([url_for_bypass_cors + "https://pixeldrain.com/api/file/" + file_to_upload_name, "PUT", file_to_upload, {"Authorization": "Basic "+btoa(":" + api_key)}], "json", ["id"], ["https://pixeldrain.com/u/"], [[["id"], ""], "DELETE", {}, ["https://pixeldrain.com/api/file/"], {"Authorization": "Basic "+btoa(":" + api_key)}]);
            });
            
          } else if (current_host === "1cloudfile.com") {
            get_prefix_url_server("https://1cloudfile.com/assets/js/uploader.js", /https:\/\/([a-zA-Z0-9]+)\.1cloudfile\.com/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("files[]", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".1cloudfile.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
            })

          } else if (current_host === "bowfile.com") {
            get_prefix_url_server("https://bowfile.com/assets/js/uploader.js", /https:\/\/([a-zA-Z0-9]+)\.bowfile\.com/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("files[]", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".bowfile.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
            })
    
          } else if (current_host === "uploadify.net") {
            sent_data_form.append("files[]", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://uploadify.net/core/page/ajax/file_upload_handler.ajax.php", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"delete": "1", "submitme": "1", "returnAccount": "0", "submit": ""}]);
    
          } else if (current_host === "anontransfer.com") {
            sent_data_form.append("file", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://www.anontransfer.com/upload.php", "POST", sent_data_form], "json", ["uri"]);
    
          } else if (current_host === "anonsharing.com") {
            sent_data_form.append("files[]", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://anonsharing.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
    
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
            upload_to_host([url_for_bypass_cors + "https://www.udrop.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
    
          } else if (current_host === "tempsend.com") {
            sent_data_form.append("file", file_to_upload);
            sent_data_form.append("expire", "604800");
            upload_to_host([url_for_bypass_cors + "https://tempsend.com/send", "POST", sent_data_form], "text", ["match", /https:\/\/tempsend\.com\/([A-Za-z0-9]+)/, 0]);
    
          } else if (current_host === "1fichier.com") {
            disabled_upload_button();
    
            fetch(url_for_bypass_cors + "https://api.1fichier.com/v1/upload/get_upload_server.cgi", {method: "POST", headers: {"Content-Type": "application/json", "X-Requested-With": "*"}, signal: controller_signal})
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
            get_prefix_url_server("https://turbobit.net/", /https:\/\/([a-zA-Z0-9]+)\.turbobit\.net/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("apptype", "fd1");
              sent_data_form.append("sort-by", "defaultSort");
              sent_data_form.append("sort-by", "defaultSort");
              sent_data_form.append("sort-by", "defaultSort");
              sent_data_form.append("Filedata", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".turbobit.net/uploadfile", "POST", sent_data_form], "json", ["id"], ["https://turbobit.net/", ".html"]);
            })

          } else if (current_host === "hitfile.net") {
            get_prefix_url_server("https://hitfile.net/", /https:\/\/([a-zA-Z0-9]+)\.hitfile\.net/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("apptype", "fd2");
              sent_data_form.append("Filedata", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".hitfile.net/uploadfile", "POST", sent_data_form], "json", ["id"], ["https://hitfile.net/"]);
            })
    
          } else if (current_host === "file-upload.org") {
            get_prefix_url_server("https://www.file-upload.org/?op=upload_form", /https:\/\/((?!www)[a-zA-Z0-9]+)\.file-upload\.download/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("file_0", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".file-upload.download/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://file-upload.org/"], ["https://file-upload.org", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/www\.file-upload\.org\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://file-upload.org/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
            })
    
          } else if (current_host === "hexload.com") {
            sent_data_form.append("file_0", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://oren291908.takeplcdn.art/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://hexload.com/"], ["https://hexload.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/hexload\.com\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://hexload.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
    
          } else if (current_host === "mexa.sh") {
            get_prefix_url_server("https://mexa.sh/", /https:\/\/([a-zA-Z0-9]+)\.mexa\.sh/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("file_0", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".mexa.sh/cgi-bin/upload.cgi?upload_type=file", "POST", sent_data_form], "json", [0, "file_code"], ["https://mexa.sh/", ".html"], ["https://mexa.sh", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/mexa\.sh\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://mexa.sh/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes"}]);
            })
    
          } else if (current_host === "www.rapidfileshare.net") {
            sent_data_form.append("file_0", file_to_upload);
            upload_to_host([url_for_bypass_cors + "http://trinity.rapidfileshare.net/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["http://www.rapidfileshare.net/", ".html"], ["http://www.rapidfileshare.net", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /http:\/\/www\.rapidfileshare\.net\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "http://www.rapidfileshare.net/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
    
          } else if (current_host === "send.cm") {
            get_prefix_url_server("https://send.cm/", /https:\/\/([a-zA-Z0-9]+)\.send\.cm/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("file_0", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".send.cm/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://send.cm/"]);
            })
    
          } else if (current_host === "filetmp.com") {
            fetch(url_for_bypass_cors + "https://filetmp.com/upload/genid?_=" + Date.now(), {method: "GET", headers: {"Content-Type": "application/json", "X-Requested-With": "*"}, signal: controller_signal})
              .then((response) => response.json())
              .then((data) => {
                const filetmp_upload_id = data.upload_id;
    
                const data_filetmp = {destruct: "no", "email_to[]": "", share: "link", email_from: "", message: "", password: "", expire: "18000", upload_id: filetmp_upload_id};
    
                const data_filetmp_encoded = new URLSearchParams(data_filetmp).toString();
    
                fetch(url_for_bypass_cors + "https://filetmp.com/upload/register", {method: "POST", body: data_filetmp_encoded, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest"}, signal: controller_signal})
                  .then((response) => response.json())
                  .then((data) => {
                    sent_data_form.append("upload_id", filetmp_upload_id);
                    sent_data_form.append("files[]", file_to_upload);
                    upload_to_host([url_for_bypass_cors + "https://filetmp.com/upload", "POST", sent_data_form], "json", ["https://filetmp.com/" + filetmp_upload_id]);
                  });
            });
    
          } else if (current_host === "usersdrive.com") {
            sent_data_form.append("file_0", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://d300.userdrive.org/cgi-bin/upload.cgi?upload_type=file", "POST", sent_data_form], "json", [0, "file_code"], ["https://usersdrive.com/", ".html"], ["https://usersdrive.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/usersdrive\.com\/[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://usersdrive.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
    
          } else if (current_host === "download.gg") {
            sent_data_form.append("file[]", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://download.gg/server/upload5555.php", "POST", sent_data_form], "text", ["replace", "&", "_"], ["https://download.gg/file-"], ["https://download.gg/server/delete.php", "POST", {"send-id-file-delete": ["match", /^\d+/]}]);
    
          } else if (current_host === "megaup.net") {
            get_prefix_url_server("https://megaup.net/", /https:\/\/([a-zA-Z0-9]+)\.megaup\.net/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("files[]", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".megaup.net/core/page/ajax/file_upload_handler.ajax.php", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"delete": "1", "submitme": "1", "returnAccount": "0", "submit": ""}]);
            })
    
          } else if (current_host === "krakenfiles.com") {
            disabled_upload_button();
    
            fetch(url_for_bypass_cors + "https://krakenfiles.com/api/server/available", {method: "GET", signal: controller_signal})
              .then((response) => response.json())
              .then((data) => {
                const url_krakenfiles_upload = data.data.url;
                const server_krakenfiles = url_krakenfiles_upload.match(/^https:\/\/([^/]+)/)[0];
    
                sent_data_form.append("files[]", file_to_upload);
                upload_to_host([url_for_bypass_cors + server_krakenfiles + "/_uploader/gallery/upload", "POST", sent_data_form], "json", ["files", "0", "url"], ["https://krakenfiles.com"]);
            });
    
          } else if (current_host === "clicknupload.click") {
            get_prefix_url_server("https://clicknupload.click/", /https:\/\/([a-zA-Z0-9]+)\.clicknupload\.net/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("file_0", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".clicknupload.net/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://clicknupload.click/"], ["https://clicknupload.click", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/clicknupload\.click\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://clicknupload.click/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
            })
    
          } else if (current_host === "www.upload.ee") {
            disabled_upload_button();
    
            const timestamp_date = new Date().getTime();
    
            fetch(url_for_bypass_cors + "https://www.upload.ee/ubr_link_upload.php?page=uploadsimple&rnd_id=" + timestamp_date, {method: "GET", signal: controller_signal})
              .then((response) => response.text())
              .then((data) => {
                const uploadee_upload_id = data.match(/"[A-Za-z0-9]+/)[0].slice(1);
    
                sent_data_form.append("link", "");
                sent_data_form.append("email", "");
                sent_data_form.append("category", "cat_file");
                sent_data_form.append("big_resize", "none");
                sent_data_form.append("upfile_0", file_to_upload);
    
                fetch(url_for_bypass_cors + "https://www.upload.ee/cgi-bin/ubr_upload.pl?X-Progress-ID=" + uploadee_upload_id + "&upload_id=" + uploadee_upload_id, {method: "POST", body: sent_data_form, signal: controller_signal})
                .then((response) => response.text())
                .then(data => {
                  const uploadee_upload_url = "https://www.upload.ee/?page=finishedsimple&upload_id=" + uploadee_upload_id;
    
                  fetch(url_for_bypass_cors + uploadee_upload_url, {method: "GET", signal: controller_signal})
                  .then((response) => response.text())
                  .then(data => {
                    const uploadee_killcode_url = data.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/[^"]+\?killcode=[A-Za-z0-9]+/)[0];
                    const uploadee_url = data.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/.+(\.[A-Za-z0-9]+)+/)[0];
    
                    fetch(url_for_bypass_cors + uploadee_killcode_url, {method: "GET", signal: controller_signal})
                    .then((response) => response.text())
                    .then(data => {
                      const uploadee_delete_url = data.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/[^"]+\?killcode=[A-Za-z0-9]+&amp;confirm=([A-Za-z0-9_\-]+)[^"]+/)[0].replace("amp;", "");
                      
                      upload_to_host([url_for_bypass_cors + uploadee_upload_url, "GET"], "text", [uploadee_url], [], [uploadee_delete_url, "POST", {}]);
                    })
                  })
                })
                
            });
    
          } else if (current_host === "ccu.to") {
            upload_to_host([url_for_bypass_cors + "https://ccu.to/" + file_to_upload_name, "PUT", file_to_upload], "text");
    
          } else if (current_host === "filespace.com") {
            sent_data_form.append("file_0", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://rachel.filespace.com/cgi-bin/upload.cgi?js_on=1&utype=anon&upload_type=file", "POST", sent_data_form], "text", ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1], ["https://filespace.com/"]);
    
          } else if (current_host === "www.gulf-up.com") {
            sent_data_form.append("file_0", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://scdns.link/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://www.gulf-up.com/"], ["https://www.gulf-up.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/www\.gulf-up\.com\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://www.gulf-up.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
    
          } else if (current_host === "cyberfile.me") {
            get_prefix_url_server("https://cyberfile.me/assets/js/uploader.js", /https:\/\/([a-zA-Z0-9]+)\.cyberfile\.me/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("files[]", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".cyberfile.me/ajax/file_upload_handler?r=cyberfile.me&p=https", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
            })
    
          } else if (current_host === "transfert.free.fr") {
            disabled_upload_button();
    
            fetch("https://api.scw.iliad.fr/freetransfert/v2/transfers", {method: "POST", signal: controller_signal, headers: {"Content-Type": "application/json"}, body: JSON.stringify({availability: 7, files: [{mimetype: "application/octet-stream", path: file_to_upload_name, size: file_to_upload_size}]})})
            .then(response => response.json())
            .then((data) => {
              const delete_key = data.deleteKey;
              const transfer_key = data.transferKey;
    
              const final_free_url = "https://transfert.free.fr/" + transfer_key;
    
              fetch("https://api.scw.iliad.fr/freetransfert/v2/transfers/" + transfer_key + "/chunk", {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const upload_url = data.files[0].parts[0].url;
    
                fetch(upload_url, {method: "PUT", body: file_to_upload, signal: controller_signal})
                .then(response => {
                  const etag = response.headers.get("Etag")
                  upload_to_host([url_for_bypass_cors + "https://api.scw.iliad.fr/freetransfert/v2/transfers/" + transfer_key + "/chunk", "PUT", JSON.stringify({"files": [{"path": file_to_upload_name, "parts": [{"PartNumber": 1, "ETag": etag}]}]}), {"Content-Type": "application/json"}], "text", [final_free_url], [], ["https://api.scw.iliad.fr/freetransfert/v2/transfers/" + transfer_key, "DELETE", {"deleteKey": delete_key}]);})
              })
            })
    
          } else if (current_host === "dfiles.eu") {
            sent_data_form.append("files", file_to_upload);
            sent_data_form.append("format", "html5");
            sent_data_form.append("fm", "root");
            sent_data_form.append("fmh", "");
            upload_to_host([url_for_bypass_cors + "https://fileshare2081.dfiles.eu/upload/FS208-1u/", "POST", sent_data_form], "text", ["match", /http:\\\/\\\/depositfiles\.com\\\/files\\\/(\w+)/, 1], ["https://dfiles.eu/files/"]);
    
          } else if (current_host === "tmpsend.com") {
            disabled_upload_button();

            const tmpsend_formdata = new FormData();
            tmpsend_formdata.append("action", "add");
            tmpsend_formdata.append("name", file_to_upload_name);
            tmpsend_formdata.append("size", file_to_upload_size);

            fetch(url_for_bypass_cors + "https://tmpsend.com/upload", {method: "POST", body: tmpsend_formdata, signal: controller_signal})
            .then(response => response.json())
            .then((data) => {
              const id = data.id
              sent_data_form.append("action", "upload");
              sent_data_form.append("id", id);
              sent_data_form.append("name", file_to_upload_name);
              sent_data_form.append("size", file_to_upload_size);
              sent_data_form.append("start", "0");
              sent_data_form.append("end", file_to_upload_size);
              sent_data_form.append("data", file_to_upload);
              const url_tmpsend = "https://tmpsend.com/" + id;
              upload_to_host([url_for_bypass_cors + "https://tmpsend.com/upload", "POST", sent_data_form], "json", [url_tmpsend]);
            })
            
          }  else if (current_host === "ufile.io") {
            disabled_upload_button();

            fetch(url_for_bypass_cors + "https://ufile.io", {method: "GET", signal: controller_signal})
            .then(response => response.text())
            .then((data) => {
              const csrf_token = data.match(/<input id="csrf_hash" type="hidden" value="([^"]+)" \/>/)[1]
              const session_id = data.match(/<input id="session_id" type="hidden" value="([^"]+)" \/>/)[1]

              fetch(url_for_bypass_cors + "https://ufile.io/v1/upload/select_storage", {method: "POST", body:"csrf_test_name=" + csrf_token, signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const ufile_upload_url = data.storageBaseUrl;
                
                fetch(url_for_bypass_cors + ufile_upload_url + "v1/upload/create_session", {method: "POST",  headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body:"csrf_test_name=" + csrf_token + "&file_size=" + file_to_upload_size, signal: controller_signal})
                .then(response => response.json())
                .then((data) => {
                  const ufile_fuid = data.fuid;

                  const ufile_form_data = new FormData();
                  ufile_form_data.append("chunk_index", "1");
                  ufile_form_data.append("fuid", ufile_fuid);
                  ufile_form_data.append("file", file_to_upload);
                  
                  fetch(url_for_bypass_cors + ufile_upload_url + "v1/upload/chunk", {method: "POST", body: ufile_form_data, signal: controller_signal})
                  .then((data) => {
                    const extension_file = file_to_upload_name.split(".").pop();
                    upload_to_host([url_for_bypass_cors + ufile_upload_url + "v1/upload/finalise", "POST", "csrf_test_name=" + csrf_token + "&fuid=" + ufile_fuid + "&file_name=" + file_to_upload_name + "&file_type=" + extension_file + "&total_chunks=1&session_id=" + session_id, {"Content-Type": "application/x-www-form-urlencoded"}], "json", ["url"]);
                  })
                })
              })

              
            })
          
          } else if (current_host === "drop.download") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://drop.download/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const dropdownload_upload_url = data.result;
                const dropdownload_sess_id = data.sess_id;
                
                sent_data_form.append("sess_id", dropdownload_sess_id);
                sent_data_form.append("utype", "reg");
                sent_data_form.append("file_0", file_to_upload);
                upload_to_host([url_for_bypass_cors + dropdownload_upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://drop.download/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "Drop.download"]);
              });
            });

          } else if (current_host === "filemoon.sx") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://filemoonapi.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const filemoon_upload_url = data.result;                
                
                sent_data_form.append("key", api_key_host);
                sent_data_form.append("file", file_to_upload);
                upload_to_host([url_for_bypass_cors + filemoon_upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://filemoon.sx/d/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "FileMoon"]);
              });      
            });
          } else if (current_host === "files.catbox.moe") {
            get_api_key(host).then((response) => {
              sent_data_form.append("reqtype", "fileupload");
              sent_data_form.append("userhash", response);
              sent_data_form.append("fileToUpload", file_to_upload);
              upload_to_host([url_for_bypass_cors + "https://catbox.moe/user/api.php", "POST", sent_data_form], "text", [], [], ["https://catbox.moe/user/api.php", "POST", {"reqtype": "deletefiles", "userhash": response, "files": ["match", /https:\/\/files\.catbox\.moe\/([A-Za-z0-9]+(\.[A-Za-z0-9]+)*)/, 1]}]);
            })
    
          } else if (current_host === "sendvid.com") {
            sent_data_form.append("video", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://sendvid.com/api/v1/videos", "POST", sent_data_form], "json", ["video", "slug"], ["https://sendvid.com/"]);

          } else if (current_host === "upstore.net") {
            get_prefix_url_server("https://upstore.net/", /https:\/\/([a-zA-Z0-9]+)\.upstore\.net/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("file", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".upstore.net/newupload/", "POST", sent_data_form], "json", ["hash"], ["https://upstore.net/"]);
            })

          } else if (current_host === "ddownload.com") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://api-v2.ddownload.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const ddownload_upload_url = data.result;
                const ddownload_sess_id = data.sess_id;
                
                sent_data_form.append("sess_id", ddownload_sess_id);
                sent_data_form.append("utype", "reg");
                sent_data_form.append("file_0", file_to_upload);
                upload_to_host([url_for_bypass_cors + ddownload_upload_url.replace(/^https:/, 'http:') + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://ddownload.com/"], ["https://ddownload.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/ddownload\.com\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://ddownload.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "ddownload"]);
              });
            });
          
          } else if (current_host === "mp4upload.com") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://www.mp4upload.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const mp4upload_upload_url = data.result;
                const mp4upload_sess_id = data.sess_id;
                
                sent_data_form.append("sess_id", mp4upload_sess_id);
                sent_data_form.append("utype", "reg");
                sent_data_form.append("file_0", file_to_upload);
                upload_to_host([url_for_bypass_cors + mp4upload_upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://mp4upload.com/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "mp4upload"]);
              });
            });

          } else if (current_host === "waaw.ac") {
            fetch(url_for_bypass_cors + "https://netu.ac/plugins/cb_multiserver/api/get_upload_server.php?user_hash=&upload_cookie_server=", {method: "GET", signal: controller_signal})
            .then(response => response.json())
            .then((data) => {
              const netu_server_id = data.server_id;
              const netu_upload_server = data.upload_server;
              const netu_hash = data.hash;
              const netu_time_hash = data.time_hash;
              const netu_user_id = data.userid;
              const netu_key_hash = data.key_hash;
              
              fetch(url_for_bypass_cors + netu_upload_server + "?Filedata=" + file_to_upload_name, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const netu_form_data = new FormData();

                netu_form_data.append("hash", netu_hash);
                netu_form_data.append("userid", netu_user_id);
                netu_form_data.append("usekey_hashrid", netu_key_hash);
                netu_form_data.append("time_hash", netu_time_hash);
                netu_form_data.append("Filedata", file_to_upload);

                fetch(url_for_bypass_cors + netu_upload_server, {method: "POST", body: netu_form_data, signal: controller_signal})
                .then(response => response.json())
                .then((data) => {
                  const netu_file_name = data.file_name;

                  sent_data_form.append("insertVideo", "yes");
                  sent_data_form.append("title", file_to_upload_name);
                  sent_data_form.append("file_name", netu_file_name);
                  sent_data_form.append("server", netu_upload_server);
                  sent_data_form.append("server_id", netu_server_id);

                  upload_to_host([url_for_bypass_cors + "https://netu.ac/actions/file_uploader.php", "POST", sent_data_form], "json", ["video_link"]);
                })
              })
            })

          } else if (current_host === "dropgalaxy.com") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://dropgalaxy.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const dropgalaxy_upload_url = data.result;
                const dropgalaxy_sess_id = data.sess_id;
                
                sent_data_form.append("sess_id", dropgalaxy_sess_id);
                sent_data_form.append("utype", "reg");
                sent_data_form.append("file_0", file_to_upload);
                upload_to_host([url_for_bypass_cors + dropgalaxy_upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://dropgalaxy.com/drive/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "DropGalaxy"]);
              });
            });
            
          } else if (current_host === "nitroflare.com") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://nitroflare.com/plugins/fileupload/getServer", {method: "GET", signal: controller_signal})
              .then(response => response.text())
              .then((data) => {
                const nitroflare_upload_url = data;
                
                sent_data_form.append("user", api_key_host);
                sent_data_form.append("files", file_to_upload);
                upload_to_host([url_for_bypass_cors + nitroflare_upload_url, "POST", sent_data_form], "json", ["files", 0, "url"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "Nitroflare"]);
              });
            });
            
          } else if (current_host === "vidoza.net") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://api.vidoza.net/v1/upload/http/server?api_token=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const vidoza_upload_url = data.data.upload_url;
                const vidoza_sess_id = data.data.upload_params.sess_id;
                
                sent_data_form.append("sess_id", vidoza_sess_id);
                sent_data_form.append("is_xhr", "true");
                sent_data_form.append("file", file_to_upload);
                upload_to_host([url_for_bypass_cors + vidoza_upload_url, "POST", sent_data_form], "json", ["code"], ["https://vidoza.net/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "Vidoza"]);
              });
            });
            
          } else if (current_host === "katfile.com") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://katfile.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const katfile_upload_url = data.result;
                const katfile_sess_id = data.sess_id;
                
                sent_data_form.append("sess_id", katfile_sess_id);
                sent_data_form.append("utype", "reg");
                sent_data_form.append("file_0", file_to_upload);
                upload_to_host([url_for_bypass_cors + katfile_upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://katfile.com/"], ["https://katfile.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/katfile\.com\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://katfile.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes"}]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "Katfile"]);
              });
            });
            
          } else if (current_host === "rapidgator.net") {
            if (upload_mode == "local") {
              popup_upload_button_local.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Hashing file...';
              popup_upload_button_local.classList.add("animate-pulse");
            } else if (upload_mode == "url") {
              popup_upload_button_url.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Hashing file...';
              popup_upload_button_url.classList.add("animate-pulse");
            }

            get_file_hash(file_to_upload).then(file_hash => {
              if (upload_mode == "local") {
                popup_upload_button_local.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
                popup_upload_button_local.classList.add("animate-pulse");
              } else if (upload_mode == "url") {
                popup_upload_button_url.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
                popup_upload_button_url.classList.add("animate-pulse");
              }
              get_api_key(host).then((response) => {
                let api_key_host = response;
  
                fetch(url_for_bypass_cors + "https://rapidgator.net/api/v2/file/upload?name=" + file_to_upload_name + "&hash=" + file_hash + "&size=" + file_to_upload_size + "&token=" + api_key_host, {method: "GET", signal: controller_signal})
                .then(response => response.json())
                .then((data) => {
                  const rapidgator_upload_id = data.response.upload.upload_id;
                  const rapidgator_upload_url = data.response.upload.url;

                  sent_data_form.append("file", file_to_upload);
                  fetch(url_for_bypass_cors + rapidgator_upload_url, {method: "POST", body: sent_data_form, signal: controller_signal})
                  .then(response => response.json())
                  .then((data) => {
                    setTimeout(function() {
                      upload_to_host([url_for_bypass_cors + "https://rapidgator.net/api/v2/file/upload_info?upload_id=" + rapidgator_upload_id + "&token=" + api_key_host, "GET"], "json", ["response", "upload", "file", "url"]);
                    }, 500);
                  })
                })
                .catch(() => {
                  display_final_url(["Invalid API key", "Rapidgator"]);
                }); 
              });
            })

          } else if (current_host === "fastupload.io") {
            get_prefix_url_server("https://fastupload.io/assets/js/uploader.js", /https:\/\/([a-zA-Z0-9]+)\.fastupload\.io/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("files[]", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".fastupload.io/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
            })
    
          } else if (current_host === "ibb.co") {
            sent_data_form.append("type", "file");
            sent_data_form.append("action", "upload");
            sent_data_form.append("source", file_to_upload);
            upload_to_host(["https://imgbb.com/json", "POST", sent_data_form], "json", ["image", "url_viewer"]);
    
          } else if (current_host === "buzzheavier.com") {
            sent_data_form.append("file", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://w.buzzheavier.com/t/" + file_to_upload_name, "PUT", sent_data_form], "json", ["id"], ["https://buzzheavier.com/f/"]);
    
          } else if (current_host === "dood.li") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://doodapi.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const doodstream_upload_url = data.result;
                
                sent_data_form.append("api_key", api_key_host);
                sent_data_form.append("file", file_to_upload);
                upload_to_host([url_for_bypass_cors + doodstream_upload_url, "POST", sent_data_form], "json", ["result", 0, "download_url"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "DoodStream"]);
              });
            });
          
          } else if (current_host === "streama2z.xyz") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://streama2z.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const streama2z_upload_url = data.result;
                
                sent_data_form.append("key", api_key_host);
                sent_data_form.append("file", file_to_upload);
                upload_to_host([url_for_bypass_cors + streama2z_upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://streama2z.xyz/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "StreamA2Z"]);
              });
            });
          
          } else if (current_host === "strwish.com") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://api.streamwish.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const streamwish_upload_url = data.result;
                
                sent_data_form.append("key", api_key_host);
                sent_data_form.append("file", file_to_upload);
                upload_to_host([url_for_bypass_cors + streamwish_upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://strwish.com/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "StreamWish"]);
              });
            });
          
          } else if (current_host === "rubystm.com") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://streamruby.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const streamruby_upload_url = data.result;
                
                sent_data_form.append("key", api_key_host);
                sent_data_form.append("file", file_to_upload);
                upload_to_host([url_for_bypass_cors + streamruby_upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://rubystm.com/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "StreamRuby"]);
              });
            });
          
          } else if (current_host === "voe.sx") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://voe.sx/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const voesx_upload_url = data.result;
                
                sent_data_form.append("key", api_key_host);
                sent_data_form.append("file", file_to_upload);
                upload_to_host([url_for_bypass_cors + voesx_upload_url, "POST", sent_data_form], "json", ["file", "file_code"], ["https://voe.sx/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "Voe.sx"]);
              });
            });
          
          } else if (current_host === "devuploads.com") {
            get_api_key(host).then((response) => {
              let api_key_host = response;

              fetch(url_for_bypass_cors + "https://devuploads.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: controller_signal})
              .then(response => response.json())
              .then((data) => {
                const devuploads_upload_url = data.result;
                const devuploads_sess_id = data.sess_id;
                
                sent_data_form.append("sess_id", devuploads_sess_id);
                sent_data_form.append("utype", "reg");
                sent_data_form.append("file_0", file_to_upload);
                upload_to_host([url_for_bypass_cors + devuploads_upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://devuploads.com/"]);
              })
              .catch(() => {
                display_final_url(["Invalid API key", "DevUploads"]);
              });
            });

          } else if (current_host === "media.cm") {
            get_prefix_url_server("https://media.cm/?op=upload_file", /https:\/\/([a-zA-Z0-9]+)\.media\.cm/, 1)
            .then(prefix_url_server => {
              sent_data_form.append("file", file_to_upload);
              upload_to_host([url_for_bypass_cors + prefix_url_server + ".media.cm/upload/01", "POST", sent_data_form], "text", ["match", /<textarea name="fn">([^<]+)<\/textarea>/, 1], ["https://media.cm/"]);
            })
    
          } else if (current_host === "uploadev.org") {
            get_prefix_url_server("https://uploadev.org/?op=upload_form", /https:\/\/([a-zA-Z0-9]+)\.uploadev\.org/, 1)
            .then(prefix_url_server => {
              const uploadev_sid = generate_sid();
    
              sent_data_form.append("file", file_to_upload, "file_0");
              sent_data_form.append("sid", uploadev_sid);
              fetch(url_for_bypass_cors + prefix_url_server + ".uploadev.org/cgi-bin/up.cgi", {method: "POST", body: sent_data_form, signal: controller_signal})
              .then(response => response.text())
              .then((data) => {
                const sent_data_form_final = new FormData;

                sent_data_form_final.append("fname", file_to_upload_name);
                sent_data_form_final.append("op", "compile");
                sent_data_form_final.append("session_id", "");
                sent_data_form_final.append("sid", uploadev_sid);
                upload_to_host([url_for_bypass_cors + prefix_url_server + ".uploadev.org/cgi-bin/api.cgi", "POST", sent_data_form_final], "text", ["match", /<Code>([^<]+)<\/Code>/, 1], ["https://uploadev.org/"], ["https://uploadev.org", "POST", {"op": "del_file", "id": ["match", /<Code>([^<]+)<\/Code>/, 1], "del_id": ["killcode", /https:\/\/uploadev\.org\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://uploadev.org/?op=upload_result&st=OK&fn=", ["match", /<Code>([^<]+)<\/Code>/, 1]], "confirm": "yes", "token": "CSRF token to add"}]);
              })
            })

          } else if (current_host === "isra.cloud") {   
            sent_data_form.append("file_0", file_to_upload);
            upload_to_host([url_for_bypass_cors + "https://fs24.isra.cloud/cgi-bin/upload.cgi?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://isra.cloud/"], ["https://isra.cloud", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/isra\.cloud\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://isra.cloud/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
    
          } else if (current_host === "dailyuploads.net") {
            fetch(url_for_bypass_cors + "https://dailyuploads.net/server")
            .then(response => response.json())
            .then((data) => {
              const dailupload_server_url = data.url;

              sent_data_form.append("file_0", file_to_upload);
              upload_to_host([url_for_bypass_cors + dailupload_server_url + "/upload.cgi", "POST", sent_data_form], "json", [0, "file_code"], ["https://dailyuploads.net/"]);
            })    
          } else if (current_host === "worldbytez.com") {
            sent_data_form.append("file", file_to_upload);
            upload_to_host([url_for_bypass_cors +  "https://w-555.org/cgi-bin/upload.cgi", "POST", sent_data_form], "json", [0, "file_code"], ["https://worldbytez.com/"]);
    
          }
        } else {
          disable_button(popup_upload_button_local);
          disable_button(popup_upload_button_url);
          popup_upload_button_local.innerHTML = "Upload";
          popup_upload_button_url.innerText = "Upload";
        }
      });
    });
  };

  popup_upload_button_local.addEventListener("click", start_upload);
  popup_upload_button_url.addEventListener("click", start_upload);

  const sort_table = (sortIndex, getValue, getNameValue) => {
    const sort_order = sort_states[sortIndex] === "asc" ? -1 : 1;
  
    rows_of_providers.sort((rowA, rowB) => {
      const valueA = sortIndex === 0 ? getNameValue(rowA.cells[sortIndex]) : getValue(rowA.cells[sortIndex]);
      const valueB = sortIndex === 0 ? getNameValue(rowB.cells[sortIndex]) : getValue(rowB.cells[sortIndex]);
  
      if (valueA === "depends" && valueB !== "depends") {
        return 1;
      } else if (valueB === "depends" && valueA !== "depends") {
        return -1;
      }
  
      if (sortIndex === 0) {
        return sort_order * (valueA.localeCompare(valueB));
      } else {
        return sort_order * (valueB - valueA);
      }
    });
  
    tbody_of_providers.innerHTML = "";
    rows_of_providers.forEach((row, index) => {
      const original_class = index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
      row.classList.remove("bg-slate-800", "bg-gray-900");
      row.classList.add(original_class, "alternate-row");
      tbody_of_providers.appendChild(row);
    });
  
    sort_states[sortIndex] = sort_states[sortIndex] === "asc" ? "desc" : "asc";
  };

  const get_name_value = (cell) => {
    return cell.textContent.trim().toLowerCase();
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
    if (text.includes("depends on the file size")) return "depends";
  
    const has_days = text.includes("days");
    const time = parseFloat(has_days ? text.replace(" days", "") : text);
  
    return has_days ? time * 24 * 60 : time;
  };

  const original_order = Array.from(rows_of_providers);

  const reset_table_order = () => {
    tbody_of_providers.innerHTML = "";
    
    original_order.forEach((row, index) => {
      const original_class = index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
      row.classList.remove("bg-slate-800", "bg-gray-900");
      row.classList.add(original_class, "alternate-row");
      tbody_of_providers.appendChild(row);
    });
  
    sort_states.fill(null);
  };
  

  let alpahbetic_order = 0;
  let file_size_order = 0;
  let expire_order = 0;

  document.getElementById("name_header").addEventListener("click", () => {
    sort_table(0, null, get_name_value);

    if (alpahbetic_order == 0) {
      document.getElementById("name_header").innerHTML = `Name <i class="fa-solid fa-arrow-down-a-z"></i><i id="name_order_reset" class="ml-5 fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
      alpahbetic_order = 1;
    } else {
      document.getElementById("name_header").innerHTML = `Name <i class="fa-solid fa-arrow-down-z-a"></i><i id="name_order_reset" class="ml-5 fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
      alpahbetic_order = 0;
    }

    document.getElementById("name_order_reset").addEventListener("click", (event) => {
      event.stopPropagation(); 
      reset_table_order();
      document.getElementById("name_header").innerHTML = `Name <i class="fa-solid fa-arrow-down-a-z"></i>`;
      document.getElementById("max_file_size_header").innerHTML = `Max file size <i class="fa-solid fa-arrow-down-wide-short"></i>`;
      document.getElementById("expire_header").innerHTML = `Expire in <i class="fa-solid fa-arrow-down-wide-short"></i>`;
    })
  });

  document.getElementById("max_file_size_header").addEventListener("click", () => {
    sort_table(1, get_max_size_file_value)

    if (file_size_order == 0) {
      document.getElementById("max_file_size_header").innerHTML = `Max file size <i class="fa-solid fa-arrow-down-wide-short"></i><i id="max_file_size_order_reset" class="ml-5 fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
      file_size_order = 1;
    } else {
      document.getElementById("max_file_size_header").innerHTML = `Max file size <i class="fa-solid fa-arrow-down-short-wide"></i><i id="max_file_size_order_reset" class="ml-5 fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
      file_size_order = 0;
    }

    document.getElementById("max_file_size_order_reset").addEventListener("click", (event) => {
      event.stopPropagation(); 
      reset_table_order();
      document.getElementById("name_header").innerHTML = `Name <i class="fa-solid fa-arrow-down-a-z"></i>`;
      document.getElementById("max_file_size_header").innerHTML = `Max file size <i class="fa-solid fa-arrow-down-wide-short"></i>`;
      document.getElementById("expire_header").innerHTML = `Expire in <i class="fa-solid fa-arrow-down-wide-short"></i>`;
    })
  });

  document.getElementById("expire_header").addEventListener("click", () => {
    sort_table(2, get_expire_value)

    if (expire_order == 0) {
      document.getElementById("expire_header").innerHTML = `Expire in <i class="fa-solid fa-arrow-down-wide-short"></i><i id="expire_order_reset" class="ml-5 fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
      expire_order = 1;
    } else {
      document.getElementById("expire_header").innerHTML = `Expire in <i class="fa-solid fa-arrow-down-short-wide"></i><i id="expire_order_reset" class="ml-5 fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
      expire_order = 0;
    }

    document.getElementById("expire_order_reset").addEventListener("click", (event) => {
      event.stopPropagation(); 
      reset_table_order();
      document.getElementById("name_header").innerHTML = `Name <i class="fa-solid fa-arrow-down-a-z"></i>`;
      document.getElementById("max_file_size_header").innerHTML = `Max file size <i class="fa-solid fa-arrow-down-wide-short"></i>`;
      document.getElementById("expire_header").innerHTML = `Expire in <i class="fa-solid fa-arrow-down-wide-short"></i>`;
    })
  });

  const search_input = document.getElementById("search_input");

  search_input.addEventListener("input", () => {
    if (search_input.value == "") {
      search_icon.classList.remove("hidden");
    } else {
      search_icon.classList.add("hidden");
    }

    const search_term = search_input.value.toLowerCase();

    rows_of_providers.forEach((row) => {
      const providerName = row.cells[0].textContent.toLowerCase();
      const isSearchResult = providerName.includes(search_term);

      if (isSearchResult) {
        row.classList.add("search-result");
        row.classList.remove("cursor-not-allowed", "pointer-events-none", "bg-indigo-900", "blur-[3.5px]");
      } else {
        row.classList.remove("search-result");
        row.classList.add("cursor-not-allowed", "pointer-events-none", "bg-indigo-900", "blur-[3.5px]");
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
      const original_class = index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
      row.classList.remove("bg-slate-800", "bg-gray-900");
      row.classList.add(original_class, "alternate-row");
      tbody_of_providers.appendChild(row);
    });
  });
});

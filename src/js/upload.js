import { invoke, convertFileSrc } from './tauri.js';
import { ENV, BUTTONS, ELEMENT_DISPLAYS, INPUTS, STATE, URL_FOR_BYPASS_CORS, SELECTS, HOST_SITES, API_URL } from './globals.js';
import { disabled_upload_button, get_resource_path, get_file_name_from_url, copy_to_clipboard, disable_button, get_site_name, get_value_from_path, get_values_from_paths, resolve_value, get_domain_name, get_retention_duration, enable_upload_button } from './utils.js';

function anonymize_urls(text) {
  return text
    .split(/\r?\n/)
    .map(line => {
      try {
        const url = new URL(line.trim());
        return url.hostname;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
};

function upload_to_host(request_data, response_format, link_extraction = [], affix = [], manage_file = []) {
    disabled_upload_button();
  
    const request_options = {
      method: request_data[1],
      body: request_data[2],
      signal: STATE.signal,
      credentials: 'omit'
    };
  
    if (request_data[3]) {
      request_options.headers = {...request_options.headers, ...request_data[3]};
    };
  
    const domain = new URL(request_data[0]).hostname;
    const stored_cookie = localStorage.getItem(`cookie:${domain}`);
    if (stored_cookie) {
        request_options.headers['Cookie'] = stored_cookie;
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
          };
        };
      })
  
      .then((data) => {
        let final_url = null;
        let delete_url = "";
        let delete_method = "";
        let delete_data = {};
        let delete_url_core = "";
        let url_delete_prefix = "";
        let delete_headers = {};
        let formatted_delete_request = "formatted";
  
        const url_prefix = (affix[0] ? affix[0] : "");
        const url_suffix = (affix[1] ? affix[1] : "");
  
        let url_cores = "";
        
        try {
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
        } catch (error) {
          display_final_url(["Unable to retrieve the download link", get_site_name(request_data[0])]);
          return;
        }

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
                };
                
                let promise = fetch(URL_FOR_BYPASS_CORS + manage_file[2][key][2] + file_id, { method: "GET" })
                .then((response) => response.text())
                .then((html_response) => {
                  const killcode_url = html_response.match(manage_file[2][key][1])[0];
                  const killcode = killcode_url.match(/killcode=([^&]+)/)[1];
                  delete_data[key] = killcode;

                  if (delete_data["token"]) {
                    return fetch(URL_FOR_BYPASS_CORS + killcode_url, { method: "GET" })
                    .then((response) => response.text())
                    .then((html_response) => {
                      const token_match = html_response.match(/<input type="hidden" name="token" value="([^"]+)">/);
                      if (token_match) {
                        delete_data["token"] = token_match[1];
                      };

                      const rand_match = html_response.match(/<input type="hidden" name="rand" value="([^"]+)">/);
                      if (rand_match) {
                        delete_data["rand"] = rand_match[1];
                      };

                      if (delete_data["code"]) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html_response, "text/html");

                        const target_div = doc.querySelector('td[align="right"] > div');

                        if (!target_div) {
                          return;
                        };

                        const spans = target_div.querySelectorAll('span');
                        const digits = [];

                        spans.forEach(span => {
                          const style = span.getAttribute("style");
                          const match = style.match(/padding-left:(\d+)px/);
                          if (match) {
                            digits.push({
                              left: parseInt(match[1]),
                              value: span.textContent.trim()
                            });
                          };
                        });

                        digits.sort((a, b) => a.left - b.left);

                        const code = digits.map(d => d.value).join('');
                        delete_data["code"] = code;
                      };
                    });
                  };
                });
                      
                promises.push(promise);
  
              } else {
                delete_data[key] = resolve_value(manage_file[2][key], data);
              };
            };
        
            Promise.all(promises).then(() => {
              resolve(delete_data);
            });
          } else {
            resolve(delete_data);
          };
        });
  
        if (manage_file[4]) {
          delete_headers = manage_file[4];
        };

        if (manage_file[5]) {
          formatted_delete_request = manage_file[5];
        };
  
        if (final_url) {
          if (Array.isArray(final_url)) {
            final_url = final_url.join("");
          };
  
          if (final_url.endsWith("\n")) {
            final_url = final_url.slice(0, final_url.length - "\n".length);
          };
  
          const new_upload_date = new Date().toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true}).replace(",", "");
  
          const host_index = STATE.host.findIndex(item => item.includes(get_domain_name(final_url)));
  
          const retention_duration = get_retention_duration(STATE.host[host_index]);
          
          const new_upload_date_formatted = new Date(new_upload_date);
  
          let new_expiration_date = "";
  
          if (retention_duration.endsWith("days")) {
            new_upload_date_formatted.setDate(new_upload_date_formatted.getDate() + parseInt(retention_duration.slice(0, -1)));
            new_expiration_date = new_upload_date_formatted.toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true}).replace(",", "");
  
          } else if (retention_duration.endsWith("hours") || retention_duration.endsWith("hour")) {
            new_upload_date_formatted.setHours(new_upload_date_formatted.getHours() + parseInt(retention_duration.slice(0, -1)));
            new_expiration_date = new_upload_date_formatted.toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true,}).replace(",", "");
            
          } else if (retention_duration === "infinite") {
            new_expiration_date = "Infinite";
  
          } else if (retention_duration.startsWith("depends on the file size")) {
            new_expiration_date = "Depends on the file size";
          }
  
          delete_data_promise.then((delete_data) => {
            invoke("add_history_json", {newLink: final_url, newUploadDate: new_upload_date, newExpirationDate: new_expiration_date, manageLink: delete_url, deleteMethod: delete_method, deleteParameters: JSON.stringify(delete_data), deleteHeaders: JSON.stringify(delete_headers), formattedRequest: formatted_delete_request, uploadFilename: STATE.file_to_upload_name});
            BUTTONS.upload_history.classList.remove("opacity-50", "cursor-not-allowed", "pointer-events-none", "hidden");
          });
  
          display_final_url([final_url, get_site_name(request_data[0])]);
        } else {
          display_final_url(["Unable to retrieve the download link", get_site_name(request_data[0])]);
        };
      })
  
    .catch((error) => {
      if (error.message.includes("Failed to fetch")) {
        display_final_url(["Unable to process request", get_site_name(request_data[0])]);
      } else if (error.message.includes("Unexpected token")) {
        display_final_url(["No link returned by the host", get_site_name(request_data[0])]);
      } else {
        display_final_url([error, get_site_name(request_data[0])]);
      };
    });
};

async function display_final_url(result) {
  ELEMENT_DISPLAYS.final_upload_url.classList.remove("hidden");
  SELECTS.profile_menu.classList.remove("pointer-events-none", "opacity-50");

  if (STATE.link_receive == 0) {
    ELEMENT_DISPLAYS.final_upload_url.innerHTML = '';
  }
  let all_links_copy = "";

  STATE.link_receive++;
  ELEMENT_DISPLAYS.filename_url_info.classList.add("hidden");

  const link_to_receive = STATE.host.length;

  const indication_of_host = document.getElementsByClassName("indication_of_host")[0];

  if (indication_of_host) {
    indication_of_host.classList.add("hidden");
  }

  if (String(result[0]).includes('File format not supported by host')) {
    const final_url = document.createElement("div");
    final_url.innerHTML = '<i class="fa-sharp fa-solid fa-circle-exclamation ml-2" style="color: #ffae00;"></i> <span style="color: #ffae00;"> <strong>' + result[1] + '</strong> </span> - File format is not allowed by the host.';
    
    const final_url_container = document.createElement("div");
    final_url_container.style.display = "block";
    final_url_container.appendChild(final_url);

    ELEMENT_DISPLAYS.final_upload_url.appendChild(final_url_container);

  } else if (String(result[0]).includes('Insufficient storage space')) {
    const final_url = document.createElement("div");
    final_url.innerHTML = '<i class="fa-sharp fa-solid fa-circle-exclamation ml-2" style="color: #ffae00;"></i> <span style="color: #ffae00;"> <strong>' + result[1] + '</strong> </span> - Insufficient storage space.';

    const final_url_container = document.createElement("div");
    final_url_container.style.display = "block";
    final_url_container.appendChild(final_url);

    ELEMENT_DISPLAYS.final_upload_url.appendChild(final_url_container);

  } else if (String(result).includes("undefined") || String(result).includes("undef")) {
    const final_url = document.createElement("div");
    final_url.innerHTML = '<i class="fa-sharp fa-solid fa-circle-exclamation ml-2" style="color: #ffae00;"></i> <span style="color: #ffae00;"> <strong>' + result[1] + '</strong> </span> - No link returned by the host';

    const final_url_container = document.createElement("div");
    final_url_container.style.display = "block";
    final_url_container.appendChild(final_url);

    ELEMENT_DISPLAYS.final_upload_url.appendChild(final_url_container);

  } else if (String(result).includes("https://") || String(result).includes("http://")) {
    const final_url = document.createElement("a");
    final_url.href = result;
    final_url.textContent = result;

    const final_url_container = document.createElement("div");
    final_url_container.href = "#";
    final_url_container.style.display = "block";
    final_url_container.innerHTML = `<a href="${result[0]}" target="_blank" class="hover:underline transition duration-20">${result[0]}</a><button id="copy_button" class="ml-2 transition active:scale-125" alt="Copy link" final_link_to_copy="${result[0]}"><i class="fa-sharp-duotone fa-solid fa-copy"></i></button>`;

    ELEMENT_DISPLAYS.final_upload_url.appendChild(final_url_container);

    const copy_buttons = document.querySelectorAll("[id='copy_button']");
    copy_buttons.forEach((button) => {
      button.addEventListener("click", function () {
        copy_to_clipboard(button.getAttribute("final_link_to_copy"));
      });
    });

  } else {
    const final_url = document.createElement("div");
    if (!result[1]) {
      result[1] = "Unknown host"
    }
    final_url.innerHTML = '<i class="fa-sharp fa-solid fa-circle-exclamation ml-2" style="color: #ffae00;"></i> <span style="color: #ffae00;"> <strong>' + result[1] + '</strong> </span> - ' + result[0];

    const final_url_container = document.createElement("a");
    final_url_container.style.display = "block";
    final_url_container.appendChild(final_url);

    ELEMENT_DISPLAYS.final_upload_url.appendChild(final_url_container);
  }

  if (STATE.upload_mode == "local") {
    BUTTONS.popup_upload_local.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-spinner fa-spin-pulse mr-1"></i> Uploading... (' + STATE.link_receive + '/' + link_to_receive + ')';
    BUTTONS.popup_upload_local.classList.add("animate-pulse");
  } else if (STATE.upload_mode == "url") {
    BUTTONS.popup_upload_url.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-spinner fa-spin-pulse mr-1"></i> Uploading... (' + STATE.link_receive + '/' + link_to_receive + ')';
    BUTTONS.popup_upload_url.classList.add("animate-pulse");
  }

  if (STATE.link_receive === link_to_receive) {
    enable_upload_button();
    BUTTONS.upload_local_file.style.pointerEvents = "";
    BUTTONS.upload_local_file.classList.remove("opacity-50");
    BUTTONS.upload_from_url.style.pointerEvents = "";
    BUTTONS.upload_from_url.classList.remove("opacity-50");
    BUTTONS.popup_upload_local.classList.remove("animate-pulse");
    BUTTONS.popup_upload_url.classList.remove("animate-pulse");

    BUTTONS.popup_browse.classList.remove("opacity-50", "cursor-not-allowed");
    BUTTONS.popup_browse.removeAttribute("disabled", "");
    BUTTONS.popup_browse.classList.add("hover:scale-[1.01]", "hover:from-indigo-500", "hover:to-[#7072ee]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.3)]", "active:scale-[1.03]");
    BUTTONS.delete_file_input.classList.remove("opacity-50", "cursor-not-allowed");
    BUTTONS.delete_file_input.removeAttribute("disabled", "");
    BUTTONS.delete_file_input.classList.add("active:scale-125")

    STATE.link_receive = 0;

    const all_links_to_copy = document.querySelectorAll("button[final_link_to_copy]");
      let current_link_index = 1;

      all_links_to_copy.forEach(function (link_button) {
        const link = link_button.getAttribute("final_link_to_copy");

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
      copy_all_button.innerHTML = `<button id="copy_all_button" class="mt-5 transition duration-200 hover:scale-[1.02] active:scale-[1.05] hover:underline">Copy all links <i class="fa-sharp-duotone fa-solid fa-clipboard-medical"></i></button><br>`;
      share_link_button.innerHTML = `<button id="share_link_button" class="mt-1 transition duration-200 hover:scale-[1.02] active:scale-[1.05] hover:underline">Create a share link <i class="fa-sharp-duotone fa-solid fa-up-right-from-square"></i></button>`;

      ELEMENT_DISPLAYS.final_upload_url.appendChild(copy_all_button);
      ELEMENT_DISPLAYS.final_upload_url.appendChild(share_link_button);

      let share_link_created = 0;

      document.getElementById("copy_all_button").addEventListener("click", function () {
        copy_to_clipboard(all_links_copy);
      });

      document.getElementById("share_link_button").addEventListener("click", async function () {
        if (share_link_created == 0) {
          document.getElementById("share_link_button").innerHTML = `Create a share link <i class="fa-sharp-duotone fa-solid fa-spinner fa-spin-pulse mr-1"></i>`;
          document.getElementById("share_link_button").classList.remove("hover:scale-[1.02]", "active:scale-[1.05]", "hover:underline");
          document.getElementById("share_link_button").classList.add("pointer-events-none");

          const upload_date = new Date().toISOString();
          
          try {
            const res = await fetch(URL_FOR_BYPASS_CORS + API_URL + "/api/bins", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                title: STATE.file_to_upload_name,
                upload_date: upload_date,
                links: all_links_copy
              })
            });
            const data = await res.json();

            const share_link = data.data.url;
            copy_to_clipboard(share_link);
            share_link_created = 1;
            const id_bin = data.data.id;
            const token_bin = data.data.token;
            document.getElementById("share_link_button").classList.remove("pointer-events-none");
            document.getElementById("share_link_button").innerHTML = `<button id="share_link_button" class="mt-1 transition duration-200 hover:underline">Copy a share link <i class="fa-sharp fa-solid fa-check"></i></button>`;
            setTimeout(function() {
              document.getElementById("share_link_button").innerHTML = `<a id="share_link_button_link" class="mt-1 transition duration-200 hover:underline" href="${share_link}" target="_blank">${share_link}</a><button id="copy_button_share_link" class="ml-2 transition active:scale-125" alt="Copy link"><i class="fa-sharp-duotone fa-solid fa-copy"></i></button>`;

              document.getElementById("copy_button_share_link").addEventListener("click", function() {
                copy_to_clipboard(share_link);
              }) 
            }, 500);
            const beauty_date = new Date(upload_date).toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true}).replace(",", "");
            invoke("add_history_json", {newLink: share_link, newUploadDate: beauty_date, newExpirationDate: "Infinite", manageLink: API_URL + "/api/bins", deleteMethod: "DELETE", deleteParameters: JSON.stringify({"id": id_bin, "token": token_bin}), deleteHeaders: JSON.stringify({}), formattedRequest: "formatted", uploadFilename: STATE.file_to_upload_name});
          } catch (error) {
            console.error(error)
            document.getElementById("share_link_button").innerHTML = `An error has occurred (try again)`;
            document.getElementById("share_link_button").classList.add("hover:scale-[1.02]", "active:scale-[1.05]", "hover:underline");
            document.getElementById("share_link_button").classList.remove("pointer-events-none");
            setTimeout(function() {
              document.getElementById("share_link_button").innerHTML = `Create a share link <i class="fa-sharp-duotone fa-solid fa-up-right-from-square"></i></button>`;
            }, 2000);
          };
        };
      });
    };

    if (all_links_copy.length > 0 && ENV === "production") {
      const upload_date = new Date().toISOString();
      const anonymized_links = anonymize_urls(all_links_copy);

      await fetch(URL_FOR_BYPASS_CORS + API_URL + "/api/telemetry/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          upload_date: upload_date,
          anonymized_links: anonymized_links
        })
      });
    };
  };
};

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
        };
      } catch (error) {
        reject(error);
      };
    };

    reader.onerror = function (error) {
      reject(error);
    };

    const slice = file.slice(offset, offset + chunk_size);
    reader.readAsArrayBuffer(slice);
  });
};

async function get_prefix_url_server(url, regex, regex_number) {
  if (STATE.upload_mode == "local") {
    BUTTONS.popup_upload_local.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-spinner fa-spin-pulse mr-1"></i> Uploading...';
    BUTTONS.popup_upload_local.classList.add("animate-pulse");
  } else if (STATE.upload_mode == "url") {
    BUTTONS.popup_upload_url.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-spinner fa-spin-pulse mr-1"></i> Uploading...';
    BUTTONS.popup_upload_url.classList.add("animate-pulse");
  };

  try {
      const response = await fetch(URL_FOR_BYPASS_CORS + url);
      
      if (response.ok) {
        const data = await response.text();
        const server_url = data.match(regex)[regex_number];
        return "https://" + server_url;
      } else {
        return;
      }
  } catch (error) {
    console.error("Error retrieving upload server:", error);
  };
};

async function get_cookie_from_url(url) {
  const response = await fetch(URL_FOR_BYPASS_CORS + url, { credentials: 'omit' });
  const cookie_header = response.headers.get('x-set-cookie');
  if (!cookie_header) return null;

  const domain = new URL(url).hostname;
  localStorage.removeItem(`cookie:${domain}`);
  localStorage.setItem(`cookie:${domain}`, cookie_header);
}

function generate_uuid_v4() {
  return crypto.randomUUID();
}

export async function get_api_key(host) {
  let api_key = "";

  try {
    const result = await get_resource_path();
    const response = await fetch(convertFileSrc(result + "/api_keys.json"));
    const data = await response.json();

    api_key = data[host];
    
  } catch (error) {
    console.error("Error retrieving path to local application data: " + error);
  };

  return api_key;
};

function generate_sid(length = 12) {
  let sid = '';
  for (let i = 0; i < length; i++) {
    sid += Math.floor(Math.random() * 10).toString();
  }
  return sid;
};

export async function start_upload(event) {
    event.preventDefault();

    SELECTS.profile_menu.classList.add("pointer-events-none", "opacity-50");
  
    if (STATE.upload_mode == "local") {
  
      if (STATE.is_drag_file === false) {
        STATE.file_to_upload = INPUTS.popup_file.files[0];
        STATE.file_to_upload_name = INPUTS.popup_file.files[0].name;
        STATE.file_to_upload_size = INPUTS.popup_file.files[0].size;
      } else {
        STATE.file_to_upload = STATE.drag_file;
        STATE.file_to_upload_name = STATE.drag_file_name;
        STATE.file_to_upload_size = STATE.drag_file_size;
      };

      if (STATE.file_to_upload_size > 0) {
        BUTTONS.popup_upload_local.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-spinner fa-spin-pulse mr-1"></i> Uploading...';
        BUTTONS.popup_upload_local.classList.add("animate-pulse");
      };
    } else if (STATE.upload_mode == "url") {
      BUTTONS.popup_upload_url.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-spinner fa-spin-pulse mr-1"></i> Upload initialisation...';
      BUTTONS.popup_upload_url.classList.add("animate-pulse");
      disable_button(BUTTONS.popup_upload_url);

      try {
        const response = await fetch(URL_FOR_BYPASS_CORS + INPUTS.url_upload.value, { signal: STATE.signal });

        if (!response.ok) {
          throw new Error("Failed to fetch file. HTTP status code: " + response.status);
        }

        const content_length = response.headers.get('content-length');
        const total = content_length ? parseInt(content_length, 10) : 0;

        const reader = response.body.getReader();
        const chunks = [];
        let loaded = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          if (total > 0) {
            loaded += value.length;
            const percent = Math.round((loaded / total) * 100);
            BUTTONS.popup_upload_url.innerHTML = `<i class="fa-sharp-duotone fa-solid fa-spinner fa-spin-pulse mr-1"></i> Upload initialisation (${percent}%)...`;
          };
        };

        const blob = new Blob(chunks);
        STATE.file_to_upload_name = get_file_name_from_url(INPUTS.url_upload.value);

        if (STATE.file_to_upload_name) {
          STATE.file_to_upload = new File([blob], STATE.file_to_upload_name, { type: blob.type });
          STATE.file_to_upload_size = STATE.file_to_upload.size;
        } else {
          ELEMENT_DISPLAYS.final_upload_url.innerHTML = `<i class="fa-sharp fa-solid fa-circle-exclamation ml-2" style="color: #ffae00;"></i> <span style="color: #ffae00;"> <strong>Error:</strong> </span> Unable to retrieve file name from provided URL.`;
          STATE.file_to_upload = "";
        };

      } catch (error) {
        display_final_url(["Unable to retrieve file from provided URL", "Error"]);
        BUTTONS.popup_upload_url.innerText = "Upload";
        console.error("Error:", error);
      };
    };
  
    STATE.host.forEach(function (current_host) {
      const sent_data_form = new FormData();
  
      if (STATE.file_to_upload_size > 0) {
          disabled_upload_button();
          BUTTONS.upload_local_file.style.pointerEvents = "none";
          BUTTONS.upload_local_file.classList.add("opacity-50");
          BUTTONS.upload_from_url.style.pointerEvents = "none";
          BUTTONS.upload_from_url.classList.add("opacity-50");
        
          BUTTONS.popup_browse.classList.add("opacity-50", "cursor-not-allowed");
          BUTTONS.popup_browse.setAttribute("disabled", "");
          BUTTONS.popup_browse.classList.remove("hover:scale-105", "hover:scale-[1.01]", "hover:from-indigo-500", "hover:from-indigo-600", "hover:to-[#7072ee]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.3)]", "hover:shadow-[0_0px_20px_rgba(99,_102,_241,_0.2)]", "active:scale-110", "active:scale-[1.03]");
          BUTTONS.delete_file_input.classList.add("opacity-50", "cursor-not-allowed");
          BUTTONS.delete_file_input.setAttribute("disabled", "");
          BUTTONS.delete_file_input.classList.remove("active:scale-125");
        } else {
          return;
        }

        if (STATE.file_to_upload) {
          const host_name = (HOST_SITES.find(site => site.discriminator === current_host)).name;
          switch (current_host) {
            case "gofile.io":
              (async () => {
                const api_key_host = await get_api_key(current_host);

                const headers = api_key_host ? { "Authorization": "Bearer " + api_key_host } : {};

                sent_data_form.append("file", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + "https://upload.gofile.io/uploadfile", "POST", sent_data_form, headers], "json", ["data", "downloadPage"], [], api_key_host ? ["https://api.gofile.io/contents", "DELETE", {"contentsId": ["data", "parentFolder"]}, [], headers] : ["https://api.gofile.io/contents", "DELETE", {"contentsId": ["data", "parentFolder"], "token": ["data", "guestToken"]}]);
              })();
              break;

            case "litter.catbox.moe":
              sent_data_form.append("reqtype", "fileupload");
              sent_data_form.append("time", "24h");
              sent_data_form.append("fileToUpload", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://litterbox.catbox.moe/resources/internals/api.php", "POST", sent_data_form], "text");
              break;

            case "tmpfiles.org":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://tmpfiles.org/");
                  const data = await res.text();
                  const tmpfiles_token = data.match(/<input type="hidden" name="_token" value="([a-zA-Z0-9]+)">/)[1];

                  await get_cookie_from_url("https://tmpfiles.org/");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("_token", tmpfiles_token);
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://tmpfiles.org/", "POST", sent_data_form], "text", ["match", /href="(http:\/\/tmpfiles\.org\/dl\/\d+\/[^"]+)"/, 1]);
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                };
              })();
              
              break;

            case "c-v.sh":
              (async () => {
                try {
                  sent_data_form.append("a", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://c-v.sh/", "POST", sent_data_form], "text", ["match", /https:\/\/c-v\.sh\/[^\s]+/, 0], [], [["match", /(\b\w+\b)$/], "DELETE", {}, [["final_url" + "?token="]]]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                }
              })();
              break;

            case "ki.tc":
              sent_data_form.append("file", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://ki.tc/file/u/", "POST", sent_data_form], "json", ["file", "download_page"]);
              break;

            case "oshi.at":
              sent_data_form.append("f", STATE.file_to_upload);
              sent_data_form.append("expire", "120");
              upload_to_host([URL_FOR_BYPASS_CORS + "https://oshi.at/", "POST", sent_data_form], "text", ["match", /(?<=DL: )\S+/, 0], [], [["match", /(?<=MANAGE: )\S+/], "GET", {}, ["", "?delete=1"]]);
              break;

            case "filebin.net":
              const bin = (Math.random() + 1).toString(36).substring(2, 12);
              const filename = (Math.random() + 1).toString(36).substring(2, 12);
              const url_filebin = "https://filebin.net/" + bin + "/" + filename;
              upload_to_host([URL_FOR_BYPASS_CORS + url_filebin, "POST", STATE.file_to_upload], "json", [url_filebin], [], [url_filebin, "DELETE"]);
              break;

            case "bashupload.com":
              sent_data_form.append("file_1", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://bashupload.com/", "POST", sent_data_form], "text", ["match", /https:\/\/bashupload\.com\/\S+/, 0]);
              break;

            case "curl.by":
              sent_data_form.append("file_3", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://curl.by/", "POST", sent_data_form], "text", ["match", /https:\/\/curl\.by\/\S+/, 0]);
              break;

            case "x0.at":
              sent_data_form.append("file", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://x0.at/", "POST", sent_data_form], "text");
              break;

            case "tommo.team":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://www.tommo.team/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);
              break;

            case "tempfiles.ninja":
              upload_to_host([URL_FOR_BYPASS_CORS + "https://tempfiles.ninja/api/upload?filename=" + STATE.file_to_upload_name, "POST", STATE.file_to_upload], "json", ["download_url"], [], [[["id"], ["delete_password"], "/"], "DELETE", {}, ["https://tempfiles.ninja/api/delete/"]]);
              break;

            case "pixeldrain.com":
              (async () => {
                const api_key_host = await get_api_key(current_host);

                upload_to_host([URL_FOR_BYPASS_CORS + "https://pixeldrain.com/api/file/" + STATE.file_to_upload_name, "PUT", STATE.file_to_upload, {"Authorization": "Basic "+btoa(":" + api_key_host)}], "json", ["id"], ["https://pixeldrain.com/u/"], [[["id"], ""], "DELETE", {}, ["https://pixeldrain.com/api/file/"], {"Authorization": "Basic "+btoa(":" + api_key_host)}]);
              })();
              break;
              
            case "1cloudfile.com":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://1cloudfile.com/assets/js/uploader.js", /https:\/\/([a-zA-Z0-9]+)\.1cloudfile\.com/, 1);
                sent_data_form.append("files[]", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".1cloudfile.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
              })();
              break;

            case "bowfile.com":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://bowfile.com/assets/js/uploader.js", /https:\/\/([a-zA-Z0-9]+)\.bowfile\.com/, 1);
                sent_data_form.append("files[]", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".bowfile.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
              })();
              break;

            case "uploadify.net":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://uploadify.net/core/page/ajax/file_upload_handler.ajax.php", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"delete": "1", "submitme": "1", "returnAccount": "0", "submit": ""}]);
              break;

            case "anontransfer.com":
              (async () => {
                await get_cookie_from_url("https://anontransfer.com/");
                const dzuuid = generate_uuid_v4();
                const groupid = generate_uuid_v4();

                sent_data_form.append("file", STATE.file_to_upload);
                sent_data_form.append("dzuuid", dzuuid);
                sent_data_form.append("dzchunkindex", "0");
                sent_data_form.append("dztotalfilesize", STATE.file_to_upload_size);
                sent_data_form.append("dzchunksize", "52428800");
                sent_data_form.append("dztotalchunkcount", "1");
                sent_data_form.append("dzchunkbyteoffset", "0");
                sent_data_form.append("groupId", groupid);
                upload_to_host([URL_FOR_BYPASS_CORS + "https://anontransfer.com/anonymous_upload_handler.php", "POST", sent_data_form], "json", ["uri"]);
              })();
              break;

            case "temp.sh":
              sent_data_form.append("file", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://temp.sh/upload", "POST", sent_data_form], "text");
              break;

            case "uguu.se":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://uguu.se/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);
              break;

            case "nopaste.net":
              upload_to_host([URL_FOR_BYPASS_CORS + "https://nopaste.net/", "PUT", STATE.file_to_upload], "text", ["match", /https:\/\/nopaste\.net\/([A-Za-z0-9]+)/, 0]);
              break;

            case "udrop.com":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://www.udrop.com/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
              break;

            case "tempsend.com":
              sent_data_form.append("file", STATE.file_to_upload);
              sent_data_form.append("expire", "604800");
              upload_to_host([URL_FOR_BYPASS_CORS + "https://tempsend.com/send", "POST", sent_data_form], "text", ["match", /https:\/\/tempsend\.com\/([A-Za-z0-9]+)/, 0]);
              break;

            case "1fichier.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  const headers = api_key_host ? { "Authorization": "Bearer " + api_key_host } : {};

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://api.1fichier.com/v1/upload/get_upload_server.cgi", {method: "POST", headers: {"Content-Type": "application/json", "X-Requested-With": "*"}, signal: STATE.signal});
                  const data = await res.json();
                  const url_upload = data.url;
                  const id_upload = data.id;

                  sent_data_form.append("file[]", STATE.file_to_upload);

                  await fetch(URL_FOR_BYPASS_CORS + "https://" + url_upload + "/upload.cgi?id=" + id_upload, {method: "POST", headers, body: sent_data_form, signal: STATE.signal});

                  upload_to_host([URL_FOR_BYPASS_CORS + "https://" + url_upload + "/end.pl?xid=" + id_upload, "POST", sent_data_form, { "JSON": 1 }], "json", ["links", 0, "download"], [], api_key_host ? ["https://api.1fichier.com/v1/file/rm.cgi", "POST", {"files" : [{"url" : ["links", 0, "download"]}]}, [], { "Authorization": "Bearer " + api_key_host, "Content-Type": "application/json" }, "unformatted"] : [[["links", 0, "remove"], ""], "POST", {"force": "1"}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                }
              })();
              break;

            case "torbobit.net":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  const headers = api_key_host ? { "X-API-KEY": api_key_host } : {};

                  let url_for_upload = "";

                  if (api_key_host) {
                    const res = await fetch(URL_FOR_BYPASS_CORS + "https://turbobit.net/v001/upload/http/server", { headers });
                    const data = await res.json();
                    if (!res.ok || !data.url || !data.params.upload_info) throw new Error("Invalid API key");

                    url_for_upload = data.url;
                    sent_data_form.append("upload_info", data.params.upload_info);
                  } else {
                    const prefix_url_server = await get_prefix_url_server("https://torbobit.net/?site_version=1&from_mirror=1", /https:\/\/([a-zA-Z0-9]+)\.fdfiles\.net/, 1);
                    url_for_upload = prefix_url_server + ".fdfiles.net/uploadfile";
                  }
                  sent_data_form.append("apptype", "fd1");
                  sent_data_form.append("Filedata", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + url_for_upload, "POST", sent_data_form, headers], "json", ["id"], ["https://torbobit.net/", ".html"]);

                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "hitfile.net":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  const headers = api_key_host ? { "X-API-KEY": api_key_host } : {};

                  let url_for_upload = "";

                  if (api_key_host) {
                    const res = await fetch(URL_FOR_BYPASS_CORS + "https://hitfile.net/v001/upload/http/server", { headers });
                    const data = await res.json();
                    if (!res.ok || !data.url || !data.params.upload_info) throw new Error("Invalid API key");

                    url_for_upload = data.url;
                    sent_data_form.append("upload_info", data.params.upload_info);
                  } else {
                    const prefix_url_server = await get_prefix_url_server("https://hitfile.net/?site_version=1&from_mirror=1", /https:\/\/([a-zA-Z0-9]+)\.hitfile\.net/, 1);
                    url_for_upload = prefix_url_server + ".hitfile.net/uploadfile";
                  }
                  sent_data_form.append("apptype", "fd2");
                  sent_data_form.append("Filedata", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + url_for_upload, "POST", sent_data_form], "json", ["id"], ["https://hitfile.net/"]);

                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "file-upload.org":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://file-upload.org/server");
                  const { url: upload_url } = await res.json();
                  const sid = generate_sid();

                  await fetch(URL_FOR_BYPASS_CORS + upload_url + "/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  sent_data_form.append("fname", STATE.file_to_upload_name);
                  sent_data_form.append("op", "import_file");
                  sent_data_form.append("session_id", "");
                  sent_data_form.append("sid", sid);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/api.cgi", "POST", sent_data_form], "json", ["links", "download_link"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                }
              })();
              break;

            case "hexload.com":
              sent_data_form.append("file_0", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://2749516302390866935275651.agrachimp.xyz/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://hexload.com/"], ["https://hexload.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/hexload\.com\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://hexload.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
              break;

            case "mexa.sh":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://mexa.sh/", /https:\/\/([a-zA-Z0-9]+)\.mexa\.sh/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server.replace("https", "http") + ".mexa.sh/cgi-bin/upload.cgi?upload_type=file", "POST", sent_data_form], "json", [0, "file_code"], ["https://mexa.sh/", ".html"], ["https://mexa.sh", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/mexa\.sh\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://mexa.sh/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes"}]);
              })();
              break;

            case "rapidfileshare.net":
              sent_data_form.append("file_0", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "http://trinity.rapidfileshare.net/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["http://www.rapidfileshare.net/", ".html"], ["http://www.rapidfileshare.net", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /http:\/\/www\.rapidfileshare\.net\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "http://www.rapidfileshare.net/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
              break;

            case "send.now":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://send.now/", /https:\/\/([a-zA-Z0-9]{4,})\.send\.now/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".send.now/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://send.now/"]);
              })();
              break;

            case "filetmp.com":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://filetmp.com/upload/genid?_=" + Date.now(), {method: "GET", headers: {"Content-Type": "application/json", "X-Requested-With": "*"}, signal: STATE.signal});
                  const data = await res.json();

                  const filetmp_upload_id = data.upload_id;
                  const data_filetmp_encoded = new URLSearchParams({destruct: "no", "email_to[]": "", share: "link", email_from: "", message: "", password: "", expire: "18000", upload_id: filetmp_upload_id}).toString();

                  await fetch(URL_FOR_BYPASS_CORS + "https://filetmp.com/upload/register", {method: "POST", body: data_filetmp_encoded, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest"}, signal: STATE.signal});

                  sent_data_form.append("upload_id", filetmp_upload_id);
                  sent_data_form.append("files[]", STATE.file_to_upload);
                    
                  await fetch(URL_FOR_BYPASS_CORS + "https://filetmp.com/upload", {method: "POST", body: sent_data_form, headers: {"X-Requested-With": "XMLHttpRequest"}, signal: STATE.signal});

                  upload_to_host([URL_FOR_BYPASS_CORS + "	https://filetmp.com/upload/complete", "POST", data_filetmp_encoded, {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest"}], "text", ["https://filetmp.com/" + filetmp_upload_id]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "usersdrive.com":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://usersdrive.com/", /https:\/\/([a-zA-Z0-9]+)\.userdrive\.org/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".userdrive.org/cgi-bin/upload.cgi?upload_type=file", "POST", sent_data_form], "json", [0, "file_code"], ["https://usersdrive.com/", ".html"], ["https://usersdrive.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/usersdrive\.com\/[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://usersdrive.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
              })();
              break;

            case "download.gg":
              sent_data_form.append("file[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://download.gg/server/upload5555.php", "POST", sent_data_form], "text", ["replace", "&", "_"], ["https://download.gg/file-"], ["https://download.gg/server/delete.php", "POST", {"send-id-file-delete": ["match", /^\d+/]}]);
              break;

            case "krakenfiles.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  const headers = api_key_host ? { "X-AUTH-TOKEN": api_key_host } : {};
                  let url_for_upload = "";
                  let url_extraction = [];
                  let prefix = [];
                  let manage_file = [];
                  
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://krakenfiles.com/api/server/available", {method: "GET", signal: STATE.signal});
                  const data = await res.json();
                  const url_krakenfiles_upload = data.data.url;

                  if (!url_krakenfiles_upload) throw new Error("Unable to retrieve upload server URL");

                  if (api_key_host) {
                    const server_access_token = data.data.serverAccessToken;

                    sent_data_form.append("file", STATE.file_to_upload);
                    sent_data_form.append("serverAccessToken", server_access_token);
                    url_for_upload = url_krakenfiles_upload;
                    url_extraction = ["data", "url"];
                    manage_file = [[["data", "hash"], ""], "DELETE", {}, ["https://krakenfiles.com/api/file/"], headers];
                  } else {
                    sent_data_form.append("files[]", STATE.file_to_upload);
                    url_for_upload = url_krakenfiles_upload.match(/^https:\/\/([^/]+)/)[0] + "/_uploader/gallery/upload";
                    url_extraction = ["files", "0", "url"];
                    prefix = ["https://krakenfiles.com"];
                  }

                  upload_to_host([URL_FOR_BYPASS_CORS + url_for_upload, "POST", sent_data_form, headers], "json", url_extraction, prefix, manage_file);

                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "clicknupload.click":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://clicknupload.click/", /https:\/\/([a-zA-Z0-9]+)\.clicknupload\.net/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".clicknupload.net/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://clicknupload.click/"], ["https://clicknupload.click", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/clicknupload\.click\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://clicknupload.click/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
              })();
              break;

            case "upload.ee":
              (async () => {
                try {
                  const timestamp_date = new Date().getTime();
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://www.upload.ee/ubr_link_upload.php?page=uploadsimple&rnd_id=" + timestamp_date, {method: "GET", signal: STATE.signal});
                  const data = await res.text();
                  const uploadee_upload_id = data.match(/"[A-Za-z0-9]+/)[0].slice(1);

                  sent_data_form.append("link", "");
                  sent_data_form.append("email", "");
                  sent_data_form.append("category", "cat_file");
                  sent_data_form.append("big_resize", "none");
                  sent_data_form.append("upfile_0", STATE.file_to_upload);

                  await fetch(URL_FOR_BYPASS_CORS + "https://www.upload.ee/cgi-bin/ubr_upload.pl?X-Progress-ID=" + uploadee_upload_id + "&upload_id=" + uploadee_upload_id, {method: "POST", body: sent_data_form, signal: STATE.signal});

                  const uploadee_upload_url = "https://www.upload.ee/?page=finishedsimple&upload_id=" + uploadee_upload_id;

                  const res2 = await fetch(URL_FOR_BYPASS_CORS + uploadee_upload_url, {method: "GET", signal: STATE.signal});
                  const data2 = await res2.text();

                  const uploadee_killcode_url = data2.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/[^"]+\?killcode=[A-Za-z0-9]+/)[0];
                  const uploadee_url = data2.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/.+(\.[A-Za-z0-9]+)+/)[0];

                  const res3 = await fetch(URL_FOR_BYPASS_CORS + uploadee_killcode_url, {method: "GET", signal: STATE.signal});
                  const data3 = await res3.text();

                  const uploadee_delete_url = data3.match(/https:\/\/www\.upload\.ee\/files\/[A-Za-z0-9]+\/[^"]+\?killcode=[A-Za-z0-9]+&amp;confirm=([A-Za-z0-9_\-]+)[^"]+/)[0].replace("amp;", "");
                  upload_to_host([URL_FOR_BYPASS_CORS + uploadee_upload_url, "GET"], "text", [uploadee_url], [], [uploadee_delete_url, "POST", {}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "ccu.to":
              upload_to_host([URL_FOR_BYPASS_CORS + "https://ccu.to/" + STATE.file_to_upload_name, "PUT", STATE.file_to_upload], "text");
              break;

            case "filespace.com":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://filespace.com/", /https:\/\/([a-zA-Z0-9]+)\.filespace\.com/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".filespace.com/cgi-bin/upload.cgi?js_on=1&utype=anon&upload_type=file", "POST", sent_data_form], "text", ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1], ["https://filespace.com/"], ["https://filespace.com", "POST", {"op": "del_file", "id": ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1], "del_id": ["killcode", /https:\/\/filespace\.com\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://filespace.com/?op=upload_result&st=OK&fn=", ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1]], "confirm": "yes"}]);
              })();
              break;

            case "gulf-up.com":
              (async () => {
                const api_key = await get_api_key(current_host);
                let upload_url = "";

                try {
                  if (api_key) {
                    const res = await fetch(URL_FOR_BYPASS_CORS + "https://www.gulf-up.com/api/upload/server?key=" + api_key, { method: "GET", signal: STATE.signal });
                    const { result: upload_url_core, sess_id } = await res.json();

                    if (!res.ok || !upload_url_core || !sess_id) throw new Error("Invalid API key");
                    upload_url = upload_url_core + "?upload_type=file&utype=reg";

                    sent_data_form.append("sess_id", sess_id);
                    sent_data_form.append("utype", "reg");
                  } else {
                    upload_url = "https://scdns.link/cgi-bin/upload.cgi?upload_type=file&utype=anon";
                  };

                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", [0, "file_code"], ["https://www.gulf-up.com/"], ["https://www.gulf-up.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/www\.gulf-up\.com\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://www.gulf-up.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add", "rand": "rand string to add", "code": "captcha to add"}]);
                } catch {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "cyberfile.me":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://cyberfile.me/", /https:\/\/([a-zA-Z0-9]+)\.cyberfile\.me/, 1);
                sent_data_form.append("files[]", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".cyberfile.me/ajax/file_upload_handler?r=cyberfile.me&p=https", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
              })();
              break;

            case "free.fr":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://api.scw.iliad.fr/freetransfert/v2/transfers", {method: "POST", signal: STATE.signal, headers: {"Content-Type": "application/json"}, body: JSON.stringify({availability: 7, files: [{mimetype: "application/octet-stream", path: STATE.file_to_upload_name, size: STATE.file_to_upload_size}]})});
                  const data = await res.json();

                  const delete_key = data.deleteKey;
                  const transfer_key = data.transferKey;
                  const final_free_url = "https://transfert.free.fr/" + transfer_key;

                  const res2 = await fetch(URL_FOR_BYPASS_CORS + "https://api.scw.iliad.fr/freetransfert/v2/transfers/" + transfer_key + "/chunk", {method: "GET", signal: STATE.signal});
                  const data2 = await res2.json();

                  const upload_url = data2.files[0].parts[0].url;

                  const res3 = await fetch(URL_FOR_BYPASS_CORS + upload_url, {method: "PUT", body: STATE.file_to_upload, signal: STATE.signal});
                  const etag = res3.headers.get("Etag");
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://api.scw.iliad.fr/freetransfert/v2/transfers/" + transfer_key + "/chunk", "PUT", JSON.stringify({"files": [{"path": STATE.file_to_upload_name, "parts": [{"PartNumber": 1, "ETag": etag}]}]}), {"Content-Type": "application/json"}], "text", [final_free_url], [], ["https://api.scw.iliad.fr/freetransfert/v2/transfers/" + transfer_key, "DELETE", {"deleteKey": delete_key}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "dfiles.eu":
              sent_data_form.append("files", STATE.file_to_upload);
              sent_data_form.append("format", "html5");
              sent_data_form.append("fm", "root");
              sent_data_form.append("fmh", "");
              upload_to_host([URL_FOR_BYPASS_CORS + "https://fileshare2081.dfiles.eu/upload/FS208-1u/", "POST", sent_data_form], "text", ["match", /http:\\\/\\\/depositfiles\.com\\\/files\\\/(\w+)/, 1], ["https://dfiles.eu/files/"]);
              break;

            case "tmpsend.com":
              (async () => {
                try {
                  const tmpsend_formdata = new FormData();
                  tmpsend_formdata.append("action", "add");
                  tmpsend_formdata.append("name", STATE.file_to_upload_name);
                  tmpsend_formdata.append("size", STATE.file_to_upload_size);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://tmpsend.com/upload", {method: "POST", body: tmpsend_formdata, signal: STATE.signal});
                  const { id } = await res.json();
                  sent_data_form.append("action", "upload");
                  sent_data_form.append("id", id);
                  sent_data_form.append("name", STATE.file_to_upload_name);
                  sent_data_form.append("size", STATE.file_to_upload_size);
                  sent_data_form.append("start", "0");
                  sent_data_form.append("end", STATE.file_to_upload_size);
                  sent_data_form.append("data", STATE.file_to_upload);
                  const url_tmpsend = "https://tmpsend.com/" + id;
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://tmpsend.com/upload", "POST", sent_data_form], "json", [url_tmpsend]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "ufile.io":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://ufile.io", {method: "GET", signal: STATE.signal});
                  const data = await res.text();
                  const csrf_token = data.match(/<input id="csrf_hash" type="hidden" value="([^"]+)" \/>/)[1];
                  const session_id = data.match(/<input id="session_id" type="hidden" value="([^"]+)" \/>/)[1];

                  const res2 = await fetch(URL_FOR_BYPASS_CORS + "https://ufile.io/v1/upload/select_storage", {method: "POST", body:"csrf_test_name=" + csrf_token, signal: STATE.signal});
                  const data2 = await res2.json();
                  const ufile_upload_url = data2.storageBaseUrl;

                  const res3 = await fetch(URL_FOR_BYPASS_CORS + ufile_upload_url + "v1/upload/create_session", {method: "POST",  headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body:"csrf_test_name=" + csrf_token + "&file_size=" + STATE.file_to_upload_size, signal: STATE.signal});
                  const data3 = await res3.json();
                  const ufile_fuid = data3.fuid;

                  const ufile_form_data = new FormData();
                  ufile_form_data.append("chunk_index", "1");
                  ufile_form_data.append("fuid", ufile_fuid);
                  ufile_form_data.append("file", STATE.file_to_upload);

                  await fetch(URL_FOR_BYPASS_CORS + ufile_upload_url + "v1/upload/chunk", {method: "POST", body: ufile_form_data, signal: STATE.signal});
                  const extension_file = STATE.file_to_upload_name.split(".").pop();
                  upload_to_host([URL_FOR_BYPASS_CORS + ufile_upload_url + "v1/upload/finalise", "POST", "csrf_test_name=" + csrf_token + "&fuid=" + ufile_fuid + "&file_name=" + STATE.file_to_upload_name + "&file_type=" + extension_file + "&total_chunks=1&session_id=" + session_id, {"Content-Type": "application/x-www-form-urlencoded"}], "json", ["url"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "drop.download":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://drop.download/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url, sess_id } = await res.json();

                  if (!res.ok || !upload_url || !sess_id) throw new Error("Invalid API key");

                  sent_data_form.append("sess_id", sess_id);
                  sent_data_form.append("utype", "reg");
                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://drop.download/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "filemoon.sx":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://filemoonapi.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();

                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("key", api_key_host);
                  sent_data_form.append("file", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://filemoon.sx/d/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "files.catbox.moe":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  sent_data_form.append("reqtype", "fileupload");
                  sent_data_form.append("userhash", api_key_host);
                  sent_data_form.append("fileToUpload", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://catbox.moe/user/api.php", "POST", sent_data_form], "text", [], [], ["https://catbox.moe/user/api.php", "POST", {"reqtype": "deletefiles", "userhash": api_key_host, "files": ["match", /https:\/\/files\.catbox\.moe\/([A-Za-z0-9]+(\.[A-Za-z0-9]+)*)/, 1]}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "sendvid.com":
              sent_data_form.append("video", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://sendvid.com/api/v1/videos", "POST", sent_data_form], "json", ["video", "slug"], ["https://sendvid.com/"]);
              break;

            case "upstore.net":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://upstore.net/", /https:\/\/([a-zA-Z0-9]+)\.upstore\.net/, 1);
                sent_data_form.append("file", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".upstore.net/newupload/", "POST", sent_data_form], "json", ["hash"], ["https://upstore.net/"]);
              })();
              break;

            case "ddownload.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://api-v2.ddownload.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url, sess_id } = await res.json();

                  if (!res.ok || !upload_url || !sess_id) throw new Error("Invalid API key");

                  sent_data_form.append("sess_id", sess_id);
                  sent_data_form.append("utype", "reg");
                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url.replace(/^https:/, 'http:') + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://ddownload.com/"], ["https://ddownload.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/ddownload\.com\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://ddownload.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "mp4upload.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://www.mp4upload.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url, sess_id } = await res.json();

                  if (!res.ok || !upload_url || !sess_id) throw new Error("Invalid API key");

                  sent_data_form.append("sess_id", sess_id);
                  sent_data_form.append("utype", "reg");
                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://mp4upload.com/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "waaw.ac":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const netu_form_data = new FormData();

                  if (api_key_host) {
                    const res = await fetch(URL_FOR_BYPASS_CORS + "https://netu.tv/api/file/upload_server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                    const data = await res.json();
                    if (!res.ok || !data || !data.result || !data.result.upload_server || !data.result.server_id || !data.result.hash || !data.result.time_hash || !data.result.userid || !data.result.key_hash) throw new Error("Invalid API key");

                    const netu_server_id = data.result.server_id;
                    const netu_upload_server = data.result.upload_server;
                    const netu_hash = data.result.hash;
                    const netu_time_hash = data.result.time_hash;
                    const netu_user_id = data.result.userid;
                    const netu_key_hash = data.result.key_hash;

                    netu_form_data.append("hash", netu_hash);
                    netu_form_data.append("userid", netu_user_id);
                    netu_form_data.append("key_hash", netu_key_hash);
                    netu_form_data.append("time_hash", netu_time_hash);
                    netu_form_data.append("upload", "1");
                    netu_form_data.append("Filedata", STATE.file_to_upload);

                    const upload_res = await fetch(URL_FOR_BYPASS_CORS + netu_upload_server, {method: "POST", signal: STATE.signal, body: netu_form_data});
                    const upload_data = await upload_res.json();

                    upload_to_host([URL_FOR_BYPASS_CORS + `https://netu.tv/api/file/add?key=${api_key_host}&name=${STATE.file_to_upload_name}&server=${netu_upload_server}&file_name=${upload_data.file_name}&server_id=${netu_server_id}`, "POST"], "json", ["result", "file_code"], ["https://waaw.ac/f/"]);
                  } else {
                    const res = await fetch(URL_FOR_BYPASS_CORS + "https://waaw.ac/plugins/cb_multiserver/api/get_upload_server.php?user_hash=&upload_cookie_server=", {method: "GET", signal: STATE.signal});
                    const data = await res.json();
                    const netu_server_id = data.server_id;
                    const netu_upload_server = data.upload_server;
                    const netu_hash = data.hash;
                    const netu_time_hash = data.time_hash;
                    const netu_user_id = data.userid;
                    const netu_key_hash = data.key_hash;

                    await fetch(URL_FOR_BYPASS_CORS + netu_upload_server + "?Filedata=" + STATE.file_to_upload_name, {method: "GET", signal: STATE.signal});

                    netu_form_data.append("hash", netu_hash);
                    netu_form_data.append("userid", netu_user_id);
                    netu_form_data.append("usekey_hashrid", netu_key_hash);
                    netu_form_data.append("time_hash", netu_time_hash);
                    netu_form_data.append("Filedata", STATE.file_to_upload);

                    const upload_res = await fetch(URL_FOR_BYPASS_CORS + netu_upload_server, {method: "POST", signal: STATE.signal, body: netu_form_data});
                    const upload_data = await upload_res.json();

                    sent_data_form.append("insertVideo", "yes");
                    sent_data_form.append("title", STATE.file_to_upload_name);
                    sent_data_form.append("file_name", upload_data.file_name);
                    sent_data_form.append("server", netu_upload_server);
                    sent_data_form.append("server_id", netu_server_id);

                    upload_to_host([URL_FOR_BYPASS_CORS + "https://netu.ac/actions/file_uploader.php", "POST", sent_data_form], "json", ["video_link"]);
                  };
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "dgdrive.site":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://dropgalaxy.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url, sess_id } = await res.json();

                  if (!res.ok || !upload_url || !sess_id) throw new Error("Invalid API key");

                  sent_data_form.append("sess_id", sess_id);
                  sent_data_form.append("utype", "reg");
                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://dgdrive.site/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "nitroflare.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://nitroflare.com/plugins/fileupload/getServer", {method: "GET", signal: STATE.signal});
                  const upload_url = await res.text();

                  sent_data_form.append("user", api_key_host);
                  sent_data_form.append("files", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "url"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "vidoza.net":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://api.vidoza.net/v1/upload/http/server?api_token=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const data = await res.json();
                  const upload_url = data.data.upload_url;
                  const sess_id = data.data.upload_params.sess_id;

                  if (!res.ok || !upload_url || !sess_id) throw new Error("Invalid API key");

                  sent_data_form.append("sess_id", sess_id);
                  sent_data_form.append("is_xhr", "true");
                  sent_data_form.append("file", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["code"], ["https://vidoza.net/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "katfile.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://katfile.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url, sess_id } = await res.json();

                  if (!res.ok || !upload_url || !sess_id) throw new Error("Invalid API key");

                  sent_data_form.append("sess_id", sess_id);
                  sent_data_form.append("utype", "reg");
                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://katfile.com/"], ["https://katfile.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/katfile\.com\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://katfile.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes"}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "rapidgator.net":
              (async () => {
                try {
                  const file_hash = await get_file_hash(STATE.file_to_upload);
                  const api_key_host = await get_api_key(current_host);
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://rapidgator.net/api/v2/file/upload?name=" + STATE.file_to_upload_name + "&hash=" + file_hash + "& size=" + STATE.file_to_upload_size + "&token=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const data = await res.json();

                  if (!res.ok || !data.response.upload.upload_id || !data.response.upload.url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  await fetch(URL_FOR_BYPASS_CORS + data.response.upload.url, {method: "POST", body: sent_data_form, signal: STATE.signal});

                  setTimeout(function() {
                    upload_to_host([URL_FOR_BYPASS_CORS + "https://rapidgator.net/api/v2/file/upload_info?upload_id=" + data.response.upload.upload_id + "&token=" + api_key_host, "GET"], "json", ["response", "upload", "file", "url"], [], [[["response", "upload", "file", "file_id"], api_key_host, "&token="], "GET", {}, ["https://rapidgator.net/api/v2/file/delete?file_id="]]);
                  }, 500);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                }
              })();
              break;

            case "fastupload.io":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://fastupload.io/assets/js/uploader.js", /https:\/\/([a-zA-Z0-9]+)\.fastupload\.io/, 1);
                sent_data_form.append("files[]", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".fastupload.io/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
              })();
              break;

            case "ibb.co":
              sent_data_form.append("type", "file");
              sent_data_form.append("action", "upload");
              sent_data_form.append("source", STATE.file_to_upload);
              upload_to_host(["https://imgbb.com/json", "POST", sent_data_form], "json", ["image", "url_viewer"]);
              break;

            case "buzzheavier.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  const headers = api_key_host ? { "Authorization": "Bearer " + api_key_host } : {};
                  let url_for_upload = "https://w.buzzheavier.com/";

                  if (api_key_host) {
                    const res = await fetch(URL_FOR_BYPASS_CORS + "https://buzzheavier.com/api/fs", { headers });
                    const data = await res.json();
                    if (!res.ok || !data.data.id) throw new Error("Invalid API key");

                    url_for_upload = "https://w.buzzheavier.com/" + data.data.id + "/";
                  };

                  upload_to_host([URL_FOR_BYPASS_CORS + url_for_upload + STATE.file_to_upload_name, "PUT", STATE.file_to_upload, headers], "json", ["data", "id"], ["https://buzzheavier.com/"], api_key_host ? [[["data", "id"], ""], "DELETE", {}, ["https://buzzheavier.com/api/fs/"], headers] : []);

                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "do7go.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://doodapi.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("api_key", api_key_host);
                  sent_data_form.append("file", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["result", 0, "filecode"], ["https://do7go.com/d/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "streama2z.xyz":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://streama2z.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("key", api_key_host);
                  sent_data_form.append("file", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://streama2z.xyz/"], [[api_key_host, ["files", 0, "filecode"], "&file_code="], "GET", {}, ["https://streama2z.com/api/file/delete?key="]]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "strwish.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://api.streamwish.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("key", api_key_host);
                  sent_data_form.append("file", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://strwish.com/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "rubystm.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://streamruby.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("key", api_key_host);
                  sent_data_form.append("file", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://rubystm.com/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "voe.sx":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://voe.sx/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("key", api_key_host);
                  sent_data_form.append("file", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["file", "file_code"], ["https://voe.sx/"], [[api_key_host, ["file", "file_code"], "&del_code="], "GET", {}, ["https://voe.sx/api/file/delete?key="]]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "devuploads.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://devuploads.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url, sess_id } = await res.json();
                  if (!res.ok || !upload_url || !sess_id) throw new Error("Invalid API key");

                  sent_data_form.append("sess_id", sess_id);
                  sent_data_form.append("utype", "reg");
                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "?upload_type=file&utype=reg", "POST", sent_data_form], "json", [0, "file_code"], ["https://devuploads.com/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "media.cm":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://media.cm/?op=upload_file", /https:\/\/([a-zA-Z0-9]+)\.media\.cm/, 1)
                sent_data_form.append("file", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".media.cm/upload/01", "POST", sent_data_form], "text", ["match", /<textarea name="fn">([^<]+)<\/textarea>/, 1], ["https://media.cm/"]);
              })();
              break;

            case "dailyuploads.net":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://dailyuploads.net/server");
                  const { url: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Unable to retrieve upload server URL");

                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/upload.cgi", "POST", sent_data_form], "json", [0, "file_code"], ["https://dailyuploads.net/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;  

            case "uploady.io":
              (async () => {
                const api_key = await get_api_key(current_host);
                let upload_url = "";

                try {
                  if (api_key) {
                    const res = await fetch(URL_FOR_BYPASS_CORS + "https://uploady.io/api/upload/server?key=" + api_key, { method: "GET", signal: STATE.signal });
                    const { result: upload_url_core, sess_id } = await res.json();

                    if (!res.ok || !upload_url_core || !sess_id) throw new Error("Invalid API key");
                    upload_url = upload_url_core + "?upload_type=file&utype=reg";

                    sent_data_form.append("sess_id", sess_id);
                    sent_data_form.append("utype", "reg");
                  } else {
                    const prefix_url_server = await get_prefix_url_server("https://uploady.io/?op=upload_form", /https:\/\/([a-zA-Z0-9]+)\.uploady\.download/, 1);
                    upload_url = prefix_url_server + ".uploady.download/cgi-bin/upload.cgi?upload_type=file&utype=anon";
                  };

                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", [0, "file_code"], ["https://uploady.io/"], ["https://uploady.io", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/uploady\.io\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://uploady.io/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
                } catch {
                  display_final_url([error.message, host_name]);
                }
              })();
              break;

            case "dosya.co":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://dosya.co/", /https:\/\/([a-zA-Z0-9]+)\.dosya\.co/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".dosya.co/cgi-bin/upload.cgi?&js_on=1", "POST", sent_data_form], "text", ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1], ["https://dosya.co/"], ["https://dosya.co", "POST", {"op": "del_file", "id": ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1], "del_id": ["killcode", /https:\/\/dosya\.co\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://dosya.co/?op=upload_result&st=OK&fn=", ["match", /<textarea name='fn'>([^<]+)<\/textarea>/, 1]], "confirm": "yes"}]);
              })();
              break;

            case "dbree.org":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://dbree.org/", /https:\/\/([a-zA-Z0-9]+)\.dbree\.org/, 1);
                sent_data_form.append("file[]", STATE.file_to_upload);
                sent_data_form.append("upload", "Upload");
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".zipcluster.com/upload.php", "POST", sent_data_form], "text", ["match", /<a href='([^<]+)'>/, 1]);
              })();
              break;

            case "douploads.net":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://douploads.net/", /https:\/\/([a-zA-Z0-9]+)\.douploads\.com/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".douploads.com/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://douploads.net/"], ["https://douploads.net", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/douploads\.net\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://douploads.net/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
              })();
              break;

            case "uptomega.net":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://uptomega.net/server");
                  const data = await res.json();

                  let upload_url = "https://uptomega.net";
                  if (data.url.includes("https") || data.url.includes("http")) {
                    upload_url = data.url;
                  }

                  sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + upload_url.replace("https", "http") + "/upload.cgi", "POST", sent_data_form], "json", [0, "file_code"], ["https://uptomega.net/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;   

            case "vikingfile.com":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://vikingfile.com/api/get-server");
                  const { server: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Unable to retrieve upload server URL");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("user", "");
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["url"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;   

            case "fileditchfiles.me":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://up1.fileditch.com/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);
              break;  

            case "s3k.ai":
              sent_data_form.append("file", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://up.s3k.ai/upload", "POST", sent_data_form], "json", ["url"]);
              break;  

            case "m1r.ai":
              sent_data_form.append("uploadType", "0");
              sent_data_form.append("file", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://up.m1r.ai/upload", "POST", sent_data_form], "json", ["url"]);
              break;  

            case "lurkmore.com":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://upload.lurkmore.com/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);
              break;

            case "aishiteiru.moe":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://uguu.aishiteiru.moe/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);
              break;

            case "rapidshare.io":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://rapidshare.io/ajax/file_upload_handler", "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1"}]);
              break;

            case "filer.net":
              sent_data_form.append("files", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://dl45.filer.net/upload", "POST", sent_data_form], "text", ["match", /"hash":"([a-zA-Z0-9]+)"/, 1], ["https://filer.net/get/"]);
              break;

            case "dataupload.net":
              (async () => {
                try {
                  const sid = generate_sid();

                  await fetch(URL_FOR_BYPASS_CORS + "https://dataupload.net/cgi-bin/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  sent_data_form.append("fname", STATE.file_to_upload_name);
                  sent_data_form.append("op", "import_file");
                  sent_data_form.append("session_id", "");
                  sent_data_form.append("sid", sid);
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://dataupload.net/cgi-bin/api.cgi", "POST", sent_data_form], "json", ["file_code"], ["https://dataupload.net/"], ["https://dataupload.net", "POST", {"op": "del_file", "id": ["file_code"], "del_id": ["killcode", /https:\/\/dataupload\.net\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://dataupload.net/?op=upload_result&st=OK&fn=", ["file_code"]], "confirm": "yes", "token": "CSRF token to add", "rand": "rand string to add", "code": "captcha to add"}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "uploadhive.com":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://uploadhive.com/server");
                  const { url: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Unable to retrieve upload server URL");

                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/upload.cgi", "POST", sent_data_form], "json", [0, "file_code"], ["https://uploadhive.com/"], ["https://uploadhive.com", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/uploadhive\.com\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://uploadhive.com/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add", "rand": "rand string to add", "code": "captcha to add"}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;   

            case "kawaii.su":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://imouto.kawaii.su/api/upload", "POST", sent_data_form], "json", ["files", 0, "url"]);
              break; 

            case "qu.ax":
              sent_data_form.append("files[]", STATE.file_to_upload);
              sent_data_form.append("expiry", "-1");
              upload_to_host([URL_FOR_BYPASS_CORS + "https://qu.ax/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);
              break; 

            case "end2end.tech":
              sent_data_form.append("file", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://api.end2end.tech/upload", "POST", sent_data_form], "json", ["URL"], [], [[["FileID"], ["RemovePassword"], "&password="], "GET", {}, ["https://api.end2end.tech/delete?id="]]);
              break; 

            case "up2sha.re":
              (async () => {
                const api_key_host = await get_api_key(current_host);
                const headers = api_key_host ? { "X-Api-Key": api_key_host } : {};
                let url_upload = "https://up2sha.re/upload";
                let url_extraction = ["result", "public_url"];
                let manage_file = [];

                if (api_key_host) {
                  url_upload = "https://api.up2sha.re/files";
                  sent_data_form.append("filename", STATE.file_to_upload_name);
                  url_extraction = ["public_url"];
                  manage_file = [[["id"], ""], "DELETE", {}, ["https://api.up2sha.re/files/"], headers]
                } else {
                  sent_data_form.append("clientFilename", STATE.file_to_upload_name);
                  sent_data_form.append("filesize", STATE.file_to_upload_size);
                }

                sent_data_form.append("file", STATE.file_to_upload);

                upload_to_host([URL_FOR_BYPASS_CORS + url_upload, "POST", sent_data_form, headers], "json", url_extraction, [], manage_file);
              })();
              break;

            case "atomauth.com":
              sent_data_form.append("fileToUpload", STATE.file_to_upload);
              sent_data_form.append("downloadLimit", "0");
              sent_data_form.append("expirationTime", "0");
              upload_to_host([URL_FOR_BYPASS_CORS + "https://atomauth.com/upload.php", "POST", sent_data_form], "text", ["match", /https:\/\/atomauth\.com\/download\.php\?file=([a-zA-Z0-9]+)/, 0]);
              break; 

            case "darkibox.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://darkibox.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://darkibox.com/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "desiupload.co":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://desiupload.co/server");
                  const { url: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Unable to retrieve upload server URL");

                  sent_data_form.append("file_0", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/upload.cgi", "POST", sent_data_form], "json", [0, "file_code"], ["https://desiupload.co/"], ["https://desiupload.co", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/desiupload\.co\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://desiupload.co/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add", "rand": "rand string to add", "code": "captcha to add"}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;   

            case "gofile.to":
              sent_data_form.append("file", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://gofile.to/api/v1/upload", "POST", sent_data_form], "json", ["data", "file", "url", "short"]);
              break;  

            case "ayaya.beauty":
              sent_data_form.append("file", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://ayaya.beauty/upload", "POST", sent_data_form], "json", ["link"], [], [[["deleteLink"], ""], "GET", {}, []]);
              break;  

            case "filegram.to":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://filegram.to/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://filegram.to/"], [[api_key_host, ["files", 0, "filecode"], "&file_code="], "GET", {}, ["https://filegram.to/api/file/delete?key="]]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "goodstream.one":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res =  await fetch(URL_FOR_BYPASS_CORS + "https://goodstream.one/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://goodstream.one/"], [[api_key_host, ["files", 0, "filecode"], "&file_code="], "GET", {}, ["https://goodstream.one/api/file/delete?key="]]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "dropload.io":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://dropload.io/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://dropload.io/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "gett.su":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://gett.su/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url, sess_id } = await res.json();
                  if (!res.ok || !upload_url || !sess_id) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("sess_id", sess_id);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", [0, "file_code"], ["https://gett.su/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "oneupload.to":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://oneupload.to/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://oneupload.to/"], [[api_key_host, ["files", 0, "filecode"], "&file_code="], "GET", {}, ["https://oneupload.to/api/file/delete?key="]]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                }
              })();
              break;

            case "smoothpre.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://earnvidsapi.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://smoothpre.com/file/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "vinovo.to":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://api.vinovo.si/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("api_key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["result", "download_url"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "uploadrar.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://uploadrar.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { sess_id } = await res.json();
                  if (!res.ok || !sess_id) throw new Error("Invalid API key");

                  const uploadrar_formdata = new FormData;
                  uploadrar_formdata.append("op", "start_upload");
                  uploadrar_formdata.append("file_name", STATE.file_to_upload_name);
                  uploadrar_formdata.append("file_descr", "");
                  uploadrar_formdata.append("file_public", "1");

                  const second_res = await fetch(URL_FOR_BYPASS_CORS + "https://uploadrar.com/", {method: "POST", signal: STATE.signal, body: uploadrar_formdata});
                  const { url: upload_url } = await second_res.json();
                  if (!upload_url) throw new Error("Invalid API key");
                  const sid = generate_sid();

                  await fetch(URL_FOR_BYPASS_CORS + upload_url + "/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  const sent_data_form_final = new FormData;
                  sent_data_form_final.append("fname", STATE.file_to_upload_name);
                  sent_data_form_final.append("op", "import_file");
                  sent_data_form_final.append("sess_id", sess_id);
                  sent_data_form_final.append("sid", sid);
                  sent_data_form_final.append("file_public", "1");
                  
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/api.cgi", "POST", sent_data_form_final], "json", ["links", "download_link"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "listeamed.net":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://api.vidguard.to/v1/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const data = await res.json();
                  const upload_url = data.result.url;
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["result", "HashID"], ["https://listeamed.net/v/"], [[api_key_host, ["result", "HashID"], "&id="], "GET", {}, ["https://api.vidguard.to/v1/video/delete?key="]]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "savefiles.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://savefiles.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://savefiles.com/"], [[api_key_host, ["files", 0, "filecode"], "&file_code="], "GET", {}, ["https://savefiles.com/api/file/delete?key="]]);
                } catch {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "filespayouts.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://filespayouts.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result, sess_id } = await res.json();
                  if (!res.ok || !result) throw new Error("Invalid API key");
                  const upload_url = result.replace("/upload.cgi", "");
                  const sid = generate_sid();

                  await fetch(URL_FOR_BYPASS_CORS + upload_url + "/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  const sent_data_form_final = new FormData;
                  sent_data_form_final.append("fname", STATE.file_to_upload_name);
                  sent_data_form_final.append("op", "import_file");
                  sent_data_form_final.append("sess_id", sess_id);
                  sent_data_form_final.append("sid", sid);
                  sent_data_form_final.append("file_public", "1");
                  
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/api.cgi", "POST", sent_data_form_final], "json", ["links", "short_link"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "fileaxa.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://fileaxa.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result, sess_id } = await res.json();
                  if (!res.ok || !result) throw new Error("Invalid API key");
                  const upload_url = result.replace("/upload.cgi", "");
                  const sid = generate_sid();

                  await fetch(URL_FOR_BYPASS_CORS + upload_url + "/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  const sent_data_form_final = new FormData;
                  sent_data_form_final.append("fname", STATE.file_to_upload_name);
                  sent_data_form_final.append("op", "import_file");
                  sent_data_form_final.append("sess_id", sess_id);
                  sent_data_form_final.append("sid", sid);
                  sent_data_form_final.append("file_public", "1");
                  
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/api.cgi", "POST", sent_data_form_final], "json", ["links", "download_link"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "nelion.me":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://nelion.me/", /https:\/\/([a-zA-Z0-9]+)\.nelion\.me/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".nelion.me/cgi-bin/upload.cgi?upload_type=file", "POST", sent_data_form], "json", [0, "file_code"], ["https://nelion.me/"], ["https://nelion.me", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/nelion\.me\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://nelion.me/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
              })();
              break;

            case "uploadflix.com":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://uploadflix.com/", /https:\/\/([a-zA-Z0-9]+)\.uploadflix\.com/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".uploadflix.cyou/cgi-bin/upload.cgi?upload_type=file", "POST", sent_data_form], "json", [0, "file_code"], ["https://dl.uploadflix.com/"], ["https://uploadflix.cc", "POST", {"op": "del_file", "id": [0, "file_code"], "del_id": ["killcode", /https:\/\/uploadflix\.cc\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://uploadflix.cc/?op=upload_result&st=OK&fn=", [0, "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
              })();
              break;

            case "filepv.com":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://filepv.com/server");
                  const { url: upload_url } = await res.json();
                  const sid = generate_sid();

                  await fetch(URL_FOR_BYPASS_CORS + upload_url + "/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  sent_data_form.append("fname", STATE.file_to_upload_name);
                  sent_data_form.append("op", "import_file");
                  sent_data_form.append("session_id", "");
                  sent_data_form.append("sid", sid);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/api.cgi", "POST", sent_data_form], "json", ["file_code"], ["https://filepv.com/"], ["https://filepv.com", "POST", {"op": "del_file", "id": ["file_code"], "del_id": ["killcode", /https:\/\/filepv\.com\/[A-Za-z0-9]+\/[^\/]+\.[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://filepv.com/?op=upload_result&st=OK&fn=", ["file_code"]], "confirm": "yes", "token": "CSRF token to add", "rand": "rand string to add", "code": "captcha to add"}]);
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                }
              })();
              break;

            case "filestore.to":
              sent_data_form.append("upfile", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://master.filestore.to/upload", "POST", sent_data_form], "json", ["urlDL"], [], [[["urlRM"], ""], "POST", {"Aktion": "remove"}]);
              break;  

            case "dz4up.com":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://dz4up.com/");
                  const data = await res.text();
                  const dz4up_ctracker = data.match(/cTracker: '([a-zA-Z0-9]+)'/)[1];
                  const dz4up_sessionid = data.match(/_sessionid: '([a-zA-Z0-9]+)'/)[1];
                  const dz4up_upload_url = data.match(/url: '(https:\/\/dz4up\.com\/core\/page\/ajax\/file_upload_handler\.ajax\.php\?r=dz4up\.com&p=https&csaKey1=[a-zA-Z0-9]+&csaKey2=[a-zA-Z0-9]+)'/)[1];

                  sent_data_form.append("_sessionid", dz4up_sessionid);
                  sent_data_form.append("cTracker", dz4up_ctracker);
                  sent_data_form.append("maxChunkSize", "100000000");
                  sent_data_form.append("folderId", "");
                  sent_data_form.append("files[]", STATE.file_to_upload);

                  upload_to_host([URL_FOR_BYPASS_CORS + dz4up_upload_url, "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1", "delete": "1", "returnAccount": "0"}]);
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                };
              })();
              break;

            case "megaup.net":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://megaup.net/");
                  const data = await res.text();
                  const megaup_ctracker = data.match(/cTracker: '([a-zA-Z0-9]+)'/)[1];
                  const megaup_sessionid = data.match(/_sessionid: '([a-zA-Z0-9]+)'/)[1];
                  const megaup_upload_url = data.match(/https:\\\/\\\/[a-zA-Z0-9.]+\.megaup\.net\\\/ajax\\\/file_upload_handler\?r=megaup\.net&p=https&csaKey1=[a-fA-F0-9]+&csaKey2=[a-fA-F0-9]+&cupload[0-9]+/)[0];

                  sent_data_form.append("_sessionid", megaup_sessionid);
                  sent_data_form.append("cTracker", megaup_ctracker);
                  sent_data_form.append("maxChunkSize", "100000000");
                  sent_data_form.append("folderId", "");
                  sent_data_form.append("files[]", STATE.file_to_upload);

                  upload_to_host([URL_FOR_BYPASS_CORS + megaup_upload_url, "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1", "delete": "1", "returnAccount": "0", "submit": ""}]);
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                };
              })();
              break;

            case "wdfiles.ru":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://wdfiles.ru/");
                  const data = await res.text();

                  const wdfiles_ctracker = data.match(/cTracker: '([a-zA-Z0-9]+)'/)[1];
                  const wdfiles_sessionid = data.match(/_sessionid: '([a-zA-Z0-9]+)'/)[1];
                  const wdfiles_upload_url = data.match(/url: '(https:\/\/wdfiles\.ru\/core\/page\/ajax\/file_upload_handler\.ajax\.php\?r=wdfiles\.ru&p=https&csaKey1=[a-zA-Z0-9]+&csaKey2=[a-zA-Z0-9]+)'/)[1];

                  sent_data_form.append("_sessionid", wdfiles_sessionid);
                  sent_data_form.append("cTracker", wdfiles_ctracker);
                  sent_data_form.append("maxChunkSize", "100000000");
                  sent_data_form.append("folderId", "");
                  sent_data_form.append("files[]", STATE.file_to_upload);

                  upload_to_host([URL_FOR_BYPASS_CORS + wdfiles_upload_url, "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1", "delete": "1", "returnAccount": "0"}]);
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                };
              })();
              break;

            case "xup.in":
              sent_data_form.append("upload[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://www1.xup.in/exec/xupload.php", "POST", sent_data_form], "text", ["match", /https:\/\/xup\.in\/dl,[0-9]+/, 0], [], [["match", /https:\/\/www\.xup\.in\/kill,[0-9]+,[a-zA-Z0-9]+\//, 0], "GET"]);
              break;  

            case "fast-down.com":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://down.fast-down.com/", /https:\/\/(fs[0-9]+)\.fast-down\.com/, 1);
                sent_data_form.append("file_0", STATE.file_to_upload);
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".fast-down.com/cgi-bin/upload.cgi?upload_type=file&utype=anon", "POST", sent_data_form], "json", [0, "file_code"], ["https://down.fast-down.com/"]);
              })();
              break;

            case "f2h.io":
              (async () => {
                try {
                  sent_data_form.append("files[]", STATE.file_to_upload);
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://f2h.io/upload/uploads/", {method: "POST", body: sent_data_form, signal: STATE.signal});
                  const { files: [f2h_upload_file] } = await res.json();

                  const form_data = new FormData();
                  form_data.append("file[]", JSON.stringify(f2h_upload_file));
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://f2h.io/upload/upload", "POST", form_data], "text", ["match", /https:\/\/f2h\.io\/[a-z0-9]{12}/, 0]);
                  
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                };
              })();
              break;

            case "nippyfile.com":
              (async () => {
                const prefix_url_server = await get_prefix_url_server("https://nippyfile.com/", /\/\/([a-zA-Z0-9]+)\.zipcluster\.com/, 1);
                sent_data_form.append("file[]", STATE.file_to_upload);
                sent_data_form.append("upload", "Upload");
                upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server + ".zipcluster.com/upload.php", "POST", sent_data_form], "text", ["match", /<a href='([^<]+)'>/, 1]);
              })();
              break;

            case "uploadfile.pl":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://uploadfile.pl/");
                  const data = await res.text();
                  const uploadfilepl_idupload = data.match(/name="idupload" value="([a-zA-Z0-9]+)"/)[1];

                  sent_data_form.append("type", "ajax");
                  sent_data_form.append("idupload", uploadfilepl_idupload);
                  sent_data_form.append("regulamin", "1");
                  sent_data_form.append("files[]", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://hot.uploadfile.pl/upload.html", "POST", sent_data_form], "json", ["files",0, "url"], [], [[["files", 0, "urldel"], ""], "POST", {"delete_access": "YES"}]);  
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                };
              })();
              break;

            case "mega4upload.net":
              (async () => {
                try {
                  const prefix_url_server = await get_prefix_url_server("https://mega4upload.net/?op=upload_form", /https:\/\/([a-zA-Z0-9]+)\.mega4down\.com/, 1);
                  const sid = generate_sid();

                  sent_data_form.append("file", STATE.file_to_upload, "file_0");
                  sent_data_form.append("sid", sid);
                  await fetch(URL_FOR_BYPASS_CORS + prefix_url_server.replace("https://", "http://") + ".mega4down.com/cgi-bin/up.cgi", {method: "POST", body: sent_data_form, signal: STATE.signal});
                  
                  const sent_data_form_final = new FormData;
                  sent_data_form_final.append("fname", STATE.file_to_upload_name);
                  sent_data_form_final.append("op", "api_compile");
                  sent_data_form_final.append("file_public", "1");
                  sent_data_form_final.append("sid", sid);
                  upload_to_host([URL_FOR_BYPASS_CORS + prefix_url_server.replace("https://", "http://") + ".mega4down.com/cgi-bin/api.cgi", "POST", sent_data_form_final], "json", ["data", "file_code"], ["https://mega4upload.net/"], ["https://mega4upload.net", "POST", {"op": "del_file", "id": ["data", "file_code"], "del_id": ["killcode", /https:\/\/mega4upload\.net\/[A-Za-z0-9]+\?killcode=[A-Za-z0-9]+/, "https://mega4upload.net/?op=upload_result&st=OK&fn=", ["data", "file_code"]], "confirm": "yes", "token": "CSRF token to add"}]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "hostuje.net":
              (async () => {
                try {
                  const timestamp_date = new Date().getTime();
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://b36.hostuje.org/ubr_link_upload.php?rnd_id=" + timestamp_date, {signal: STATE.signal});
                  const data = await res.text();
                  const hostuje_upload_id = data.match(/startUpload\("([a-z0-9]+)"/)[1];

                  sent_data_form.append("upfile_0", STATE.file_to_upload);
                  const upload_res = await fetch(URL_FOR_BYPASS_CORS + "https://b36.hostuje.org/cgi-bin/upload.pl?upload_id=" + hostuje_upload_id, {method: "POST", body: sent_data_form, signal: STATE.signal});
                  const upload_data = await upload_res.text();
                  const hostuje_form_url = upload_data.match(/https:\/\/hostuje\.net\/finished_b36a\.php\?upload_id=[a-z0-9]+/)[0];

                  upload_to_host([URL_FOR_BYPASS_CORS + hostuje_form_url, "GET"], "text", ["match", /http:\/\/hostuje\.net\/file\.php\?id=[a-z0-9]+/, 0], [], [["match", /http:\/\/hostuje\.net\/del\.php\?id=[a-z0-9]+/, 0], "GET"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "supervideo.cc":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://supervideo.cc/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("api_key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "text", ["match", /<textarea name="fn">([^<]+)<\/textarea>/, 1], ["https://supervideo.cc/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "mixloads.to":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://mixloads.to/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result, sess_id } = await res.json();
                  if (!res.ok || !result) throw new Error("Invalid API key");
                  const upload_url = result.replace("/upload.cgi", "");
                  const sid = generate_sid();

                  await fetch(URL_FOR_BYPASS_CORS + upload_url + "/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  const sent_data_form_final = new FormData;
                  sent_data_form_final.append("fname", STATE.file_to_upload_name);
                  sent_data_form_final.append("op", "import_file");
                  sent_data_form_final.append("sess_id", sess_id);
                  sent_data_form_final.append("sid", sid);
                  sent_data_form_final.append("file_public", "1");
                  
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/api.cgi", "POST", sent_data_form_final], "json", ["links", "download_link"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;
              
            case "ups2up.fun":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://up4stream.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("api_key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://ups2up.fun/", ".html"], [[api_key_host, ["files", 0, "filecode"], "&file_code="], "GET", {}, ["https://up4stream.com/api/file/delete?key="]]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "uqload.cx":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://uqload.cx/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");

                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("api_key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "text", ["match", /<textarea name="fn">([^<]+)<\/textarea>/, 1], ["https://uqload.cx/", ".html"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "lulustream.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://api.lulustream.com/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal});
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");
                  
                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://lulustream.com/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "upfiles.com":
              sent_data_form.append("file", STATE.file_to_upload);
              sent_data_form.append("token", api_key_host);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://api.upfiles.com/upload", "POST", sent_data_form], "json", ["url"]);
              break;

            case "streambolt.tv":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://streambolt.tv/api/upload/server?key=" + api_key_host, {method: "GET", signal: STATE.signal})
                  const { result: upload_url } = await res.json();
                  if (!res.ok || !upload_url) throw new Error("Invalid API key");
                
                  sent_data_form.append("file", STATE.file_to_upload);
                  sent_data_form.append("key", api_key_host);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "POST", sent_data_form], "json", ["files", 0, "filecode"], ["https://streambolt.tv/"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "1filesharing.com":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://1filesharing.com/");
                  const data = await res.text();
                  const _1filesharing_ctracker = data.match(/cTracker: '([a-zA-Z0-9]+)'/)[1];
                  const _1filesharing_sessionid = data.match(/_sessionid: '([a-zA-Z0-9]+)'/)[1];
                  const _1filesharing_upload_url = data.match(/url: '(https:\/\/1filesharing\.com\/core\/page\/ajax\/file_upload_handler\.ajax\.php\?r=1filesharing\.com&p=https&csaKey1=[a-zA-Z0-9]+&csaKey2=[a-zA-Z0-9]+)'/)[1];

                  sent_data_form.append("_sessionid", _1filesharing_sessionid);
                  sent_data_form.append("cTracker", _1filesharing_ctracker);
                  sent_data_form.append("maxChunkSize", "2092152");
                  sent_data_form.append("folderId", "");
                  sent_data_form.append("files[]", STATE.file_to_upload);

                  upload_to_host([URL_FOR_BYPASS_CORS + _1filesharing_upload_url, "POST", sent_data_form], "json", [0, "url"], [], [[[0, "delete_url"], ""], "POST", {"submitted": "1", "delete": "1", "returnAccount": "0", "submit": ""}]);
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                };
              })();
              break;

            case "datavaults.co":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://datavaults.co/server");
                  const { url: upload_url } = await res.json();
                  const sid = generate_sid();

                  await fetch(URL_FOR_BYPASS_CORS + upload_url + "/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  sent_data_form.append("fname", STATE.file_to_upload_name);
                  sent_data_form.append("op", "import_file");
                  sent_data_form.append("session_id", "");
                  sent_data_form.append("sid", sid);
                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url + "/api.cgi", "POST", sent_data_form], "json", ["links", "download_link"]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                }
              })();
              break;

            case "dropmb.com":
              (async () => {
                try {
                  const random_string = Array(4).fill("").map(() => Math.random() < 0.5 ? String.fromCharCode(Math.floor(Math.random() * 26) + 97) : Math.floor(Math.random() * 10)).join("");

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://dropmb.com/api/shares/isShareIdAvailable/" + random_string, {method: "GET", signal: STATE.signal});
                  const data = await res.json();

                  if (!data.isAvailable) throw new Error("Existing unique identifier, try again.");

                  const dropmb_form_data = {
                    "id": random_string,
                    "expiration": "5-years",
                    "recipients": [],
                    "security": {}
                  };

                  await fetch(URL_FOR_BYPASS_CORS + "https://dropmb.com/api/shares", {method: "POST", body: JSON.stringify(dropmb_form_data), headers: {"Content-Type": "application/json"}, signal: STATE.signal});
                    
                  await fetch(URL_FOR_BYPASS_CORS + `https://dropmb.com/api/shares/${random_string}/files?name=${STATE.file_to_upload_name}&chunkIndex=0&totalChunks=1`, {method: "POST", body: STATE.file_to_upload, headers: {"Content-Type": "application/octet-stream", "Content-Length": STATE.file_to_upload_size}, signal: STATE.signal});

                  upload_to_host([URL_FOR_BYPASS_CORS + `https://dropmb.com/api/shares/${random_string}/complete`, "POST"], "json", ["https://dropmb.com/s/" + random_string]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "filemirage.com":
              (async () => {
                try {
                  const api_key_host = await get_api_key(current_host);
                  const headers = api_key_host ? { "Authorization": "Bearer " + api_key_host } : {};

                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://filemirage.com/api/servers", {method: "GET", headers, signal: STATE.signal});
                  const data = await res.json();

                  if (!res.ok || !data.data.server) throw new Error("Unable to retrieve upload parameters");

                  sent_data_form.append("file", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + data.data.server + "/upload.php", "POST", sent_data_form, headers], "json", ["data", "url"]);

                } catch (error) {
                  display_final_url([error.message, host_name]);
                };
              })();
              break;

            case "lain.la":
              sent_data_form.append("files[]", STATE.file_to_upload);
              upload_to_host([URL_FOR_BYPASS_CORS + "https://pomf.lain.la/upload.php", "POST", sent_data_form], "json", ["files", 0, "url"]);
              break;

            case "ranoz.gg":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://ranoz.gg/api/v1/files/upload_url", {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: STATE.file_to_upload_name, size: STATE.file_to_upload_size }), signal: STATE.signal});
                  const data = await res.json();

                  const upload_url = data.data.upload_url;
                  const url = data.data.url;

                  upload_to_host([URL_FOR_BYPASS_CORS + upload_url, "PUT", STATE.file_to_upload, { "Content-Length": STATE.file_to_upload_size }], "text", [url]);
                } catch (error) {
                  display_final_url([error.message, host_name]);
                }
              })();
              break;
            
            case "theuser.cloud":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://theuser.cloud/server");
                  const { url: upload_url } = await res.json();
                  const sid = generate_sid();

                  await fetch(upload_url + "/put_chunk.cgi", {method: "PUT", body: STATE.file_to_upload, headers: {"X-Upload-SID": sid}, signal: STATE.signal});

                  sent_data_form.append("fname", STATE.file_to_upload_name);
                  sent_data_form.append("op", "import_file");
                  sent_data_form.append("sid", sid);
                  upload_to_host([upload_url + "/api.cgi", "POST", sent_data_form], "json", ["file_code"], ["https://theuser.cloud/"], ["https://theuser.cloud", "POST", {"op": "del_file", "id": ["file_code"], "del_id": ["killcode", /https:\/\/theuser\.cloud\/[A-Za-z0-9]+\.html\?killcode=[A-Za-z0-9]+/, "https://theuser.cloud/?op=upload_result&st=OK&fn=", ["file_code"]], "confirm": "yes", "token": "CSRF token to add", "rand": "rand string to add", "code": "captcha to add"}]);
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                }
              })();
              break;

            case "imgbank.cz":
              (async () => {
                try {
                  const res = await fetch(URL_FOR_BYPASS_CORS + "https://imgbank.cz/", {method: "GET", signal: STATE.signal});
                  const data = await res.text();

                  const auth_token = data.match(/name="auth_token" value="([a-zA-Z0-9]+)"/)[1];

                  sent_data_form.append("type", "file");
                  sent_data_form.append("action", "upload");
                  sent_data_form.append("auth_token", auth_token);
                  sent_data_form.append("source", STATE.file_to_upload);
                  upload_to_host([URL_FOR_BYPASS_CORS + "https://imgbank.cz/json", "POST", sent_data_form], "json", ["image", "url_viewer"]);
                } catch {
                  display_final_url(["Unable to retrieve upload parameters", host_name]);
                }
              })();
          }
  
        } else {
          disable_button(BUTTONS.popup_upload_local);
          disable_button(BUTTONS.popup_upload_url);
          BUTTONS.popup_upload_local.innerHTML = "Upload";
          BUTTONS.popup_upload_url.innerText = "Upload";
        }
    });
  };
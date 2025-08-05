import { invoke, convertFileSrc } from './tauri.js';
import { BUTTONS, ELEMENT_DISPLAYS, POPUPS, SELECTS, URL_FOR_BYPASS_CORS, API_URL } from './globals.js';
import { get_resource_path, copy_to_clipboard, disable_button, enable_button } from './utils.js';

function rows_color_history() {
  const tbody = document.getElementById("history_table_body");

  const all_rows = Array.from(tbody.querySelectorAll("tr"));
  const visible_rows = all_rows.filter(row => !row.classList.contains("hidden"));

  visible_rows.forEach((row, index) => {
    row.classList.remove('bg-slate-800', 'bg-gray-900');
    row.classList.add(index % 2 === 0 ? 'bg-slate-800' : 'bg-gray-900');
  });

  if (all_rows.length === 0) {
    POPUPS.uploaded_files_history.classList.add("hidden");
    disable_button(BUTTONS.clear_history);
    BUTTONS.upload_history.classList.add("opacity-50", "cursor-not-allowed", "pointer-events-none", "hidden");
  }
}

function show_hide_expired_files(clicked) {
  let number_expired_links = 0;
  const rows = document.querySelectorAll("#history_table_body tr");
  rows.forEach(row => {
    const link = row.querySelector("a")?.href;
    const status = localStorage.getItem(`${link}_alive`);

    if (status === "deleted") {
      number_expired_links += 1;
      if (clicked) {
        if (SELECTS.select_box_deleted_links.checked) {
          localStorage.setItem("hide_expired", "true");
          row.classList.add("hidden");
        } else {
          localStorage.setItem("hide_expired", "false");
          row.classList.remove("hidden");
        }
      } else {
        row.classList.add("hidden");
        SELECTS.select_box_deleted_links.checked = true;
      };
    };
  });
  
  ELEMENT_DISPLAYS.deleted_files_text.textContent = `Hide deleted/expired files (${number_expired_links})`;

  setTimeout(() => {
    rows_color_history();
  }, 1);
};

export async function init_history() {
    const result = await get_resource_path();
    const res = await fetch(convertFileSrc(result + "/history.json"));
    const data = await res.json();
    if (Object.keys(data).length != 0) {
        BUTTONS.upload_history.classList.remove("opacity-50", "cursor-not-allowed", "pointer-events-none", "hidden");
    };
    
    BUTTONS.upload_history.addEventListener("click", async function () {
      POPUPS.uploaded_files_history.classList.remove("hidden");
      HISTORY_STATE.sort_states[1] = "asc";
      document.getElementById("upload_date_header").innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-calendar"></i> Upload date <i class="fa-sharp-duotone fa-solid fa-arrow-down-wide-short"></i>`;

      while (ELEMENT_DISPLAYS.history_table_body.firstChild) {
        ELEMENT_DISPLAYS.history_table_body.removeChild(ELEMENT_DISPLAYS.history_table_body.firstChild);
      };

      const result = await get_resource_path();
      const res = await fetch(convertFileSrc(result + "/history.json"));
      const data = await res.json();
    
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
        link_cell.className = "w-[450px] max-w-[450px] px-4 py-3";
        link_text.className = "flex items-center justify-center text-center"
        link_text.innerHTML = `<div class="flex items-center justify-between w-full">
          <button id="delete_element_history" class="text-xl text-white cursor-pointer mr-4" target=${link}>
            <i class="text-base text-slate-300 opacity-70 fa-sharp fa-regular fa-xmark"></i>
          </button>
          <div class="flex flex-col flex-1 truncate">
            <a href=${link} target="_blank" class="truncate text-sky-400 hover:underline">` + link + `</a>
            <p id="upload_filename" class="truncate text-xs text-slate-300"><i class="mr-1 fa-sharp-duotone fa-solid fa-file"></i> ${data[link].filename}</p>
          </div>

          <button id="copy_button" class="ml-4 transition active:scale-125" alt="Copy link" link_to_copy="${link}">
            <i class="fa-sharp-duotone fa-solid fa-copy"></i>
          </button>
        </div>`;

        enable_button(BUTTONS.clear_history, "red", "big");

        const upload_date_cell = document.createElement("td");
        upload_date_cell.className = "px-4 py-3";
        upload_date_cell.textContent = data[link].date_upload;

        const expiration_date_cell = document.createElement("td");
        expiration_date_cell.className = "px-4 py-3";

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
          time_to_expiration = `<p style="color: #ff2828;"><i class="fa-sharp fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>Expired file</strong></p>`;
        } else if (localStorage.getItem(`${link}_alive`) == "deleted") {
          time_to_expiration = `<p style="color: #ff2828;"><i class="fa-sharp fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>File deleted</strong></p>`;
        } else if (data[link].date_expires == "Depends on the file size") {
          time_to_expiration = "depends on the file size";
        } else if (data[link].date_expires == "Infinite") {
          time_to_expiration = "infinite";
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
        delete_link_cell.className = "px-4 py-3";

        const file_status = localStorage.getItem(`${link}_file_status`);

        if (data[link].manage[0] && file_status != "delete" && file_status != "expired") {
          let delete_name = data[link].manage[0].startsWith(API_URL) ? "link" : "file";
          delete_link_button.innerHTML = `<button class="bg-gradient-to-t from-rose-600 to-red-500 text-white px-4 py-2 rounded-lg transition duration-200 hover:scale-[1.03] hover:from-rose-500 hover:to-red-500 hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)] active:scale-[1.05]" id="delete_file" value=${link}>Delete ${delete_name} <i class="fa-sharp-duotone fa-solid fa-trash"></i></button>`;
        } else {
          delete_link_button.innerHTML = `<div class="inline-block relative group">
          <button class="bg-gradient-to-t from-rose-600 to-red-500 text-white px-4 py-2 rounded-lg transition duration-200 opacity-50 cursor-not-allowed" id="delete_file" disabled>Delete file <i class="fa-sharp-duotone fa-solid fa-trash-slash"></i></button>
      
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

        ELEMENT_DISPLAYS.history_table_body.appendChild(row);

        const copy_buttons = document.querySelectorAll("#copy_button");
        copy_buttons.forEach((button) => {
          button.addEventListener("click", function () {
            copy_to_clipboard(button.getAttribute("link_to_copy"));
          });
        });

        if (localStorage.getItem("hide_expired") == "true") {
          show_hide_expired_files(false);
        } else {
          show_hide_expired_files(true);
        };
      };

      document.querySelectorAll("#delete_file").forEach(button => {
        button.addEventListener("click", async function () {               
          const delete_url = data[button.value].manage[0];
          const delete_method = data[button.value].manage[1];
          const delete_data = data[button.value].manage[2];
          const delete_headers = data[button.value].manage[3];
          const delete_request_format = data[button.value].manage[4];
          let delete_request_config = "";
          let delete_data_formatted = "";
          button.innerHTML = `Delete file <i class="fas fa-spinner fa-spin"></i>`;

          if (delete_request_format == "formatted") {
            delete_data_formatted = Object.keys(delete_data).map(key => {
              return encodeURIComponent(key) + '=' + encodeURIComponent(delete_data[key]);
            }).join('&');
          } else {
            delete_data_formatted = JSON.stringify(delete_data);
          }

          delete_request_config = {
            method: delete_method,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"
            }
          };

          if (delete_headers != {}) {
            delete_request_config.headers = {...delete_request_config.headers, ...delete_headers};
          };

          if (delete_method !== "GET") {
            delete_request_config.body = delete_data_formatted;
          };

          await fetch(URL_FOR_BYPASS_CORS + delete_url, delete_request_config);

          disable_button(button);
          const time_to_expiration = button.parentNode.parentNode.parentNode.children[2];                  
          button.innerHTML = `Delete file <i class="fa-sharp fa-solid fa-check"></i>`;
          setTimeout(function() {
            button.innerHTML = 'Delete file <i class="fa-sharp-duotone fa-solid fa-trash-slash"></i>';
          }, 1500);
          time_to_expiration.innerHTML = `<p style="color: #ff2828;"><i class="fa-sharp fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>File deleted</strong></p>`;
          localStorage.setItem(`${button.value}_file_status`, 'delete');
          localStorage.setItem(`${button.value}_alive`, 'deleted');

          setTimeout(() => {
            show_hide_expired_files(true);
            if (document.querySelectorAll('#delete_file:not([disabled])').length == 0) {
              disable_button(BUTTONS.delete_all_deletable);
            };
          }, 2000);
        });
      });

      document.querySelectorAll("#delete_element_history").forEach(button => {
        button.addEventListener("click", function () {               
          const history_link = button.getAttribute("target");

          button.parentElement.parentElement.parentElement.parentElement.remove();

          rows_color_history();

          invoke("delete_history_link", { historyLink: history_link });

          show_hide_expired_files(true);
        });
      });

      const active_delete_buttons = document.querySelectorAll('#delete_file:not([disabled])');

      if (active_delete_buttons.length > 0) {
        enable_button(BUTTONS.delete_all_deletable, "red", "big");
      } else {
        disable_button(BUTTONS.delete_all_deletable, "red", "big");
      };

      BUTTONS.delete_all_deletable.addEventListener("click", function () {
        active_delete_buttons.forEach(btn => btn.click());
        setTimeout(() => {
          show_hide_expired_files(true);
          if (document.querySelectorAll('#delete_file:not([disabled])').length == 0) {
            disable_button(BUTTONS.delete_all_deletable);
          };
        }, 1000);
      });
    });
    
    POPUPS.uploaded_files_history.addEventListener("click", function (event) {
      if (event.target === POPUPS.uploaded_files_history && localStorage.getItem("close_popups_setting") === "true") {
        POPUPS.uploaded_files_history.classList.add("hidden");
      };
    });

    if (!localStorage.getItem("hide_expired")) {
      localStorage.setItem("hide_expired", "false");
    };

    SELECTS.select_box_deleted_links.addEventListener("change", async () => {
      show_hide_expired_files(true);
    });

    BUTTONS.clear_history.addEventListener("click", function () {      
      invoke("clear_history_json");

      Object.keys(localStorage).forEach((key) => {
        const pattern = /^https?:\/\/([a-z0-9.-]+\.)?[a-z0-9.-]+(\/[^ ]*)*_(file_status|alive)$/;
      
        if (pattern.test(key)) {
          localStorage.removeItem(key);
        };
      });
      
    
      POPUPS.uploaded_files_history.classList.add("hidden");
      disable_button(BUTTONS.clear_history);
      BUTTONS.upload_history.classList.add("opacity-50", "cursor-not-allowed", "pointer-events-none", "hidden");
    });

    let HISTORY_STATE = {
      sort_states: ["asc", "asc"]
    };

    function parse_date(date_str) {
      return new Date(date_str);
    };

    function parse_expiration(expStr) {
      const days = parseInt(expStr.match(/(\d+)d/)?.[1] || 0, 10);
      const hours = parseInt(expStr.match(/(\d+)h/)?.[1] || 0, 10);
      return days * 24 + hours;
    };

    function sort_history_table(column_index) {
      const tbody = document.getElementById("history_table_body");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const sort_order = HISTORY_STATE.sort_states[column_index] === "asc" ? 1 : -1;

      rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[column_index].textContent.trim();
        const cellB = rowB.cells[column_index].textContent.trim();

        let valueA, valueB;
        if (column_index === 1) {
          valueA = parse_date(cellA);
          valueB = parse_date(cellB);
        } else if (column_index === 2) {
          valueA = parse_expiration(cellA);
          valueB = parse_expiration(cellB);
        };

        return (valueA > valueB ? 1 : -1) * sort_order;
      });

      const all_rows = Array.from(rows);
      let visible_index = 0;

      tbody.innerHTML = "";
      all_rows.forEach(row => {
        row.classList.remove("bg-slate-800", "bg-gray-900");

        if (!row.classList.contains("hidden")) {
          const className = visible_index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
          row.classList.add(className);
          visible_index++;
        };

        tbody.appendChild(row);
      });

      HISTORY_STATE.sort_states[column_index] =
        HISTORY_STATE.sort_states[column_index] === "asc" ? "desc" : "asc";
    };

    document.getElementById("upload_date_header").addEventListener("click", () => {
      sort_history_table(1);

      const current_order = HISTORY_STATE.sort_states[1];

      if (current_order === "asc") {
        document.getElementById("upload_date_header").innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-calendar"></i> Upload date <i class="fa-sharp-duotone fa-solid fa-arrow-down-wide-short"></i>`;
      } else {
        document.getElementById("upload_date_header").innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-calendar"></i> Upload date <i class="fa-sharp-duotone fa-solid fa-arrow-down-short-wide"></i>`;
      };
    });
};
import { invoke, convertFileSrc } from './tauri.js';
import { BUTTONS, ELEMENT_DISPLAYS, POPUPS, STATE, HOST_SITES } from './globals.js';
import { get_resource_path } from './utils.js';

let row_color_indicator = "bright";

export function delete_api_key(element, host) {
  invoke("delete_api_key", { hostName: host });
  disable_api_key_button(host);
  
  element.classList.add("hidden");

  const rows = Array.from(ELEMENT_DISPLAYS.manage_api_keys_body.querySelectorAll('tr:not(.hidden)'));
  rows.forEach((row, index) => {
    row.classList.remove('bg-slate-800', 'bg-gray-900');
    row.classList.add(index % 2 === 0 ? 'bg-slate-800' : 'bg-gray-900');
  });

  BUTTONS.upload_generic.forEach((element) => {
    if (element.getAttribute("api_needed") == host) {
      element.innerHTML = `Set API key
        <div class="inline-block relative group text-left">
          <i class="fa-sharp-duotone fa-solid fa-circle-question" style="color: #ffffff;"></i>
          <div class="absolute bottom-full group-hover:block w-24 hidden" style="margin-left: -80px;">
            <div class="bg-slate-900 text-white text-xs rounded-lg py-1 px-2 shadow-[0_5px_15px_rgba(0,_0,_0,_0.4)]">
              To use this host, enter your personal API key.
            </div>
          </div>
        </div>`;
    } else {
      const element_name = element.closest("td").querySelector("#select_box");
      HOST_SITES.forEach(site => {
        if (site.discriminator == element_name.value && site.api == "optional" && element_name.value == host) {
          const tr_element = element.parentElement.parentElement;
          tr_element.children[1].textContent = site.anonymous_specs[0];
          tr_element.children[2].textContent = site.anonymous_specs[1];
        };
      });
    };
  });

  const visible_buttons = Array.from(document.querySelectorAll("#delete_api_key")).filter(button => {
    return !button.parentNode.parentNode.parentNode.classList.contains("hidden");
  });

  if (visible_buttons.length === 0) {
    ELEMENT_DISPLAYS.api_keys_table.classList.add("hidden");
    ELEMENT_DISPLAYS.no_api_keys_text.classList.remove("hidden");
  }
}

function init_show_api_key(host, api_key) {
  const row = document.createElement("tr");
  
  row.classList.add(row_color_indicator === "bright" ? "bg-slate-800" : "bg-gray-900");
  row_color_indicator = row_color_indicator === "bright" ? "dark" : "bright";

  const host_cell = document.createElement("td");
  host_cell.className = "px-4 py-2";
  host_cell.innerHTML = `<div class="flex items-center"><img src="images\\${host}.png" alt="${host} Logo" class="h-5 ml-1 mr-1">` + HOST_SITES.find(site => site.discriminator === host)?.name; + `</div>`;

  const host_api_key = document.createElement("td");
  host_api_key.className = "px-4 py-2";

  host_api_key.innerHTML = `
    <div class="flex items-center gap-2">
      <input id="input_api_keys_management" class="bg-slate-900 rounded-lg border-separate border-slate-950 border pl-2 pr-2 p-1 text-sm focus:outline-none hover:bg-[#0b1322] transition duration-200" type="text" host="${host}" value="${api_key}">
      <span id="mirror" class="absolute invisible whitespace-pre text-sm px-2 py-1 font-inherit max-w-[600px]"></span>
      <button id="delete_api_key" class="transition active:scale-125" value="${host}"><i class="fa-sharp fa-solid fa-eraser text-red-500"></i></button>
    </div>
  `;

  row.appendChild(host_cell);
  row.appendChild(host_api_key);

  ELEMENT_DISPLAYS.manage_api_keys_body.appendChild(row);
}

function init_delete_api_key() {
  document.querySelectorAll("#delete_api_key").forEach(button => {
    button.addEventListener("click", function () {
      delete_api_key(button.parentNode.parentNode.parentNode, button.value);
    })
  });
}

function init_api_key_inputs() {
  document.querySelectorAll("#input_api_keys_management").forEach(input => {
    if (input.dataset.initialized === "true") return;

    input.dataset.initialized = "true";
    const mirror = input.nextElementSibling;
    let debounce_timeout;

    const update_width = () => {
      mirror.textContent = input.value || input.placeholder || "";
      const width = mirror.offsetWidth + 10;
      input.style.width = Math.min(width, 600) + "px";
    };

    input.addEventListener("input", () => {
      update_width();
      clearTimeout(debounce_timeout);
      debounce_timeout = setTimeout(() => {
        const value = input.value;
        const host = input.getAttribute("host");
        if (value !== "") {
          invoke("update_api_key", { hostName: host, apiKey: value });
        }
      }, 500);
    });

    input.addEventListener("blur", () => {
      const value = input.value;
      const host = input.getAttribute("host");

      if (value === "") {
        delete_api_key(input.parentElement.parentElement.parentElement, host);
      }
    });
    update_width();
  });
};

function disable_api_key_button(host) {
  ELEMENT_DISPLAYS.required_api_keys_table.querySelectorAll(':scope > div').forEach(div => {
    if (div.getAttribute('host') == host) {
      div.classList.remove("border-indigo-300/80", "bg-indigo-500/50");
      div.classList.add("border-indigo-300/50", "bg-indigo-500/10", "bg-indigo-500/10", "hover:bg-indigo-500/30", "cursor-pointer");
      div.setAttribute("status", "inactive");
    }
  });

  ELEMENT_DISPLAYS.optional_api_keys_table.querySelectorAll(':scope > div').forEach(div => {
    if (div.getAttribute('host') == host) {
      div.classList.remove("border-indigo-300/80", "bg-indigo-500/50");
      div.classList.add("border-indigo-300/50", "bg-indigo-500/10", "bg-indigo-500/10", "hover:bg-indigo-500/30", "cursor-pointer");
      div.setAttribute("status", "inactive");
    }
  });
};

function enable_api_key_button(table, data) {
  table.querySelectorAll(':scope > div').forEach(div => {
    const host_value = div.getAttribute('host');
    if (host_value && data.hasOwnProperty(host_value)) {
      div.classList.remove("border-indigo-300/50", "bg-indigo-500/10", "bg-indigo-500/10", "hover:bg-indigo-500/30", "cursor-pointer");
      div.classList.add("border-indigo-300/80", "bg-indigo-500/50");
      div.setAttribute("status", "active");
    };
  });
};

export function init_api_management() {
  if (!localStorage.getItem("show_api_keys")) {
    localStorage.setItem("show_api_keys", "true");
  };

  BUTTONS.upload_generic.forEach(async (element) => {
    const result = await get_resource_path();
    const res = await fetch(convertFileSrc(result + "/api_keys.json"));
    const data = await res.json();

    if (element.hasAttribute("api_needed")) {
      if (!data[element.getAttribute("api_needed")]) {
        element.innerHTML = `Set API key
        <div class="inline-block relative group text-left">
          <i class="fa-sharp-duotone fa-solid fa-circle-question" style="color: #ffffff;"></i>
      
          <div class="absolute bottom-full group-hover:block w-24 hidden" style="margin-left: -80px;">
              <div class="bg-slate-900 text-white text-xs rounded-lg py-1 px-2 shadow-[0_5px_15px_rgba(0,_0,_0,_0.4)]">To use this host, enter your personal API key.</div>
          </div>
        </div>`;
      } else {
        element.textContent = "Upload";
      };
    } else {
      const element_name = element.closest("td").querySelector("#select_box");
      HOST_SITES.forEach(site => {
        if (site.discriminator == element_name.value && site.api == "optional" && data[element_name.value]) {
          const tr_element = element.parentElement.parentElement;
          tr_element.children[1].textContent = site.connected_specs[0];
          tr_element.children[2].textContent = site.connected_specs[1];
        };
      });
    };
  });

  POPUPS.manage_api_keys.addEventListener("click", function (event) {
    if (event.target === POPUPS.manage_api_keys && localStorage.getItem("close_popups_setting") === "true") {
      document.querySelectorAll("#input_api_keys_management").forEach(input => {
        if (input.value == "") {
          delete_api_key(input.parentElement.parentElement.parentElement, input.getAttribute("host"));
        };
      });
      POPUPS.manage_api_keys.classList.add("hidden");
    };
  });
  
  BUTTONS.manage_api_keys.addEventListener("click", async function () {
    POPUPS.manage_api_keys.classList.remove("hidden");
  
    while (ELEMENT_DISPLAYS.manage_api_keys_body.firstChild) {
      ELEMENT_DISPLAYS.manage_api_keys_body.removeChild(ELEMENT_DISPLAYS.manage_api_keys_body.firstChild);
    }

    while (ELEMENT_DISPLAYS.required_api_keys_table.firstChild) {
      ELEMENT_DISPLAYS.required_api_keys_table.removeChild(ELEMENT_DISPLAYS.required_api_keys_table.firstChild);
    }

    while (ELEMENT_DISPLAYS.optional_api_keys_table.firstChild) {
      ELEMENT_DISPLAYS.optional_api_keys_table.removeChild(ELEMENT_DISPLAYS.optional_api_keys_table.firstChild);
    }
    
    HOST_SITES.forEach(site => {
      const div = document.createElement('div');
      div.className = 'inline-flex items-center justify-center gap-1 px-2 py-1 transition duration-200 border rounded-lg cursor-pointer border-indigo-300/50 bg-indigo-500/10 hover:bg-indigo-500/30';

      div.setAttribute("host", site.discriminator);
      div.setAttribute("status", "inactive");

      const img = document.createElement('img');
      img.src = `images/${site.discriminator}.png`;
      img.width = 15;
      div.appendChild(img);

      const span = document.createElement('span');
      span.textContent = site.name;
      div.appendChild(span);

      if (site.api == "required") {
        div.id = "host_button_api_key_required";

        ELEMENT_DISPLAYS.required_api_keys_table.appendChild(div);
      } else if (site.api == "optional") {
        div.id = "host_button_api_key_optional";

        ELEMENT_DISPLAYS.optional_api_keys_table.appendChild(div);
      }
    });

    try {
      const result = await get_resource_path();
      const res = await fetch(convertFileSrc(result + "/api_keys.json"));
      const data = await res.json();
    
      const keys = Object.keys(data);

      if (keys.length != 0) {
        ELEMENT_DISPLAYS.api_keys_table.classList.remove("hidden");
        ELEMENT_DISPLAYS.no_api_keys_text.classList.add("hidden");
      }

      for (const key of keys) {
        STATE.host = key;
        init_show_api_key(STATE.host, data[STATE.host]);
      }

      enable_api_key_button(ELEMENT_DISPLAYS.required_api_keys_table, data);
      enable_api_key_button(ELEMENT_DISPLAYS.optional_api_keys_table, data);

      document.querySelectorAll('[id="host_button_api_key_required"]').forEach((button) => {
        button.addEventListener("click", function () {
          if (button.getAttribute("status") == "inactive") {
            ELEMENT_DISPLAYS.api_keys_table.classList.remove("hidden");
            ELEMENT_DISPLAYS.no_api_keys_text.classList.add("hidden");
            button.classList.remove("border-indigo-300/50", "bg-indigo-500/10");
            button.classList.add("border-indigo-300/80", "bg-indigo-500/50");
            button.setAttribute("status", "active");

            init_show_api_key(button.getAttribute("host"), "");
            init_api_key_inputs();
            init_delete_api_key();

            BUTTONS.upload_generic.forEach((element) => {
              if (element.getAttribute("api_needed") == button.getAttribute("host")) {
                element.textContent = "Upload";
              };
            });
          };
        });
      });

      document.querySelectorAll('[id="host_button_api_key_optional"]').forEach((button) => {
        button.addEventListener("click", function () {
          if (button.getAttribute("status") == "inactive") {
            ELEMENT_DISPLAYS.api_keys_table.classList.remove("hidden");
            ELEMENT_DISPLAYS.no_api_keys_text.classList.add("hidden");
            button.classList.remove("border-indigo-300/50", "bg-indigo-500/10");
            button.classList.add("border-indigo-300/80", "bg-indigo-500/50");
            button.setAttribute("status", "active");

            init_show_api_key(button.getAttribute("host"), "");
            init_api_key_inputs();
            init_delete_api_key();

            BUTTONS.upload_generic.forEach((element) => {
              const element_name = element.closest("td").querySelector("#select_box");
              HOST_SITES.forEach(site => {
                if (site.discriminator == element_name.value && site.api == "optional" && site.discriminator == button.getAttribute("host")) {
                  const tr_element = element.parentElement.parentElement;
                  tr_element.children[1].textContent = site.connected_specs[0];
                  tr_element.children[2].textContent = site.connected_specs[1];
                };
              });
            });
          };
        });
      });
      
      if (localStorage.getItem("show_api_keys") == "true") {
        document.querySelectorAll("#input_api_keys_management").forEach(input => {
          input.classList.remove("blur-[3px]");
        });
        ELEMENT_DISPLAYS.hide_show_api_keys_text.innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-eye-slash"></i>Hide API keys`;
      } else {
        document.querySelectorAll("#input_api_keys_management").forEach(input => {
          input.classList.add("blur-[3px]");
        });
        ELEMENT_DISPLAYS.hide_show_api_keys_text.innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-eye"></i>Show API keys`;
      }

      init_api_key_inputs();
      init_delete_api_key();
    } catch (error) {
      console.error(error)
    }
  });

  ELEMENT_DISPLAYS.hide_show_api_keys_text.addEventListener("click", function () {
    if (localStorage.getItem("show_api_keys") == "true") {
      document.querySelectorAll("#input_api_keys_management").forEach(input => {
        input.classList.add("blur-[3px]");
      });
      ELEMENT_DISPLAYS.hide_show_api_keys_text.innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-eye"></i>Show API keys`;
      localStorage.setItem("show_api_keys", "false");
    } else {
      document.querySelectorAll("#input_api_keys_management").forEach(input => {
        input.classList.remove("blur-[3px]");
      });
      ELEMENT_DISPLAYS.hide_show_api_keys_text.innerHTML = `<i class="mr-1 fa-sharp-duotone fa-solid fa-eye-slash"></i>Hide API keys`;
      localStorage.setItem("show_api_keys", "true");
    }
  });


  BUTTONS.toggle_api_keys_required.addEventListener("click", function () {
    if (ELEMENT_DISPLAYS.api_keys_required_menu.classList.contains("hidden")) {
      ELEMENT_DISPLAYS.api_keys_required_menu.classList.remove("hidden");
      BUTTONS.toggle_api_keys_required.innerHTML = `<i class="mr-1 fa-sharp fa-solid fa-triangle fa-rotate-180 fa-2xs"></i><span>Hosts requiring an API key</span>`;
    } else {
      ELEMENT_DISPLAYS.api_keys_required_menu.classList.add("hidden");
      BUTTONS.toggle_api_keys_required.innerHTML = `<i class="mr-1 fa-sharp fa-solid fa-triangle fa-rotate-90 fa-2xs"></i><span>Hosts requiring an API key</span>`;
    }
  });

  BUTTONS.toggle_api_keys_optional.addEventListener("click", function () {
    if (ELEMENT_DISPLAYS.api_keys_optional_menu.classList.contains("hidden")) {
      ELEMENT_DISPLAYS.api_keys_optional_menu.classList.remove("hidden");
      BUTTONS.toggle_api_keys_optional.innerHTML = `<i class="mr-1 fa-sharp fa-solid fa-triangle fa-rotate-180 fa-2xs"></i><span>Hosts using an optional API key</span>`;
    } else {
      ELEMENT_DISPLAYS.api_keys_optional_menu.classList.add("hidden");
      BUTTONS.toggle_api_keys_optional.innerHTML = `<i class="mr-1 fa-sharp fa-solid fa-triangle fa-rotate-90 fa-2xs"></i><span>Hosts using an optional API key</span>`;
    }
  });
}
import { convertFileSrc, invoke } from './tauri.js';
import { get_resource_path, enable_button, reset_popup, disable_button, reset_upload_profile } from './utils.js';
import { SELECTS, STATE, BUTTONS, INPUTS, ELEMENT_DISPLAYS, POPUPS } from './globals.js';

export function init_profiles() {
    async function load_profiles() {
      const result = await get_resource_path();
      const response = await fetch(convertFileSrc(result + "/profiles.json"));
      const data = await response.json();
      SELECTS.profile.innerHTML = `<option id="default_option" value="default" disabled selected>Select a profile</option>`;
      for (const profil in data) {
        if (data.hasOwnProperty(profil)) {
          const option = document.createElement("option");
          option.value = profil;
          option.text = profil;
          SELECTS.profile.appendChild(option);
        };
      };

      SELECTS.profile.addEventListener("change", function () {
        STATE.selected_profile = SELECTS.profile.value;
        const values = data[STATE.selected_profile];

        BUTTONS.popup_new_profile.innerHTML = `<i class="fa-sharp-duotone fa-solid fa-pen"></i>`;

        STATE.host = [];

        for (const host_site of values) {
          if (localStorage.getItem(`${host_site}_status`) == "online") {
            STATE.host.push(host_site);
          };
        };

        if (STATE.upload_mode == "local" && STATE.host && JSON.stringify(STATE.host) !== "[]" && INPUTS.popup_file.files.length > 0) {
          enable_button(BUTTONS.popup_upload_local, "red", "big");
        } else if (STATE.upload_mode == "url" && STATE.host && JSON.stringify(STATE.host) !== "[]" && INPUTS.url_upload.value != "") {
          enable_button(BUTTONS.popup_upload_url, "red", "big");
        }
      });
    };

    BUTTONS.upload_profile.addEventListener("click", function () {
      load_profiles();
      reset_popup();
      ELEMENT_DISPLAYS.final_upload_url.classList.add("hidden");
      STATE.host = [];
      ELEMENT_DISPLAYS.conditions_of_use.classList.add("hidden");
      SELECTS.profile_menu.classList.remove("hidden");
      BUTTONS.popup_new_profile.classList.remove("hidden");
      BUTTONS.upload_generic.forEach((element) => {
        element.classList.remove("hidden");
      });
      BUTTONS.select_box_container.forEach((element) => {
        element.classList.add("hidden");
      });
    
      ELEMENT_DISPLAYS.upload_name.textContent = "Upload";
      BUTTONS.toggle_upload_mode.innerHTML = `<i class="fa-sharp-duotone fa-solid fa-arrows-turn-right mr-1"></i> Switch to multiple upload mode`;
      BUTTONS.multiple_host_popup.classList.add("hidden");
      STATE.button_upload_status = 0;
      SELECTS.profile.value = "default";
    });
    
    BUTTONS.popup_new_profile.addEventListener("click", function () {
      SELECTS.select_box.forEach((checkbox) => {
        checkbox.checked = false;
      });
    
      if (STATE.selected_profile !== "") {
        document.getElementById("profile_name_text").innerHTML = '<i class="mr-1 fa-sharp-duotone fa-solid fa-pen-to-square"></i> New profile name:';
        BUTTONS.delete_profiles.classList.remove("hidden");
        BUTTONS.delete_profiles.innerHTML = '<i class="mr-1 fa-sharp-duotone fa-solid fa-trash"></i> Delete profile';
        BUTTONS.rename_profiles.classList.remove("hidden");
        BUTTONS.rename_profiles.innerHTML = '<i class="mr-1 fa-sharp-duotone fa-solid fa-pen"></i> Rename profile';
        BUTTONS.select_host.innerHTML = '<i class="mr-1 fa-sharp-duotone fa-solid fa-database"></i> Change selected hosts';
        STATE.profile_status = 1;
        enable_button(BUTTONS.select_host, "indigo", "small");
      };
      POPUPS.upload.classList.add("hidden");
      POPUPS.profile_maker.classList.remove("hidden");
    });
    
    POPUPS.profile_maker.addEventListener("click", function (event) {
      if (event.target === POPUPS.profile_maker && localStorage.getItem("close_popups_setting") === "true") {
        reset_upload_profile();
      };
    });
    
    BUTTONS.select_host.addEventListener("click", function () {
      disable_button(BUTTONS.save_selected_host);
      
      POPUPS.profile_maker.classList.add("hidden");

      BUTTONS.select_box_container.forEach((element) => {
        element.classList.remove("hidden");
      });

      BUTTONS.upload_generic.forEach((element) => {
        if (!element.textContent.includes("Set API key")) {
          element.classList.add("hidden");
        } else {
          const api_key_element = element.parentElement;
          const checkbox = api_key_element.querySelectorAll("div");
          checkbox[3].classList.add("hidden");
        };
      });
    
      ELEMENT_DISPLAYS.upload_name.textContent = "Selected";
    
      SELECTS.select_box.forEach((checkbox) => {
        if (STATE.host.includes(checkbox.value)) {
          checkbox.checked = true;
        };
      });
    
      BUTTONS.save_selected_host.classList.remove("hidden");
      BUTTONS.cancel_selected_host.classList.remove("hidden");
    });
    
    BUTTONS.save_selected_host.addEventListener("click", function () {

      const selected_host = [];
    
      SELECTS.select_box.forEach((checkbox) => {
        if (checkbox.checked && !checkbox.parentElement.parentElement.parentElement.textContent.includes("Set API key")) {
          selected_host.push(checkbox.value);
        }
      });
    
      let profile_name = "";
    
      if (STATE.profile_status === 0) {
        profile_name = INPUTS.profile_name.value;
      } else if (STATE.profile_status === 1) {
        profile_name = STATE.selected_profile;
      };
    
      invoke("add_profile_json", {profileName: profile_name, selectedHost: selected_host});
    
      BUTTONS.upload_generic.forEach((element) => {
        element.classList.remove("hidden");
      });
      BUTTONS.select_box_container.forEach((element) => {
        element.classList.add("hidden");
      });
      ELEMENT_DISPLAYS.upload_name.textContent = "Upload";
      BUTTONS.save_selected_host.classList.add("hidden");
      BUTTONS.cancel_selected_host.classList.add("hidden");
      reset_upload_profile();
    });
    
    BUTTONS.cancel_selected_host.addEventListener("click", function () {
      BUTTONS.upload_generic.forEach((element) => {
        element.classList.remove("hidden");
      });
      BUTTONS.select_box_container.forEach((element) => {
        element.classList.add("hidden");
      });
      ELEMENT_DISPLAYS.upload_name.textContent = "Upload";
    
      BUTTONS.save_selected_host.classList.add("hidden");
      BUTTONS.cancel_selected_host.classList.add("hidden");
      reset_upload_profile();
    });

    BUTTONS.delete_profiles.addEventListener("click", function () {
      invoke("delete_profile_json", { profileName: STATE.selected_profile });
      POPUPS.profile_maker.classList.add("hidden");
      reset_upload_profile();
    });
    
    BUTTONS.rename_profiles.addEventListener("click", function () {
      invoke("rename_profile_json", {
        oldProfileName: STATE.selected_profile,
        newProfileName: INPUTS.profile_name.value,
      });
      reset_upload_profile();
    });
    
    INPUTS.profile_name.addEventListener("input", function () {
      if (INPUTS.profile_name.value) {
        enable_button(BUTTONS.rename_profiles, "indigo", "small");
    
        if (STATE.profile_status === 0) {
          enable_button(BUTTONS.select_host, "indigo", "small");
        };
      } else {
        disable_button(BUTTONS.rename_profiles);
    
        if (STATE.profile_status === 0) {
          disable_button(BUTTONS.select_host);
        };
      };
    });
};
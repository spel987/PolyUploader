import { HOST_SITES, BUTTONS, ELEMENT_DISPLAYS, URL_FOR_BYPASS_CORS } from './globals.js';

export function init_check_host() {
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
            
                host_element.innerHTML = host_name + `<p class="ml-2" style="color: #ff2828;"><i class="fa-sharp fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>Offline</strong></p>`;
            };
        };
        return null;
    };
    
    function enable_hosts() {
        const table_rows = document.querySelectorAll(".search-result");
        
        for (const row of table_rows) {
            const host_element = row.querySelector("td:nth-child(1)");
            const host_name = host_element.innerHTML;
        
            if (host_name.includes("Offline")) {
                host_element.innerHTML = host_name.replace(`<p class="ml-2" style="color: #ff2828;"><i class="fa-sharp fa-solid fa-circle-exclamation" style="color: #ff2828;"></i> <strong>Offline</strong></p>`, "");
                row.classList.remove("opacity-60", "cursor-not-allowed", "pointer-events-none");
                const checkbox_element = row.querySelector('input[type="checkbox"]');
                checkbox_element.removeAttribute("disabled");
            };
        };
    };

    async function check_host_status(forced) {
      let offline_hosts = 0;
      let total_hosts = 0;
      let last_check_date_global = null;

      BUTTONS.check_status.classList.add("animate-pulse", "pointer-events-none");
    
      const requests_promises = [];
      HOST_SITES.forEach((site) => {
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
          if (!site.bypass_check) {
            const requests_promise = fetch(URL_FOR_BYPASS_CORS + site.url)
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
          } else {
            localStorage.setItem(`${site.discriminator}_status`, 'online');
          };
          
        } else if (last_check_status === 'offline') {
            disable_host(site.discriminator);
            offline_hosts++;
        };
      });
    
      Promise.all(requests_promises)
      .then(() => {
        BUTTONS.check_status.innerHTML = `Check host status <i class="ml-1 fa-sharp-duotone fa-solid fa-arrows-rotate-reverse"></i>`;
        ELEMENT_DISPLAYS.stats_text.classList.remove("hidden");
        BUTTONS.check_status.classList.remove("animate-pulse", "pointer-events-none");
        ELEMENT_DISPLAYS.stats_text.innerHTML = total_hosts - offline_hosts + "/" + total_hosts + " online hosts. Last check: " + new Date(parseInt(last_check_date_global)).toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric", hour12: true,}).replace(",", "");
      })
      .catch((error) => {
        console.error(error);
      });
    };
    
    check_host_status(false);

    BUTTONS.check_status.addEventListener("click", function () {
      enable_hosts();
      BUTTONS.check_status.innerHTML = `Check host status <i class="ml-1 fa-sharp-duotone fa-solid fa-arrows-rotate-reverse"></i>`;
      BUTTONS.check_status.classList.add("animate-pulse", "pointer-events-none");
      ELEMENT_DISPLAYS.stats_text.classList.add("hidden");
      check_host_status(true);
    });
};
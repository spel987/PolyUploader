import { ELEMENT_DISPLAYS, STATE } from "./globals.js";
import { reset_table_order, apply_alternate_row_colors } from "./utils.js";

export function init_sort_table() {
      function sort_table(sort_index, get_value, get_name_value) {
        const sort_order = STATE.sort_states[sort_index] === "asc" ? -1 : 1;
      
        ELEMENT_DISPLAYS.rows_of_providers.sort((rowA, rowB) => {
          const valueA = sort_index === 0 ? get_name_value(rowA.cells[sort_index]) : get_value(rowA.cells[sort_index]);
          const valueB = sort_index === 0 ? get_name_value(rowB.cells[sort_index]) : get_value(rowB.cells[sort_index]);
      
          if (valueA === "depends" && valueB !== "depends") {
            return 1;
          } else if (valueB === "depends" && valueA !== "depends") {
            return -1;
          }
      
          if (sort_index === 0) {
            return sort_order * (valueA.localeCompare(valueB));
          } else {
            return sort_order * (valueB - valueA);
          };
        });
      
        ELEMENT_DISPLAYS.tbody_of_providers.innerHTML = "";
        ELEMENT_DISPLAYS.rows_of_providers.forEach((row, index) => {
          const original_class = index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
          row.classList.remove("bg-slate-800", "bg-gray-900");
          row.classList.add(original_class, "alternate-row");
          ELEMENT_DISPLAYS.tbody_of_providers.appendChild(row);
        });
      
        STATE.sort_states[sort_index] = STATE.sort_states[sort_index] === "asc" ? "desc" : "asc";

        apply_alternate_row_colors();
      };
      
      function get_name_value(cell) {
        return cell.textContent.trim().toLowerCase();
      };
      
      function get_max_size_file_value(cell) {
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
        };
      };
      
      function get_expire_value(cell) {
        const text = cell.textContent.trim();
        if (text === "infinite") return Infinity;
        if (text.includes("depends on the file size")) return "depends";
      
        const has_days = text.includes("days");
        const time = parseFloat(has_days ? text.replace(" days", "") : text);
      
        return has_days ? time * 24 * 60 : time;
      };
      
      let alpahbetic_order = 0;
      let file_size_order = 0;
      let expire_order = 0;
      
      document.getElementById("name_header").addEventListener("click", () => {
        sort_table(0, null, get_name_value);
      
        if (alpahbetic_order == 0) {
          document.getElementById("name_header").innerHTML = `Name <i class="fa-sharp-duotone fa-solid fa-arrow-down-a-z"></i><i id="name_order_reset" class="ml-5 fa-sharp fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
          alpahbetic_order = 1;
        } else {
          document.getElementById("name_header").innerHTML = `Name <i class="fa-sharp-duotone fa-solid fa-arrow-down-z-a"></i><i id="name_order_reset" class="ml-5 fa-sharp fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
          alpahbetic_order = 0;
        };
      
        document.getElementById("name_order_reset").addEventListener("click", (event) => {
          event.stopPropagation(); 
          reset_table_order();
        });
      });
      
      document.getElementById("max_file_size_header").addEventListener("click", () => {
        sort_table(1, get_max_size_file_value);
      
        if (file_size_order == 0) {
          document.getElementById("max_file_size_header").innerHTML = `Max file size <i class="fa-sharp-duotone fa-solid fa-arrow-down-wide-short"></i><i id="max_file_size_order_reset" class="ml-5 fa-sharp fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
          file_size_order = 1;
        } else {
          document.getElementById("max_file_size_header").innerHTML = `Max file size <i class="fa-sharp-duotone fa-solid fa-arrow-down-short-wide"></i><i id="max_file_size_order_reset" class="ml-5 fa-sharp fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
          file_size_order = 0;
        };
      
        document.getElementById("max_file_size_order_reset").addEventListener("click", (event) => {
          event.stopPropagation(); 
          reset_table_order();
        });
      });
      
      document.getElementById("expire_header").addEventListener("click", () => {
        sort_table(2, get_expire_value);
      
        if (expire_order == 0) {
          document.getElementById("expire_header").innerHTML = `Expire in <i class="fa-sharp-duotone fa-solid fa-arrow-down-wide-short"></i><i id="expire_order_reset" class="ml-5 fa-sharp fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
          expire_order = 1;
        } else {
          document.getElementById("expire_header").innerHTML = `Expire in <i class="fa-sharp-duotone fa-solid fa-arrow-down-short-wide"></i><i id="expire_order_reset" class="ml-5 fa-sharp fa-solid fa-arrow-rotate-left hover:text-red-500"></i>`
          expire_order = 0;
        };
      
        document.getElementById("expire_order_reset").addEventListener("click", (event) => {
          event.stopPropagation(); 
          reset_table_order();
        });
      });
};
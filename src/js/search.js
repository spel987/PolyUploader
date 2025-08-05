import { ELEMENT_DISPLAYS, BUTTONS } from "./globals.js";
import { reset_table_order, apply_alternate_row_colors } from "./utils.js";

export function init_search() {
    const search_input = document.getElementById("search_input");

    search_input.addEventListener("input", () => {
        if (search_input.value == "") {
            ELEMENT_DISPLAYS.search_icon.classList.remove("opacity-0");
            BUTTONS.delete_search_input.classList.add("hidden");
            setTimeout(() => reset_table_order(), 0);
        } else {
            ELEMENT_DISPLAYS.search_icon.classList.add("opacity-0");
            BUTTONS.delete_search_input.classList.remove("hidden");
        };

        const search_term = search_input.value.toLowerCase();

        ELEMENT_DISPLAYS.rows_of_providers.forEach((row) => {
            const provider_name = row.cells[0].textContent.toLowerCase();
            const isSearchResult = provider_name.includes(search_term);

            if (isSearchResult) {
                row.classList.add("search-result");
                row.classList.remove("cursor-not-allowed", "pointer-events-none", "opacity-50", "blur-[1.5px]");
            } else {
                row.classList.remove("search-result");
                row.classList.add("cursor-not-allowed", "pointer-events-none", "opacity-50", "blur-[1.5px]");
            };
        });

        ELEMENT_DISPLAYS.rows_of_providers.sort((rowA, rowB) => {
            const isSearchResultA = rowA.classList.contains("search-result");
            const isSearchResultB = rowB.classList.contains("search-result");

            if (isSearchResultA && !isSearchResultB) {
                return -1;
            } else if (!isSearchResultA && isSearchResultB) {
                return 1;
            } else {
                return 0;
            };
        });

        ELEMENT_DISPLAYS.tbody_of_providers.innerHTML = "";
        ELEMENT_DISPLAYS.rows_of_providers.forEach((row, index) => {
            const original_class = index % 2 === 0 ? "bg-slate-800" : "bg-gray-900";
            row.classList.remove("bg-slate-800", "bg-gray-900");
            row.classList.add(original_class, "alternate-row");
            ELEMENT_DISPLAYS.tbody_of_providers.appendChild(row);
        });

        apply_alternate_row_colors();
    });

    BUTTONS.delete_search_input.addEventListener("click", () => {
        search_input.value = "";
        ELEMENT_DISPLAYS.search_icon.classList.remove("opacity-0");
        BUTTONS.delete_search_input.classList.add("hidden");

        ELEMENT_DISPLAYS.rows_of_providers.forEach((row) => {
            row.classList.add("search-result");
            row.classList.remove("cursor-not-allowed", "pointer-events-none", "opacity-50", "blur-[1.5px]");
        });

        setTimeout(() => reset_table_order(), 0);
    });
}
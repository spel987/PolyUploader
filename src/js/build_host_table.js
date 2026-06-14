const TOOLTIP = (icon, text) => `<div class="relative inline-block group">${icon}<div class="absolute hidden w-48 bottom-full group-hover:block"><div class="bg-slate-900 text-white text-xs rounded-lg py-1 px-2 shadow-[0_5px_15px_rgba(0,_0,_0,_0.4)]">${text}</div></div></div>`;

const BADGE = {
  api_optional: TOOLTIP(`<i class="ml-2 fa-sharp-duotone fa-solid fa-sparkles opacity-40"></i>`, `This host supports personal API keys, set it up by pressing the "Manage API keys" button.`),
  api_required: TOOLTIP(`<i class="ml-2 fa-sharp fa-solid fa-key opacity-40"></i>`, `This host requires an API key.`),
  deletion: TOOLTIP(`<i class="ml-2 fa-sharp-duotone fa-solid fa-screwdriver-wrench opacity-40"></i>`, `This host supports manual deletion of uploaded files.`),
  api_deletion: TOOLTIP(`<i class="ml-2 fa-sharp-duotone fa-solid fa-gears opacity-40"></i>`, `This host supports manual deletion of uploaded files only when using the API key.`),
  video: TOOLTIP(`<i class="ml-2 fa-sharp-duotone fa-solid fa-film opacity-40"></i>`, `This host allows video streaming and therefore only accepts video files.`),
  unstable: TOOLTIP(`<i class="ml-2 opacity-50 fa-sharp fa-solid fa-circle-exclamation" style="color: #ffae00;"></i>`, `Errors are frequently encountered during uploads, not from PolyUploader but from the website.`),
};

const CHECKBOX_SVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 -1 20 20" fill="currentColor" stroke="currentColor" stroke-width="1"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`;

export function build_host_table(host_sites) {
  const tbody = document.querySelector('[value="host"] tbody');
  if (!tbody) return;

  tbody.innerHTML = host_sites.map(site => {
    const homepage = site.homepage ?? site.url;

    const icon = site.icon
      ? `<img src="images/${site.iconFile ?? site.discriminator}.png" alt="${site.name} Logo" class="${site.iconClass}">`
      : `<i class="fa-solid fa-cloud mr-1.5" style="color: #564ef0; font-size: 19px;"></i>`;

    let badges = "";
    if (site.api === "optional") badges += BADGE.api_optional;
    else if (site.api === "required") badges += BADGE.api_required;
    if (site.deletion) badges += BADGE.deletion;
    else if (site.api_deletion) badges += BADGE.api_deletion;
    if (site.video) badges += BADGE.video;
    if (site.unstable) badges += BADGE.unstable;

    const api_needed = site.api === "required" ? ` api_needed="${site.discriminator}"` : "";

    return `<tr class="alternate-row search-result">
          <td class="px-4 py-2 flex items-center mt-1.5">
            ${icon}
            ${site.name}&nbsp(<a class="text-sky-400 hover:underline" href="${homepage}" target="_blank">${homepage}</a>)
            ${badges}
          </td>
          <td class="px-4 py-2">${site.anonymous_specs[0]}</td>
          <td class="px-4 py-2">${site.anonymous_specs[1]}</td>
          <td class="px-4 py-2 text-center">
            <button class="bg-gradient-to-t from-rose-600 to-red-500 text-white px-4 py-2 rounded-lg transition duration-200 hover:scale-[1.02] hover:from-rose-500 hover:to-red-500 hover:shadow-[0_0px_30px_rgba(225,_29,_72,_0.2)] active:scale-110" value="upload_button" id="button_${site.key}"${api_needed}>Upload</button>
            <div id="select_box_container" class="hidden inline-flex items-center scale-[1.2]"><label class="relative flex items-center p-3 rounded-full cursor-pointer" for="checkbox" data-ripple-dark="true"><input type="checkbox" value="${site.discriminator}" class="relative w-5 h-5 transition-all border rounded-md appearance-none cursor-pointer peer before:absolute checked:border-rose-600 checked:bg-rose-600" id="select_box"/><div class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">${CHECKBOX_SVG}</div></label></div>
          </td>
        </tr>`;
  }).join("");
}

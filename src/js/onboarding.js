import { POPUPS, BUTTONS } from './globals.js';
import { init_check_host } from './check_host.js';

export function init_onboarding() {
  const ONBOARDING_KEY = 'onboarding_shown';

  BUTTONS.review_onboarding.addEventListener("click", () => {
    POPUPS.settings.classList.add('hidden');
    localStorage.removeItem(ONBOARDING_KEY);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setTimeout(() => {
      location.reload();
    }, 1000);
  })

  if (localStorage.getItem(ONBOARDING_KEY)) {
    init_check_host();
    return;
  }

  let history_hidden = false;

  if (BUTTONS.upload_history.classList.contains('hidden')) {
    BUTTONS.upload_history.classList.remove('hidden');
    history_hidden = true;
  }

  POPUPS.welcome.classList.remove('hidden');

  localStorage.setItem(ONBOARDING_KEY, 'true');
  
  const steps = [
    { selector: 'button[value="upload_button"]', text: 'Choose your desired host to start uploading.' },
    { selector: '#toggle_upload_mode', text: 'Enable multi-upload to send a file to multiple hosts at once.' },
    { selector: '#button_upload_profile', text: 'Create and use profiles to save time on repetitive tasks.' },
    { selector: '#upload_history_button', text: 'View your full upload history and manually delete files if needed.' },
    { selector: '#manage_api_keys_button', text: 'Manage API keys for hosts that require or support them.' },
    { selector: '#check_status_button', text: 'Check host status here; runs every 12h to disable offline hosts.' },
    { selector: '#settings_button', text: 'Open settings to, for example, add PolyUploader to the Windows context menu.' }
  ];

  let current_step = 0;

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.className = 'fixed inset-0 z-50';

  const tooltip = document.createElement('div');
  tooltip.id = 'onboarding-tooltip';
  tooltip.className = 'mr-3 absolute z-50 backdrop-blur-xl bg-white/10 p-2 rounded-2xl shadow-md text-center transition-all duration-200 border border-[#4c5666] hover:bg-white/12 hover:border-[#616e83] cursor-pointer text-white';

  const highlight = document.createElement('div');
  highlight.id = 'onboarding-highlight';
  highlight.className = 'absolute border-4 border-yellow-400 shadow-[0_5px_30px_rgba(250,_204,_21,_0.3)] rounded-2xl z-50 pointer-events-none';

  function show_step() {
    POPUPS.welcome.classList.add('hidden');

    document.body.appendChild(overlay);

    document.body.appendChild(highlight);

    document.body.appendChild(tooltip);
  
    const step = steps[current_step];

    const element = document.querySelector(step.selector);

    if (!element) { next_step(); return; }
    
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;

    tooltip.innerHTML = `<p class="text-center mt-2 text-slate-300">${current_step + 1}/${steps.length}</p><p class="p-3 text-center text-white text-lg">${step.text}</p><p class="mt-2 mb-1 text-gray-300 text-sm">Click anywhere to continue</p>`;

    const margin = 7;
    highlight.style.top = `${top - margin}px`;
    highlight.style.left = `${left - margin}px`;
    highlight.style.width = `${rect.width + margin*2}px`;
    highlight.style.height = `${rect.height + margin*2}px`;

    let tooltip_top;

    if (step.selector === '#check_status_button') {
      tooltip_top = top - rect.height - margin - 98;
    } else if (step.selector === '#settings_button') {
      tooltip_top = top - rect.height - margin - 118;
    } else {
      tooltip_top = top + rect.height + margin + 8;
    }

    if (step.selector === 'button[value="upload_button"]') {
      tooltip.style.left = `${left - 250}px`;
    } else {
      tooltip.style.left = `${left - 100}px`;
    }
    tooltip.style.top = `${tooltip_top}px`;
    
  }

  function next_step() {
    current_step++;
    if (current_step >= steps.length) {
      overlay.remove();
      highlight.remove();
      tooltip.remove();
      if (history_hidden) {
        BUTTONS.upload_history.classList.add('hidden');
      };

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      init_check_host();
    } else {
      show_step();
    }
  }

  overlay.addEventListener('click', next_step);
  tooltip.addEventListener('click', next_step);

  BUTTONS.start_tour.addEventListener('click', show_step);
  BUTTONS.ignore_onboarding.addEventListener('click', () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    if (history_hidden) {
      BUTTONS.upload_history.classList.add('hidden');
    }
    POPUPS.welcome.classList.add('hidden');
    init_check_host();
  });
}

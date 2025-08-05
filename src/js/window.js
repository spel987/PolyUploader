import { getCurrentWindow } from './tauri.js';
import { BUTTONS, STATE } from './globals.js';

export function init_window() {
    BUTTONS.close.addEventListener("click", async () => {
      await getCurrentWindow().close();
    });
    
    BUTTONS.minimize.addEventListener("click", async () => {
      await getCurrentWindow().minimize();
    });
    
    BUTTONS.maximize.addEventListener("click", async () => {
      if (STATE.window_status == "minimize") {
        await getCurrentWindow().maximize();
        STATE.window_status = "maximize";
      } else {
        await getCurrentWindow().unmaximize();
        STATE.window_status = "minimize";
      };
    });
};
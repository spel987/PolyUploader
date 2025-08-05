export const { getCurrentWindow } = window.__TAURI__.window;
export const { invoke, convertFileSrc } = window.__TAURI__.core;
export const { resolveResource } = window.__TAURI__.path;
export const { getVersion } = window.__TAURI__.app;
export const { check } = window.__TAURI__.updater;
export const { save, open } = window.__TAURI__.dialog;
export const { listen } = window.__TAURI__.event;
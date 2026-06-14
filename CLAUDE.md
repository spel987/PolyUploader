# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

PolyUploader is a Tauri 2 desktop app (Windows-only) that uploads a single file (from disk or a URL) to 130+ free file-hosting sites simultaneously. The Rust backend is thin; almost all logic lives in the vanilla-JS frontend. There is no frontend framework and no JS build step (except Tailwind CSS compilation).

## Commands

All commands run from the repository root.

```powershell
cargo tauri dev          # Run the app in dev mode (hot-ish; reads frontend from ../src)
cargo tauri build        # Build the NSIS installer -> src-tauri/target/release/bundle/
npm run tailwind         # Watch + compile src/input_tailwind.css -> src/styles.css
```

Prerequisites: Rust + `cargo install tauri-cli`. Node/npm are only needed if you touch the CSS.

There is **no test suite, linter, or CI**. Verification is manual via `cargo tauri dev`.

## Architecture

### Process model
- **Rust backend** (`src-tauri/src/main.rs`): a small set of `#[tauri::command]` handlers, mostly CRUD over JSON files in `Resources/` (profiles, history, API keys), plus `read_file_chunk` (streams a local file to JS in 1 MB chunks), zip import/export, and the Windows registry context-menu integration. On launch it calls `set_current_dir_to_exe_dir()` so all `Resources/...` relative paths resolve next to the executable. A CLI arg (`PolyUploader.exe <path>`) preloads a file and emits the `file_selected` event to the webview.
- **warp-cors proxy** (`src-tauri/warp-cors/`): a vendored, modified fork of [warp-cors](https://github.com/Bassetts/warp-cors) run as a library. `main.rs` spawns it on a background Tokio runtime at startup, listening on **port 61337**. The frontend bypasses browser CORS by prefixing every cross-origin request URL with `http://127.0.0.1:61337/` (the `URL_FOR_BYPASS_CORS` constant). The fork adds session-cookie handling: the proxy surfaces `x-set-cookie` response headers, and the frontend persists them in `localStorage` under `cookie:<domain>` and replays them (see `get_cookie_from_url` in `upload.js`).

### Frontend (`src/`)
- `index.html` — ~3700-line monolith containing all UI and the static host table (one `<tr>` per host).
- `js/globals.js` — central registry. Holds `HOST_SITES` (the source-of-truth array of every host), `BUTTONS_HOST` (per-host DOM button lookups), the cached DOM-element groups (`BUTTONS`, `SELECTS`, `POPUPS`, `INPUTS`, `ELEMENT_DISPLAYS`), the global mutable `STATE` object, and the env constants (`ENV`, `API_URL`, `URL_FOR_BYPASS_CORS`).
- `js/main.js` — entry point. Wires up all DOM event listeners, calls each module's `init_*()`, and registers every host's tooltip/terms via `upload_preparation(...)` (one call per host).
- `js/upload.js` — **the core, ~2900 lines.** `start_upload()` resolves the file then runs a giant `switch (current_host)` with **one `case` per host discriminator** implementing that host's specific upload flow. Most cases ultimately call the generic `upload_to_host(request_data, response_format, link_extraction, affix, manage_file)`, which performs the fetch, extracts the final link declaratively, computes expiration, writes history, and renders results. It also owns the post-upload UI: "copy all", share-link creation (via `API_URL`), the link-protection panel, and telemetry.
- Other modules: `api.js` (API-key management UI), `history.js`, `profiles.js`, `check_host.js` (online/offline polling, cached 12h in localStorage), `check_update.js`, `link_protection.js`, `drag_drop.js`, `search.js`, `sort_table.js`, `onboarding.js`, `window.js`, `windows_context_menu.js`, `import_export_data.js`, `utils.js` (shared helpers).
- `js/tauri.js` — thin re-export of the `window.__TAURI__` globals (`withGlobalTauri: true` is set in `tauri.conf.json`, so there is no `@tauri-apps/api` npm dependency). CryptoJS is loaded from a CDN `<script>` in `index.html`.

### How `upload_to_host` is parameterized
Each host case describes its behavior with data, not code, passed into `upload_to_host`:
- `request_data` = `[url, method, body, headers?]`.
- `response_format` = `"json"` or `"text"`.
- `link_extraction` describes how to pull the final URL from the response: a literal `https://...`, `["match", regex, groupIndex]`, `["replace", a, b]`, or a key-path array walked by `get_value_from_path` (see `utils.js`).
- `affix` = `[prefix, suffix]` wrapped around the extracted link.
- `manage_file` describes the deletion request (URL parts, method, params, headers) so the file can later be deleted from the History view. Supports special tokens like `"killcode"` and `"final_url"` for XFileSharing-style hosts.

Read `utils.js` helpers (`get_value_from_path`, `get_values_from_paths`, `resolve_value`, `get_retention_duration`, `get_site_name`) before editing extraction logic.

### Persistent data (`src-tauri/Resources/`)
JSON files act as the app's database, mutated only through Rust commands (never written directly from JS): `api_keys.json`, `history.json`, `profiles.json`. `prohibited_format.json` is read-only config mapping a discriminator to disallowed extensions (a leading `"*"` entry inverts it to an allow-list). These ship as bundle resources and live next to the exe at runtime.

## The "discriminator" concept (important)

Every host is keyed by a `discriminator` string, **not** its display name or primary URL. The discriminator is typically the domain that appears in the *final download link* a host returns (e.g. Catbox's discriminator is `files.catbox.moe`, Turbobit's is `torbobit.net`). It is the join key across `HOST_SITES`, the `switch` cases in `upload.js`, `prohibited_format.json`, the `upload_preparation` calls, and `localStorage` status keys. When a host serves links from a rotating/CDN domain, that alias is mapped back to the canonical discriminator in the `domain_name` table inside `get_site_name` (`utils.js`).

## Adding or modifying a host

A single host is defined across several places that must stay in sync:
1. `src/index.html` — add the table `<tr>` (name cell, icon, max size, retention, deletion, API columns) and a `button_<id>` element.
2. `src/js/globals.js` — add the button to `BUTTONS_HOST` and an entry to `HOST_SITES` (`url`, `discriminator`, `name`, `api`: `"no"|"optional"|"required"`, optional `anonymous_specs`/`connected_specs`, `bypass_check`).
3. `src/js/main.js` — add an `upload_preparation(BUTTONS_HOST.<id>, [discriminator], tooltip, termsUrl, apiKeyUrl?)` call.
4. `src/js/upload.js` — add a `case "<discriminator>":` in the `start_upload` switch.
5. Optionally `src-tauri/Resources/prohibited_format.json`, an icon in `src/images/`, and the README host table.

The `retention` value shown in the table cell is parsed back at runtime by `get_retention_duration` to compute expiration dates, so keep that cell's text in the expected format (e.g. `30 days`, `24 hours`, `infinite`, `depends on the file size`).

## Conventions & gotchas

- Code style is snake_case for JS functions/variables (unusual for JS, but consistent throughout). Match it.
- `STATE` in `globals.js` is shared mutable global state; `STATE.host` is sometimes a single discriminator string and sometimes an array (single vs. multiple upload mode) — handle both.
- `ENV` in `globals.js` is `"production"`, which enables anonymous telemetry (host names + dates only) POSTed to `API_URL`. Set to anything else to disable it during local work.
- The auto-updater points at `https://p-u.vercel.app/update-config` and is signed (pubkey in `tauri.conf.json`); bump `version` in **both** `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json` together for a release.
- `src-tauri/gen/schemas/*` is generated; don't hand-edit.
- Related repos (not in this tree): `PolyUploader-API` (share links, stats, telemetry, update endpoint) and `PolyUploader-website` (docs).

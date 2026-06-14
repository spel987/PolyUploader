// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs::{self, File};
use std::io::{Read, Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use std::time::Duration;

use mime_guess::from_path;
use serde::{Deserialize, Serialize};
use serde_json::{json, Map, Value};
use tauri::{command, Emitter, Manager, State};
use tokio::runtime::Builder;
use tokio::time::sleep;
use warp_cors::app::{run, Config};
use zip::read::ZipArchive;
use zip::write::SimpleFileOptions;
use zip::ZipWriter;

#[cfg(windows)]
use winreg::enums::*;
#[cfg(windows)]
use winreg::RegKey;

/// Local CORS-bypass proxy address (see `URL_FOR_BYPASS_CORS` in the frontend).
const PROXY_HOST: &str = "127.0.0.1";
const PROXY_PORT: u16 = 61337;

/// JSON files that make up the app's on-disk "database".
const DATA_FILES: [&str; 3] = ["api_keys.json", "history.json", "profiles.json"];

/// Pre-reverse-DNS data dir (releases <= 1.7.2), sibling of the current one.
const LEGACY_DATA_DIR_NAME: &str = "PolyUploader";

/// File path passed on the command line (`PolyUploader.exe <path>`).
struct FilePathState(Mutex<Option<String>>);

/// Resolved, writable directory where the JSON data files live.
struct AppPaths {
    data_dir: PathBuf,
}

impl AppPaths {
    fn file(&self, name: &str) -> PathBuf {
        self.data_dir.join(name)
    }
}

#[derive(Serialize, Deserialize, Clone)]
struct FileInfo {
    name: String,
    size: u64,
    mime_type: String,
    path: String,
}

fn read_json(path: &Path) -> Result<Value, String> {
    let contents =
        fs::read_to_string(path).map_err(|e| format!("failed to read {}: {e}", path.display()))?;

    if contents.trim().is_empty() {
        return Ok(json!({}));
    }

    serde_json::from_str(&contents).map_err(|e| format!("invalid JSON in {}: {e}", path.display()))
}

fn write_json(path: &Path, value: &Value) -> Result<(), String> {
    let json_str = serde_json::to_string_pretty(value).map_err(|e| e.to_string())?;
    fs::write(path, json_str).map_err(|e| format!("failed to write {}: {e}", path.display()))
}

/// Read a JSON object, let `mutate` edit it in place, then write it back.
fn update_json_object<F>(path: &Path, mutate: F) -> Result<(), String>
where
    F: FnOnce(&mut Map<String, Value>),
{
    let mut value = read_json(path)?;
    let object = value
        .as_object_mut()
        .ok_or_else(|| format!("expected a JSON object in {}", path.display()))?;
    mutate(object);
    write_json(path, &value)
}

/// Seed the data dir on first launch, restoring from a legacy location if found.
fn init_data_files(data_dir: &Path) {
    let _ = fs::create_dir_all(data_dir);

    let mut legacy_dirs: Vec<PathBuf> = Vec::new();
    if let Some(parent) = data_dir.parent() {
        legacy_dirs.push(parent.join(LEGACY_DATA_DIR_NAME));
    }
    if let Some(resources) = env::current_exe()
        .ok()
        .and_then(|exe| exe.parent().map(|p| p.join("Resources")))
    {
        legacy_dirs.push(resources);
    }

    for filename in DATA_FILES {
        let target = data_dir.join(filename);
        if target.exists() {
            continue;
        }

        let restored = legacy_dirs.iter().any(|dir| {
            let source = dir.join(filename);
            source.exists() && fs::copy(&source, &target).is_ok()
        });

        if !restored {
            let _ = fs::write(&target, "{}");
        }
    }
}

fn get_mime_type(filename: &str) -> String {
    from_path(filename)
        .first_or_octet_stream()
        .essence_str()
        .to_string()
}

#[command]
fn get_selected_file(state: State<'_, FilePathState>) -> Option<FileInfo> {
    let path = state.0.lock().ok()?.clone()?;
    let metadata = fs::metadata(&path).ok()?;

    let name = Path::new(&path)
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();

    Some(FileInfo {
        mime_type: get_mime_type(&name),
        name,
        size: metadata.len(),
        path,
    })
}

#[command]
fn get_data_dir(paths: State<'_, AppPaths>) -> String {
    paths.data_dir.to_string_lossy().to_string()
}

#[command]
fn read_file_chunk(path: String, start: u64, length: u64) -> Result<Vec<u8>, String> {
    let mut file = File::open(&path).map_err(|e| e.to_string())?;
    file.seek(SeekFrom::Start(start)).map_err(|e| e.to_string())?;

    let mut buffer = vec![0u8; length as usize];
    let bytes_read = file.read(&mut buffer).map_err(|e| e.to_string())?;

    buffer.truncate(bytes_read);
    Ok(buffer)
}

// camelCase params + `non_snake_case`: they must match the frontend's invoke() keys.

#[command]
#[allow(non_snake_case)]
fn add_profile_json(
    paths: State<'_, AppPaths>,
    profileName: &str,
    selectedHost: Vec<String>,
) -> Result<(), String> {
    update_json_object(&paths.file("profiles.json"), |profiles| {
        profiles.insert(profileName.to_string(), json!(selectedHost));
    })
}

#[command]
#[allow(non_snake_case)]
fn delete_profile_json(paths: State<'_, AppPaths>, profileName: &str) -> Result<(), String> {
    update_json_object(&paths.file("profiles.json"), |profiles| {
        profiles.remove(profileName);
    })
}

#[command]
#[allow(non_snake_case)]
fn rename_profile_json(
    paths: State<'_, AppPaths>,
    oldProfileName: &str,
    newProfileName: &str,
) -> Result<(), String> {
    update_json_object(&paths.file("profiles.json"), |profiles| {
        if let Some(profile) = profiles.remove(oldProfileName) {
            profiles.insert(newProfileName.to_string(), profile);
        }
    })
}

#[command]
#[allow(non_snake_case)]
fn add_history_json(
    paths: State<'_, AppPaths>,
    newLink: &str,
    newUploadDate: &str,
    newExpirationDate: &str,
    manageLink: &str,
    deleteMethod: &str,
    deleteParameters: &str,
    deleteHeaders: &str,
    formattedRequest: &str,
    uploadFilename: &str,
) -> Result<(), String> {
    let delete_parameters: Value =
        serde_json::from_str(deleteParameters).map_err(|e| e.to_string())?;
    let delete_headers: Value = serde_json::from_str(deleteHeaders).map_err(|e| e.to_string())?;

    update_json_object(&paths.file("history.json"), |history| {
        history.insert(
            newLink.to_string(),
            json!({
                "date_upload": newUploadDate,
                "date_expires": newExpirationDate,
                "manage": [manageLink, deleteMethod, delete_parameters, delete_headers, formattedRequest],
                "filename": uploadFilename,
            }),
        );
    })
}

#[command]
fn clear_history_json(paths: State<'_, AppPaths>) -> Result<(), String> {
    write_json(&paths.file("history.json"), &json!({}))
}

#[command]
#[allow(non_snake_case)]
fn delete_history_link(paths: State<'_, AppPaths>, historyLink: &str) -> Result<(), String> {
    update_json_object(&paths.file("history.json"), |history| {
        history.remove(historyLink);
    })
}

#[command]
#[allow(non_snake_case)]
fn update_api_key(paths: State<'_, AppPaths>, hostName: &str, apiKey: &str) -> Result<(), String> {
    update_json_object(&paths.file("api_keys.json"), |keys| {
        keys.insert(hostName.to_string(), json!(apiKey));
    })
}

#[command]
#[allow(non_snake_case)]
fn delete_api_key(paths: State<'_, AppPaths>, hostName: &str) -> Result<(), String> {
    update_json_object(&paths.file("api_keys.json"), |keys| {
        keys.remove(hostName);
    })
}

#[command]
#[allow(non_snake_case)]
fn create_zip(paths: State<'_, AppPaths>, zipPath: &str) -> Result<String, String> {
    let file = File::create(zipPath).map_err(|e| e.to_string())?;
    let mut zip = ZipWriter::new(file);
    let options = SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Stored)
        .unix_permissions(0o755);

    for filename in DATA_FILES {
        let data = match fs::read(paths.file(filename)) {
            Ok(data) => data,
            Err(_) => continue, // skip files that don't exist yet
        };
        zip.start_file(filename, options).map_err(|e| e.to_string())?;
        zip.write_all(&data).map_err(|e| e.to_string())?;
    }

    zip.finish().map_err(|e| e.to_string())?;
    Ok("Zip file created successfully".to_string())
}

#[command]
#[allow(non_snake_case)]
fn extract_zip(paths: State<'_, AppPaths>, zipPath: &str) -> Result<String, String> {
    let file = File::open(zipPath).map_err(|e| e.to_string())?;
    let mut archive = ZipArchive::new(file).map_err(|e| e.to_string())?;

    for i in 0..archive.len() {
        let mut entry = archive.by_index(i).map_err(|e| e.to_string())?;

        let name = entry.name().to_string();
        if name.ends_with('/') {
            continue;
        }

        // Only restore known data files, by base name, to prevent zip-slip.
        let base = match Path::new(&name).file_name() {
            Some(base) => base.to_string_lossy().to_string(),
            None => continue,
        };
        if !DATA_FILES.contains(&base.as_str()) {
            continue;
        }

        let mut outfile = File::create(paths.file(&base)).map_err(|e| e.to_string())?;
        std::io::copy(&mut entry, &mut outfile).map_err(|e| e.to_string())?;
    }

    Ok("Zip file extracted successfully".to_string())
}

#[cfg(windows)]
#[command]
fn register_polyuploader_context_menu(action: String) -> Result<String, String> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let classes = hkcu
        .open_subkey_with_flags("Software\\Classes", KEY_WRITE)
        .map_err(|e| format!("Error opening HKCU\\Software\\Classes: {e}"))?;

    match action.as_str() {
        "add" => {
            let exe_dir = env::current_exe()
                .map_err(|e| format!("Error exe recovery: {e}"))?
                .parent()
                .ok_or("Unable to retrieve the executable folder")?
                .to_path_buf();

            let icon_path = exe_dir.join("Resources").join("icon.ico");
            let exe_path = exe_dir.join("PolyUploader.exe");

            let (key, _) = classes
                .create_subkey(r#"*\shell\PolyUploader"#)
                .map_err(|e| format!("Error: {e}"))?;

            key.set_value("", &"Upload with PolyUploader")
                .map_err(|e| e.to_string())?;
            key.set_value("Icon", &icon_path.to_string_lossy().to_string())
                .map_err(|e| e.to_string())?;

            let (cmd_key, _) = key
                .create_subkey("command")
                .map_err(|e| format!("Error: {e}"))?;
            cmd_key
                .set_value("", &format!("\"{}\" \"%1\"", exe_path.to_string_lossy()))
                .map_err(|e| e.to_string())?;

            Ok("Success".to_string())
        }

        "remove" => classes
            .delete_subkey_all(r#"*\shell\PolyUploader"#)
            .map(|_| "Success".to_string())
            .map_err(|e| format!("Error: {e}")),

        _ => Err("Invalid action".to_string()),
    }
}

#[cfg(not(windows))]
#[command]
fn register_polyuploader_context_menu(_action: String) -> Result<String, String> {
    Err("Context menu only available on Windows".to_string())
}

/// Run the bundled warp-cors proxy on its own runtime in a background thread.
fn spawn_cors_proxy() {
    std::thread::spawn(|| {
        let rt = Builder::new_multi_thread()
            .enable_all()
            .build()
            .expect("failed to build the proxy runtime");

        rt.block_on(run(Config {
            host: PROXY_HOST.into(),
            port: PROXY_PORT,
        }));
    });
}

fn main() {
    // Work around a WebKitGTK rendering glitch on some Linux GPUs/drivers.
    #[cfg(target_os = "linux")]
    if std::env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }

    spawn_cors_proxy();

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(FilePathState(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            add_profile_json,
            delete_profile_json,
            rename_profile_json,
            add_history_json,
            clear_history_json,
            delete_history_link,
            update_api_key,
            delete_api_key,
            create_zip,
            extract_zip,
            get_selected_file,
            read_file_chunk,
            get_data_dir,
            register_polyuploader_context_menu
        ])
        .setup(|app| {
            let data_dir = app
                .path()
                .app_data_dir()
                .expect("failed to resolve the app data directory");
            init_data_files(&data_dir);
            app.manage(AppPaths { data_dir });

            // A file path passed on the command line preloads it in the webview.
            if let Some(file_path) = env::args().nth(1) {
                *app.state::<FilePathState>().0.lock().unwrap() = Some(file_path);

                let app_handle = app.handle().clone();
                tauri::async_runtime::spawn(async move {
                    // Give the webview a moment to register its listener.
                    sleep(Duration::from_millis(1000)).await;
                    if let Some(window) = app_handle.get_webview_window("main") {
                        if let Err(e) = window.emit("file_selected", ()) {
                            eprintln!("Error during event transmission: {e:?}");
                        }
                    }
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

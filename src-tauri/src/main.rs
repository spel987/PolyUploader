// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{json, Value};
use std::env;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use zip::read::ZipArchive;
use zip::write::FileOptions;
use zip::ZipWriter;
use tauri::{command, State, Manager, Emitter};
use serde::{Serialize, Deserialize};
use std::time::Duration;
use tokio::time::sleep;
use mime_guess::from_path;
use std::sync::Mutex;
use tokio::runtime::Builder;
use warp_cors::app::{Config, run};

#[cfg(windows)]
use winreg::enums::*;
#[cfg(windows)]
use winreg::RegKey;

struct FilePathState(Mutex<Option<String>>);

#[derive(Serialize, Deserialize, Clone)]
struct FileInfo {
    name: String,
    size: u64,
    mime_type: String,
    path: String,
}

#[command]
fn get_selected_file(state: State<'_, FilePathState>) -> Option<FileInfo> {
    if let Some(path) = &*state.0.lock().unwrap() {
        if let Ok(metadata) = std::fs::metadata(path) {
            let file_name = std::path::Path::new(path)
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string();
            
            let mime_type = get_mime_type(&file_name);

            return Some(FileInfo {
                name: file_name,
                size: metadata.len(),
                mime_type,
                path: path.clone(),
            });
        }
    }
    None
}

fn get_mime_type(filename: &str) -> String {
    from_path(filename)
        .first_or_octet_stream()
        .essence_str()
        .to_string()
}

#[tauri::command]
fn read_file_chunk(path: String, start: u64, length: u64) -> Result<Vec<u8>, String> {
    use std::io::{Seek, SeekFrom, Read};

    let mut file = File::open(&path).map_err(|e| e.to_string())?;
    file.seek(SeekFrom::Start(start)).map_err(|e| e.to_string())?;

    let mut buffer = vec![0u8; length as usize];
    let bytes_read = file.read(&mut buffer).map_err(|e| e.to_string())?;

    buffer.truncate(bytes_read);
    Ok(buffer)
}

#[tauri::command]
fn add_profile_json(profileName: &str, selectedHost: Vec<&str>) {
    let profiles_file_path = "Resources/profiles.json";

    let mut file = File::open(profiles_file_path.clone()).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let mut json: Value = serde_json::from_str(&contents).unwrap();

    let selectedHost: Vec<Value> = selectedHost
        .iter()
        .map(|v| Value::String(v.to_string()))
        .collect();
    json[profileName] = Value::Array(selectedHost);

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(profiles_file_path)
        .unwrap();

    let json_str = serde_json::to_string_pretty(&json).unwrap();

    file.write_all(json_str.as_bytes()).unwrap();
}

#[tauri::command]
fn delete_profile_json(profileName: &str) {
    let profiles_file_path = "Resources/profiles.json";

    let mut file = File::open(profiles_file_path.clone()).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let mut json: Value = serde_json::from_str(&contents).unwrap();

    json.as_object_mut().unwrap().remove(profileName);

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(profiles_file_path)
        .unwrap();

    let json_str = serde_json::to_string_pretty(&json).unwrap();

    file.write_all(json_str.as_bytes()).unwrap();
}

#[tauri::command]
fn rename_profile_json(oldProfileName: &str, newProfileName: &str) {
    let profiles_file_path = "Resources/profiles.json";

    let mut file = File::open(profiles_file_path.clone()).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let mut json: Value = serde_json::from_str(&contents).unwrap();

    if let Some(profile) = json.as_object_mut().unwrap().remove(oldProfileName) {
        json[newProfileName] = profile;
    }

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(profiles_file_path)
        .unwrap();

    let json_str = serde_json::to_string_pretty(&json).unwrap();

    file.write_all(json_str.as_bytes()).unwrap();
}

#[tauri::command]
fn add_history_json(newLink: &str, newUploadDate: &str, newExpirationDate: &str, manageLink: &str, deleteMethod: &str, deleteParameters: &str, deleteHeaders: &str, formattedRequest: &str, uploadFilename: &str) {
    let history_file_path = "Resources/history.json";

    let mut file = File::open(history_file_path.clone()).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let mut json: Value = serde_json::from_str(&contents).unwrap();

    let data_json_value: Value = serde_json::from_str(deleteParameters).unwrap();
    let headers_json_value: Value = serde_json::from_str(deleteHeaders).unwrap();

    let new_info = json!({
        "date_upload": newUploadDate,
        "date_expires": newExpirationDate,
        "manage": [manageLink, deleteMethod, data_json_value, headers_json_value, formattedRequest],
        "filename": uploadFilename
    });

    json[newLink] = new_info;

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(history_file_path)
        .unwrap();

    let json_str = serde_json::to_string_pretty(&json).unwrap();

    file.write_all(json_str.as_bytes()).unwrap();
}

#[tauri::command]
fn clear_history_json() {
    let history_file_path = "Resources/history.json";
    let mut file = File::create(history_file_path).expect("Unable to create JSON file.");

    let empty_json = json!({});
    let json_str =
        serde_json::to_string_pretty(&empty_json).expect("Unable to serialize empty JSON.");

    file.write_all(json_str.as_bytes())
        .expect("Unable to write JSON file.");
}

#[tauri::command]
fn delete_history_link(historyLink: &str) {
    let history_file_path = "Resources/history.json";

    let mut file = File::open(history_file_path.clone()).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let mut json: Value = serde_json::from_str(&contents).unwrap();

    json.as_object_mut().unwrap().remove(historyLink);

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(history_file_path)
        .unwrap();

    let json_str = serde_json::to_string_pretty(&json).unwrap();

    file.write_all(json_str.as_bytes()).unwrap();
}

#[tauri::command]
fn update_api_key(hostName: &str, apiKey: &str) {
    let api_keys_file_path = "Resources/api_keys.json";

    let mut file = File::open(api_keys_file_path.clone()).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let mut json: Value = serde_json::from_str(&contents).unwrap();

    json[hostName] = json!(apiKey);

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(api_keys_file_path)
        .unwrap();

    let json_str = serde_json::to_string_pretty(&json).unwrap();

    file.write_all(json_str.as_bytes()).unwrap();
}

#[tauri::command]
fn delete_api_key(hostName: &str) {
    let api_keys_file_path = "Resources/api_keys.json";

    let mut file = File::open(api_keys_file_path.clone()).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let mut json: Value = serde_json::from_str(&contents).unwrap();

    json.as_object_mut().unwrap().remove(hostName);

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(api_keys_file_path)
        .unwrap();

    let json_str = serde_json::to_string_pretty(&json).unwrap();

    file.write_all(json_str.as_bytes()).unwrap();
}

#[tauri::command]
fn create_zip(zipPath: &str) -> String {
    let path = std::path::Path::new(zipPath);

    if let Ok(file) = File::create(&path) {
        let files = vec![
            "Resources/api_keys.json",
            "Resources/history.json",
            "Resources/profiles.json",
        ];
        let mut zip = ZipWriter::new(file);

        let options = FileOptions::default()
            .compression_method(zip::CompressionMethod::Stored)
            .unix_permissions(0o755);

        for filename in files {
            if let Ok(mut f) = File::open(filename) {
                let mut buffer = Vec::new();
                if let Ok(_) = f.read_to_end(&mut buffer) {
                    if let Ok(_) = zip.start_file(filename, options) {
                        let _ = zip.write_all(&buffer);
                    }
                }
            }
        }

        let _ = zip.finish();
    }

    "Zip file created successfully".to_string()
}

#[tauri::command]
fn extract_zip(zipPath: &str) -> String {
    let root_dir = Path::new(".");

    if let Ok(file) = File::open(&Path::new(zipPath)) {
        if let Ok(mut archive) = ZipArchive::new(file) {
            for i in 0..archive.len() {
                if let Ok(mut file) = archive.by_index(i) {
                    let outpath = root_dir.join(file.name());

                    if (*file.name()).ends_with('/') {
                        let _ = std::fs::create_dir_all(&outpath);
                    } else {
                        if let Some(p) = outpath.parent() {
                            if !p.exists() {
                                let _ = std::fs::create_dir_all(&p);
                            }
                        }
                        if let Ok(mut outfile) = File::create(&outpath) {
                            let _ = std::io::copy(&mut file, &mut outfile);
                        }
                    }
                }
            }
        }
    }

    "Zip file extracted successfully".to_string()
}

#[cfg(windows)]
#[tauri::command]
fn register_polyuploader_context_menu(action: String) -> Result<String, String> {
    match action.as_str() {
        "add" => {
            let exe_path: PathBuf = env::current_exe()
                .map_err(|e| format!("Error exe recovery: {}", e))?
                .parent()
                .ok_or("Unable to retrieve the executable folder")?
                .to_path_buf();

            let icon_path = exe_path.join("Resources").join("icon.ico");
            let exe_full_path = exe_path.join("PolyUploader.exe");

            let hkcu = RegKey::predef(HKEY_CURRENT_USER);
            let software_classes = hkcu
                .open_subkey_with_flags("Software\\Classes", KEY_WRITE)
                .map_err(|e| format!("Error opening HKCU\\Software\\Classes: {}", e))?;

            let (key, _) = software_classes
                .create_subkey(r#"*\shell\PolyUploader"#)
                .map_err(|e| format!("Error: {}", e))?;

            key.set_value("", &"Upload with PolyUploader")
                .map_err(|e| e.to_string())?;
            key.set_value("Icon", &icon_path.to_string_lossy().to_string())
                .map_err(|e| e.to_string())?;

            let (cmd_key, _) = key
                .create_subkey("command")
                .map_err(|e| format!("Error: {}", e))?;

            let command_str = format!(
                "\"{}\" \"%1\"",
                exe_full_path.to_string_lossy().to_string()
            );
            cmd_key
                .set_value("", &command_str)
                .map_err(|e| e.to_string())?;

            Ok("Success".to_string())
        }

        "remove" => {
            let hkcu = RegKey::predef(HKEY_CURRENT_USER);
            let software_classes = hkcu
                .open_subkey_with_flags("Software\\Classes", KEY_WRITE)
                .map_err(|e| format!("Error opening HKCU\\Software\\Classes: {}", e))?;

            match software_classes.delete_subkey_all(r#"*\shell\PolyUploader"#) {
                Ok(_) => Ok("Success".to_string()),
                Err(e) => Err(format!("Error: {}", e)),
            }
        }

        _ => Err("Invalid action".to_string()),
    }
}

#[cfg(not(windows))]
#[tauri::command]
fn register_polyuploader_context_menu() -> Result<String, String> {
    Err("Context menu only available on Windows".to_string())
}

fn set_current_dir_to_exe_dir() {
    if let Ok(exe_path) = env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let _ = env::set_current_dir(&exe_dir);
        }
    }
}

fn main() {
    set_current_dir_to_exe_dir();

    std::thread::spawn(|| {
        let rt = Builder::new_multi_thread()
            .enable_all()
            .build()
            .unwrap();
        let cfg = Config { host: "0.0.0.0".into(), port: 61337 };
        rt.block_on(run(cfg));
    });

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
            register_polyuploader_context_menu
        ])
        .setup(|app| {
            let args: Vec<String> = std::env::args().collect();
            
            if args.len() > 1 {
                let file_path = args[1].clone();
                
                *app.state::<FilePathState>().0.lock().unwrap() = Some(file_path);
                
                let app_handle = app.handle().clone();
                
                tauri::async_runtime::spawn(async move {
                    sleep(Duration::from_millis(1000)).await;
                    if let Some(window) = app_handle.get_webview_window("main") {
                        match window.emit("file_selected", ()) {
                            Ok(_) => println!("A file has been successfully loaded. Select one or more hosts to begin uploading."),
                            Err(e) => println!("Error during event transmission: {:?}", e),
                        }
                    }
                });
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
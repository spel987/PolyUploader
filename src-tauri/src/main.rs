// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{Value, json};
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::env;
use std::process::Command;
use std::os::windows::process::CommandExt;
use zip::write::FileOptions;
use zip::ZipWriter;
use std::path::Path;
use zip::read::ZipArchive;
static mut CHILD_PID: Option<u32> = None;

#[tauri::command]
fn add_profile_json(profileName: &str, selectedHost: Vec<&str>) {
    let profiles_file_path = "Resources/profiles.json";

    let mut file = File::open(profiles_file_path.clone()).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let mut json: Value = serde_json::from_str(&contents).unwrap();

    let selectedHost: Vec<Value> = selectedHost.iter().map(|v| Value::String(v.to_string())).collect();
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
fn add_history_json(newLink: &str, newUploadDate: &str, newExpirationDate: &str, manageLink: &str, deleteMethod: &str, deleteParameters: &str, deleteHeaders: &str) {
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
        "manage": [manageLink, deleteMethod, data_json_value, headers_json_value]
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
    let json_str = serde_json::to_string_pretty(&empty_json).expect("Unable to serialize empty JSON.");

    file.write_all(json_str.as_bytes()).expect("Unable to write JSON file.");
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
        let files = vec!["Resources/api_keys.json", "Resources/history.json", "Resources/profiles.json"];
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

#[tauri::command]
fn kill_warp_cors() {
    let CREATE_NO_WINDOW = 0x08000000;
    unsafe {
        if let Some(child_pid) = CHILD_PID {
            let kill_result: Result<(), std::io::Error> = Command::new("cmd")
                .args(["/C", "taskkill", "/PID", &child_pid.to_string(), "/T", "/F"])
                .creation_flags(CREATE_NO_WINDOW)
                .spawn()
                .map(|_| ());
        }
    }
}

fn main() {
    let CREATE_NO_WINDOW = 0x08000000;

    let child = Command::new("cmd")
        .args(["/C", "cd", "Resources", "&", "warp-cors.exe", "--port", "61337"])
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .expect("Error launching warp-cors server process");

    unsafe {
        CHILD_PID = Some(child.id());
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_profile_json, delete_profile_json, rename_profile_json, add_history_json, clear_history_json, kill_warp_cors, update_api_key, delete_api_key, create_zip, extract_zip])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

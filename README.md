# Automatic-File-Uploader 
## Upload your files remotely to different hosting sites.


This project lets you upload your files remotely to different hosting sites.

<h1 align="center">
<a href="#"><img src="https://i.imgur.com/KHRMPL8.png"></a>
</h1>
### [The official website with documentation and code details](https://spel987.github.io/Automatic-File-Uploader/)
# Installation

### - Use the application by compiling it by hand:

- Install the latest version of Rust: https://www.rust-lang.org/tools/install

- Install Tauri-CLI with this command:

```
cargo install tauri-cli
```

- Start compilation with this command:

```
tauri build
```

You'll find the installer in the `.\src-tauri\target\release\bundle` folder.
### - Or simply download and run the [release](https://github.com/spel987/Automatic-File-Uploader/releases/latest).

Additional information: I'm not providing a portable version at the moment. In fact, Tauri creates a `C:\Users\<User>\AppData\Local\Automatic-File-Uploader` folder containing the data required by the Webview.

# Use

Currently, my application supports **45 hosting sites**.

So you can upload your files remotely and get the download link created. You can also upload your file to several hosts simultaneously and retrieve all the links created.

I've provided predefined profiles to simplify things, but if you like, you can create your own profiles with your chosen hosts. Rename them, change hosts and, if necessary, delete them. 

You have access to a history of links created, showing its upload date and the time remaining before it expires. When your file has expired, this is indicated. You can easily clear the history.

Every 12 hours, a check is made to see if the hosts are still online. If this is not the case, the script makes it unavailable.

You can manually delete the file uploaded to the host from the history, provided that the host is able to delete it and offers the ability to do so. You'll find a list below.

# Code and precision

For some sites, I use their supplied API, for others, I've converted their curl command to JS, and for yet others, I've simply imitated the request made to the server when sending files via their website.

For some sites, I was getting the famous "Access-Control-Allow-Origin" error. To counter this, I found and used a GitHub repository: https://github.com/Bassetts/warp-cors. 

I use the `warp-cors.exe` executable that I've integrated into my application's resources. This executable is launched when the application is started and closes when it is closed. It opens an HTTP server on port 61337 and I make my requests not to the URL directly but to `http://127.0.0.1:61337/https://example.com`. I'll let you have a look at the Bassetts repository if you're interested! 

This part of the code in the `main.rs` file opens the `warp-cors.exe` executable file and then closes it with the function below.

```rs
// main.rs

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

	//...
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
```

And in the `script.js` file I pass requests through this server.

```js
// script.js

const url_for_bypass_cors = "http://127.0.0.1:61337"

else if (current_host === "oshi.at") {
   sent_data_form.append("f", file_to_upload);
   sent_data_form.append("expire", "120");
   upload_to_host([url_for_bypass_cors + "https://oshi.at/", "POST", sent_data_form], "text", ["match", /(?<=DL: )\S+/, 0], [], [["match", /(?<=MANAGE: )\S+/], "GET", {}, ["", "?delete=1"]]);
}
```

# Currently supported hosts

Below is a table of the hosting providers currently supported by the application.
<table></table>

| Name | Url | Max files size | Time to file expiration | Uses warp-cors to work | Supports manual deletion |
| ---- | ---- | ---- | ---- | ---- | ---- |
| Gofile | https://gofile.io | infinite | 10 days | Yes | ✅ |
| Litterbox | https://litterbox.catbox.moe | 1GB | 24 hours | Yes | ❌ |
| File.io | https://file.io | 2GB | 14 days | No | ❌ |
| TmpFiles.org | https://tmpfiles.org | 100MB | 1 hour | No | ❌ |
| 0x0.st | https://0x0.st | 512MB | depends on the size of your file* | Yes | ❌ |
| c-v.sh | https://c-v.sh | 4GB | depends on the size of your file* | Yes | ❌ |
| ki.tc | https://ki.tc | 400MB | depends on the size of your file* | Yes | ❌ |
| Oshi.at | https://oshi.at | 5GB | 2 hours | Yes | ✅ |
| Filebin | https://filebin.net | infinite | 7 days | Yes | ✅ |
| transfer.sh | https://transfer.sh | 10GB | 14 days | Yes | ❌ |
| bashupload | https://bashupload.com | 50GB | 3 days | Yes | ❌ |
| Curl.by | https://curl.by | 32MB | 30 days | Yes | ❌ |
| x0.at | https://x0.at | 50MB | depends on the size of your file* | Yes | ❌ |
| Uplooad | https://uplooad.net | 1GB | 2 days | Yes | ✅ |
| Tommo.team | https://tommo.team | 4GB | 30 days | Yes | ❌ |
| tempfiles.ninja | https://tempfiles.ninja | 100MB | 24 hours | Yes | ✅ |
| Pixeldrain | https://pixeldrain.com | 20GB | 90 days | Yes | ❌ |
| 1Cloudfile | https://1cloudfile.com | 5GB | 30 days | Yes | ✅ |
| Bowfile | https://bowfile.com | 5GB | 30 days | Yes | ✅ |
| Uploadify | https://uploadify.net | 2GB | infinite | Yes | ✅ |
| AnonTransfer | https://anontransfer.com | 1GB | 30 days | Yes | ❌ |
| AnonSharing | https://anonsharing.com | 1GB | 180 days | Yes | ✅ |
| Temp.sh | https://temp.sh | 4GB | 3 days | Yes | ❌ |
| Uguu.se | https://uguu.se | 32MB | 3 hours | Yes | ❌ |
| Nopaste | https://nopaste.net | 2GB | 21 days | Yes | ❌ |
| udrop | https://udrop.com | 10GB | infinite | Yes | ✅ |
| Tempsend | https://tempsend.com | 2GB | 7 days | Yes | ❌ |
| 1fichier | https://1fichier.com | infinite | infinite | Yes | ✅ |
| Turbobit | https://turbobit.net | 200MB | infinite | Yes | ❌ |
| Hitfile | https://hitfile.net | 100GB | 30 days | Yes | ❌ |
| file-upload.org | https://file-upload.org | 200MB | 60 days | Yes | ✅ |
| HexUpload | https://hexload.com | 2GB | 60 days | Yes | ✅ |
| Mexa.sh | https://mexa.sh | 500MB | 60 days | Yes | ✅ |
| RapidFileShare | http://rapidfileshare.net | 512MB | 5 days | Yes | ✅ |
| Send.cm | https://send.cm | 100GB | 15 days | Yes | ❌ |
| up-load.io | https://up-load.io | 100MB | infinite | Yes | ✅ |
| Usercloud | https://usercloud.com | 5GB | infinite | Yes | ✅ |
| FileTmp | https://filetmp.com | 300MB | infinite | Yes | ❌ |
| UsersDrive | https://usersdrive.com | 2.25GB | 10 days | Yes | ✅ |
| Download.gg | https://download.gg | 25GB | infinite | Yes | ✅ |
| MegaUp | https://megaup.net | 5GB | 60 days | Yes | ✅ |
| KrakenFiles | https://krakenfiles.com | 1GB | 30 days | Yes | ❌ |
| Clicknupload | https://clicknupload.click | 2GB | 7 days | Yes | ✅ |
| Daily Uploads | https://dailyuploads.net | 4GB | 10 days | Yes | ✅ |
| Upload.ee | https://upload.ee | 100MB | 50 days | Yes | ✅ |

In all, Automatic-File-Uploader lets you upload your files to **45 different hosts** !

If you know of a host that has an API or just a CLI interface (without token or authentication key), please open an [issue](https://github.com/spel987/Automatic-File-Uploader/issues).

  *\* : "depends on the size of your file" means that the host keeps your files according to their weight. They use different algorithms. For more information, please visit the chosen site.*

# Made by and with

By:
- Spel<br>
    Email: `spel987@pm.me`<br>
    GitHub: https://github.com/spel987

With:
- Rust: https://www.rust-lang.org
- Tauri: https://tauri.app/
- Tailwind CSS: https://tailwindcss.com/
- Flaticon (and author [Ilham Fitrotul Hayat](https://www.flaticon.com/authors/ilham-fitrotul-hayat)): https://www.flaticon.com/free-icon/upload_2763883
- warp-cors: https://github.com/Bassetts/warp-cors
- All the sites listed in the table above

# Suggestions

If you have any questions or suggestions, please open an [issue](https://github.com/spel987/Automatic-File-Uploader/issues).
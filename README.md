# Automatic-File-Uploader 
## Upload your files remotely to different hosting sites.


This project lets you upload your files remotely to different hosting sites.

<h1 align="center">
<a href="#"><img src="https://i.imgur.com/8oTYP4D.png"></a>
</h1>

# Installation

### - Use the application by compiling it by hand :

- Install the latest version of Rust : https://www.rust-lang.org/tools/install

- Install Tauri-CLI with this command:

```
cargo install tauri-cli
```

- Start compilation with this command:

```
cargo tauri build
```

You'll find the installer in the `.\src-tauri\target\release\bundle` folder.
### - Or simply download and run the [realease](https://github.com/spel987/Automatic-File-Uploader/releases/latest).

Additional information: I'm not providing a portable version at the moment. In fact, Tauri creates a `C:\Users\<User>\AppData\Local\Automatic-File-Uploader` folder containing the data required by the Webview.

# Use

Currently, my application supports **43 hosting sites**.

So you can upload your files remotely and get the download link created. You can also upload your file to several hosts simultaneously and retrieve all the links created.

I've provided predefined profiles to simplify things, but if you like, you can create your own profiles with your chosen hosts. Rename them, change hosts and, if necessary, delete them. 

You have access to a history of links created, showing its upload date and the time remaining before it expires. When your file has expired, this is indicated. You can easily clear the history.

Every day, a check is made to see if the hosts are still online. If this is not the case, the script makes it unavailable.

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
		.args(["/C", "cd", "Resources", "&&", "warp-cors.exe", "--port", "61337"])
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
   upload_to_host([url_for_bypass_cors + "https://oshi.at/", "POST", sent_data_form], "text", ["match", /(?<=DL: )\S+/], [], [["match", /(?<=MANAGE: )\S+/], "GET"]);
}
```

# Currently supported hosts

Below is a table of the hosting providers currently supported by the application.
<table></table>

| Name  | Url | Max files size | Time to file expiration | Uses warp-cors to work |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Gofile  | https://gofile.io  | infinite  | 10d | Yes  |
| Litterbox  | https://litterbox.catbox.moe  | 1GB  | 24h  | Yes  |
| File.io  | https://file.io  | 2GB  | 14d  | No  |
| TmpFiles.org  | https://tmpfiles.org  | 100MB  | 1h  | No  |
| 0x0.st  | https://0x0.st/  | 512MB  | depends on the size of your file  | Yes  |
| c-v.sh  | https://c-v.sh | 4GB  | depends on the size of your file  | Yes  |
| ki.tc  | https://ki.tc | 400MB  | depends on the size of your file  | Yes  |
| Oshi.at  | https://oshi.at/ | 5GB  | 2h  | Yes  |
| Filebin  | https://filebin.net/ | infinite  | 7d | Yes  |
| transfer.sh  | https://transfer.sh | 10GB  |14d  | Yes  |
| bashupload | https://bashupload.com | 50GB | 3d | Yes |
| Curl.by | https://curl.by | 32MB | 30d | Yes |
| x0.at | https://x0.at | 50MB | depends on the size of your file | Yes |
| Uplooad | https://uplooad.net | 1GB | 2d | Yes |
| Tommo.team | https://tommo.team | 4GB | 30d | Yes |
| AnonymFile | https://anonymfile.com | 7.17GB | 7d | No |
| Anyfile | https://anyfile.co | 7.17GB | 7d | No |
| Gofile.cc | https://gofile.cc | 7.17 | 7d | No |
| tempfiles.ninja | https://tempfiles.ninja | 100MB | 24h | Yes |
| Pixeldrain | https://pixeldrain.com | 20GB | 90d | Yes |
| 1Cloudfile | https://1cloudfile.com | 5GB | 30d | Yes |
| Bowfile | https://bowfile.com | 5GB | 30d | Yes |
| Uploadify | https://uploadify.net | 2GB | infinite | Yes |
| AnonFiles.me | https://anonfiles.me | 7.17GB | 7d | No |
| AnonTransfer | https://anontransfer.com | 1GB | 30d | Yes |
| AnonSharing | https://anonsharing.com | 1GB | 180d | Yes |
| Temp.sh | https://temp.sh | 4GB | 3d | Yes |
| Uguu.se | https://uguu.se | 32MB | 3h | Yes |
| Nopaste | https://nopaste.net | 2GB | 21d | Yes |
| udrop | https://udrop.com | 10GB | infinite | Yes |
| Tempsend | https://tempsend.com | 2GB | 7d | Yes |
| 1fichier | https://1fichier.com | infinite | infinite | Yes |
| Turbobit | https://turbobit.net | 200MB | infinite | Yes |
| Hitfile | https://hitfile.net | 100GB | 30d | Yes |
| file-upload.org | https://file-upload.org | 200MB | 60d | Yes |
| HexUpload | https://hexupload.net | 2GB | 60d | Yes |
| Mexa.sh | https://mexa.sh | 500MB | 60d | Yes |
| RapidFileShare | http://rapidfileshare.net | 512MB | 5d | Yes |
| Send.cm | https://send.cm | 100GB | 15d | Yes |
| up-load.io | https://up-load.io | 100MB | infinite | Yes |
| Usercloud | https://usercloud.com | 5GB | infinite | Yes |
| FileTmp | https://filetmp.com | 300MB | infinite | Yes |
| Bayfiles.io | https://bayfiles.io | 7.17GB | 7d | No |

In all, Automatic-File-Uploader lets you upload your files to **43 different hosts** !

If you know of a host that has an API or just a CLI interface (without token or authentication key), please open an [issue](https://github.com/spel987/Automatic-File-Uploader/issues).

Video demonstration :

[![Automatic-File-Upload 1.3.0 Video Demonstration](https://i.imgur.com/ZzNsacz.png)](https://www.youtube.com/watch?v=a-UuBO4uKXA)
# Hosts that support manual deletion of uploaded files

| Name  | Url |
| ------------- | ------------- |
| Gofile  | https://gofile.io |
| Oshi.at  | https://oshi.at |
| Filebin  | https://filebin.net/ |
| Uploadify | https://uploadify.net |
| udrop | https://udrop.com |
| 1fichier | https://1fichier.com |

# Made by and with

By :
- Spel<br>
    Discord : `spel987`<br>
    Email : `spel@skiff.com`<br>
    GitHub : https://github.com/spel987

With :
- Rust : https://www.rust-lang.org
- Tauri : https://tauri.app/
- Tailwind CSS : https://tailwindcss.com/
- Flaticon (and author [Ilham Fitrotul Hayat](https://www.flaticon.com/fr/auteurs/ilham-fitrotul-hayat)): https://www.flaticon.com/fr/icone-gratuite/telecharger_2763883
- warp-cors : https://github.com/Bassetts/warp-cors
- All the sites listed in the table above

# Suggestions

If you have any questions or suggestions, please open an [issue](https://github.com/spel987/Automatic-File-Uploader/issues).

If you like this project or want to support it, you can make donations.

Ethereum : 
```
0x79024c8eA7Bfdef93cBa538eB6288a9bB40eFC97
```
Bitcoin :
```
bc1qua3qmrhlv3e53ydynwvfc2wq8q7wteqxwlewa4
```

# PolyUploader 
## Upload your files remotely to different hosting sites.

<div align="center">
	<a href="https://p-u.vercel.app/demonstration" target="_blank">🕹️ Demonstration</a> | 
	<a href="https://polyuploader.vercel.app" target="_blank">📖 Documentation website</a> | 
	<a href="https://p-u.vercel.app/terms" target="_blank">🧾 Terms</a>
	<br><br>
	<a href="#installation" target="_blank">⬇️ Installation</a> | 
	<a href="#supported-hosts" target="_blank">🌐 Supported hosts</a> |
	<a href="#use" target="_blank">🚀 Use</a> | 
	<a href="#comparison-with-mirroredto-and-mirroraceorg" target="_blank">🧪 Comparaison with Mirrored.to and Mirrorace.org</a> |
	<a href="#code-and-precision" target="_blank">🛠️ Code and precision</a> |
	<a href="#credits" target="_blank">👤 Credits</a>
	<br><br>
	<a href="https://ko-fi.com/spel987" target="_blank">
	    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="ko-fi">
	</a>
</div>
<h1 align="center">
<a href="#"><img src="https://i.imgur.com/sm7rlZ4.png"></a>
</h1>

### Test PolyUploader on the web with a demonstration version: https://p-u.vercel.app/demonstration
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

### - Or simply download and run the [release](https://github.com/spel987/PolyUploader/releases/latest).

Additional information: I'm not providing a portable version at the moment. In fact, Tauri creates a `C:\Users\<User>\AppData\Local\PolyUploader` folder containing the data required by the Webview.

# Supported hosts

Below is a table of the hosting providers currently supported by the application.
<table></table>

| Name            | Url                          | Max files size |   Time to file expiration    | Supports manual deletion | Host requiring an API key |
| :-------------- | :--------------------------- | :------------: | :--------------------------: | :----------------------: | :-----------------------: |
| 1fichier        | https://1fichier.com         |    infinite    |           15 days            |            ✔️            |             ❌             |
| Turbobit        | https://turbobit.net         |     200 MB     |            7 days            |            ❌             |             ❌             |
| Bowfile         | https://bowfile.com          |     20 GB      |           30 days            |            ✔️            |             ❌             |
| Gofile          | https://gofile.io            |    infinite    |           10 days            |            ✔️            |             ❌             |
| Hitfile         | https://hitfile.net          |     100 GB     |           30 days            |            ❌             |             ❌             |
| Uplooad         | https://uplooad.net          |      1 GB      |            2 days            |            ✔️            |             ❌             |
| 1Cloudfile      | https://1cloudfile.com       |      5 GB      |           30 days            |            ✔️            |             ❌             |
| Uploadify       | https://uploadify.net        |      2 GB      |           infinite           |            ✔️            |             ❌             |
| File.io         | https://file.io              |      2 GB      |           14 days            |            ❌             |             ❌             |
| file-upload.org | https://file-upload.org      |     200 MB     |           60 days            |            ✔️            |             ❌             |
| RapidFileShare  | http://rapidfileshare.net    |     512 MB     |            5 days            |            ✔️            |             ❌             |
| Upload.ee       | https://upload.ee            |     100 MB     |           50 days            |            ✔️            |             ❌             |
| transfer.sh     | https://transfer.sh          |     10 GB      |           14 days            |            ❌             |             ❌             |
| Netu            | https://netu.ac              |      8 GB      |           30 days            |            ❌             |             ❌             |
| Buzzheavier     | https://buzzheavier.com      |    infinite    |           infinite           |            ❌             |             ❌             |
| HexUpload       | https://hexload.com          |      2 GB      |           60 days            |            ✔️            |             ❌             |
| DailyUploads    | https://dailyuploads.net     |    infinite    |           30 days            |            ❌             |             ❌             |
| UsersDrive      | https://usersdrive.com       |    2.25 GB     |           10 days            |            ✔️            |             ❌             |
| Send.cm         | https://send.cm              |     100 GB     |           15 days            |            ❌             |             ❌             |
| Mexa.sh         | https://mexa.sh              |     500 MB     |           60 days            |            ✔️            |             ❌             |
| Clicknupload    | https://clicknupload.click   |      2 GB      |            7 days            |            ✔️            |             ❌             |
| MegaUp          | https://megaup.net           |      5 GB      |           60 days            |            ✔️            |             ❌             |
| AnonSharing     | https://anonsharing.com      |      1 GB      |           180 days           |            ✔️            |             ❌             |
| Filespace       | https://filespace.com        |     150 MB     |           10 days            |            ❌             |             ❌             |
| Gulfup          | https://www.gulf-up.com      |     200 MB     |           10 days            |            ✔️            |             ❌             |
| Fastupload      | https://fastupload.io        |     50 GB      |           30 days            |            ✔️            |             ❌             |
| DepositFiles    | https://dfiles.eu            |     10 GB      |           90 days            |            ❌             |             ❌             |
| Download.gg     | https://download.gg          |     25 GB      |           infinite           |            ✔️            |             ❌             |
| Sendvid         | https://sendvid.com          |      1 GB      |           90 days            |            ❌             |             ❌             |
| AnonTransfer    | https://anontransfer.com     |      1 GB      |           30 days            |            ❌             |             ❌             |
| Litterbox       | https://litterbox.catbox.moe |      1 GB      |           24 hours           |            ❌             |             ❌             |
| Temp.sh         | https://temp.sh              |      4 GB      |            3 days            |            ❌             |             ❌             |
| TmpFiles.org    | https://tmpfiles.org         |     100 MB     |            1 hour            |            ❌             |             ❌             |
| Free.fr         | https://transfert.free.fr    |     10 GB      |            7 days            |            ✔️            |             ❌             |
| Uguu.se         | https://uguu.se              |     32 MB      |           3 hours            |            ❌             |             ❌             |
| Filebin         | https://filebin.net          |    infinite    |            7 days            |            ✔️            |             ❌             |
| Upstore         | https://upstore.net          |      1 GB      |           30 days            |            ❌             |             ❌             |
| uFile           | https://ufile.io             |      5 GB      |           30 days            |            ❌             |             ❌             |
| KrakenFiles     | https://krakenfiles.com      |      1 GB      |           30 days            |            ❌             |             ❌             |
| Media.cm        | https://media.cm             |     300 MB     |           90 days            |            ❌             |             ❌             |
| Oshi.at         | https://oshi.at              |      5 GB      |           2 hours            |            ✔️            |             ❌             |
| bashupload      | https://bashupload.com       |     50 GB      |            3 days            |            ❌             |             ❌             |
| Tommo.team      | https://tommo.team           |      4 GB      |           30 days            |            ❌             |             ❌             |
| tempfiles.ninja | https://tempfiles.ninja      |     100 MB     |           24 hours           |            ✔️            |             ❌             |
| UploadEv        | https://uploadev.org         |     250 MB     |           10 days            |            ✔️            |             ❌             |
| 0x0.st          | https://0x0.st               |     512 MB     | depends on the file size[^1] |            ❌             |             ❌             |
| udrop           | https://udrop.com            |     10 GB      |            7 days            |            ✔️            |             ❌             |
| Tempsend        | https://tempsend.com         |      2 GB      |            7 days            |            ❌             |             ❌             |
| Curl.by         | https://curl.by              |     32 MB      |           30 days            |            ❌             |             ❌             |
| FileTmp         | https://filetmp.com          |     300 MB     |           5 hours            |            ❌             |             ❌             |
| CCU.to          | https://ccu.to               |      5 GB      |            3 days            |            ❌             |             ❌             |
| ImgBB           | https://imgbb.com            |     32 MB      |           infinite           |            ❌             |             ❌             |
| ki.tc           | https://ki.tc                |     400 MB     | depends on the file size[^1] |            ❌             |             ❌             |
| CyberFile       | https://cyberfile.me         |     10 GB      |            5 days            |            ✔️            |             ❌             |
| c-v.sh          | https://c-v.sh               |      4 GB      | depends on the file size[^1] |            ✔️            |             ❌             |
| x0.at           | https://x0.at                |     50 MB      | depends on the file size[^1] |            ❌             |             ❌             |
| Nopaste         | https://nopaste.net          |      2 GB      |           21 days            |            ❌             |             ❌             |
| TmpSend         | https://tmpsend.com          |      1 GB      |            7 days            |            ❌             |             ❌             |
| Isra.cloud      | https://isra.cloud           |      5 MB      |           24 hours           |            ✔️            |             ❌             |
| DoodStream      | https://doodstream.com       |    infinite    |           60 days            |            ❌             |            ✔️             |
| Pixeldrain      | https://pixeldrain.com       |     20 GB      |           90 days            |            ✔️            |            ✔️             |
| Drop.download   | https://drop.download        |     50 GB      |           10 days            |            ❌             |            ✔️             |
| FileMoon        | https://filemoon.sx          |     50 GB      |           10 days            |            ❌             |            ✔️             |
| Catbox          | https://catbox.moe           |     200 MB     |           infinite           |            ✔️            |            ✔️             |
| ddownload       | https://ddownload.com        |      2 GB      |           30 days            |            ✔️            |            ✔️             |
| mp4upload       | https://mp4upload.com        |     500 MB     |           30 days            |            ❌             |            ✔️             |
| DropGalaxy      | https://dropgalaxy.com       |      5 GB      |           120 days           |            ❌             |            ✔️             |
| Nitroflare      | https://nitroflare.com       |     10 GB      |           90 days            |            ❌             |            ✔️             |
| Vidoza          | https://vidoza.net           |     50 GB      |           30 days            |            ❌             |            ✔️             |
| Katfile         | https://katfile.com          |      5 GB      |           10 days            |            ✔️            |            ✔️             |
| Rapidgator      | https://rapidgator.net       |     80 GB      |           30 days            |            ❌             |            ✔️             |
| StreamA2Z       | https://streama2z.com        |     10 GB      |           60 days            |            ❌             |            ✔️             |
| StreamWish      | https://streamwish.com       |     50 GB      |           infinite           |            ❌             |            ✔️             |
| StreamRuby      | https://streamruby.com       |     50 GB      |           10 days            |            ❌             |            ✔️             |
| Voe.sx          | https://voe.sx               |     25 GB      |           60 days            |            ❌             |            ✔️             |
| DevUploads      | https://devuploads.com       |      5 GB      |           30 days            |            ❌             |            ✔️             |

In all, PolyUploader lets you upload your files to **76 different hosts** !
If you know of a host that has an API or just a CLI interface, please open an [issue](https://github.com/spel987/PolyUploader/issues).

# Use

Currently, my application supports **76 hosting sites**.

So you can upload your files remotely and get the download link created. You can upload from local storage or from a URL. You can also upload your file to multiple hosts simultaneously and retrieve all the links created.

I've provided predefined profiles to simplify things, but if you like, you can create your own profiles with your chosen hosts. Rename them, change hosts and, if necessary, delete them. 

You can also import your own API key for some hosts to connect your account and space to PolyUploader.

You have access to a history of links created, showing its upload date and the time remaining before it expires. When your file has expired, this is indicated. You can easily clear the history.

Every 12 hours, a check is made to see if the hosts are still online. If this is not the case, the script makes it unavailable.

You can manually delete the file uploaded to the host from the history, provided that the host is able to delete it and offers the ability to do so. You'll find a list below.

To test PolyUploader without installing it, use the demonstration available on the web at https://p-u.vercel.app/demonstration.

<h1 align="center">
<a href="#"><img src="https://i.imgur.com/GPWmOaj.jpeg"></a>
</h1>

# Comparison with [Mirrored.to](https://mirrored.to) and [Mirrorace.org](https://mirrorace.org)

|                                                                           | PolyUploader | [Mirrored.to](https://mirrored.to) | [Mirrorace.org](https://mirrorace.org) |
| :------------------------------------------------------------------------ | :----------: | :--------------------------------: | :------------------------------------: |
| Number of hosting providers supported                                     |      76      |               36[^2]               |                 54[^3]                 |
| No need for a user account to fully use the service                       |      ✔️      |                 ❌                  |                   ❌                    |
| Maximum file size limit                                                   | infinite[^4] |               500MB                |                  5GB                   |
| History of uploaded files                                                 |      ✔️      |               ⚠️[^5]               |                 ⚠️[^5]                 |
| Flags up offline hosts and prevents the user from uploading files to them |      ✔️      |               ⚠️[^6]               |                   ❌                    |
| Uploaded file can be deleted[^7]                                          |      ✔️      |                 ❌                  |                   ❌                    |
| Ability to upload a file from a URL                                       |      ✔️      |                 ✔️                 |                   ✔️                   |
| Ability to upload multiple files simultaneously                           |      ❌       |               ✔️[^8]               |                 ✔️[^9]                 |
| Profile features                                                          |      ✔️      |              ⚠️[^10]               |                ⚠️[^10]                 |
| Created links accessible from a shareable link                            |      ✔️      |                 ✔️                 |                   ✔️                   |
| Supports user API keys for concerned hosts                                |      ✔️      |                 ✔️                 |                   ✔️                   |
| Open-source                                                               |      ✔️      |                 ❌                  |                   ❌                    |

Legend:
- ✔️: Yes
- ❌: No
- ⚠️: Partially

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

# Credits

### Developer:

- spel987
    Email: `spel987@pm.me`
    GitHub: https://github.com/spel987
### Backend

- Rust: https://www.rust-lang.org
- Tauri: https://tauri.app/
- warp-cors: https://github.com/Bassetts/warp-cors
### Frontend

- Tailwind CSS: https://tailwindcss.com/
- Font Awesome: https://fontawesome.com
- Flaticon (and author [Ilham Fitrotul Hayat](https://www.flaticon.com/authors/ilham-fitrotul-hayat)): https://www.flaticon.com/free-icon/upload_2763883
### The sites used

All the sites listed in the table [here](#supported-hosts).

# Suggestions

If you have any questions or suggestions, please open an [issue](https://github.com/spel987/PolyUploader/issues).

[^1]: **"depends on the file size"** means that the host keeps your files according to their weight. They use different algorithms. *For more information, please visit the chosen site.*
[^2]: Only 13 hosts are proposed when we don't use an account.
[^3]: Only 36 hosts are proposed when we don't use an account.. Many hosts are no longer supported, and I've found that around 60% of hosts are no longer functional.
[^4]: File size is not restricted by the software, but by the host. It all depends on the host's capacity.
[^5]: History is only available to registered users.
[^6]: Offline hosts are not deactivated, we need to go to "https://www.mirrored.to/p/host-status" for status information.
[^7]: Provided that the host is able to delete it and offers the ability to do so
[^8]: This feature is limited to 20 files.
[^9]: This feature is limited to 50 files.
[^10]: Only a "profile" that checks off the favorite hosts selected in the settings. User account required.
# Automatic-File-Uploader 
## Upload your files to various platforms via their API.


This project lets you easily upload your files to various platforms via their API.

<h1 align="center">
<a href="#"><img src="https://i.imgur.com/j4Z6op2.png"></a>
</h1>

# Installation and use

### - Use the application by hand launching Electron :

- Install the latest version of Node.js : https://nodejs.org/en/download

- Install the packages needed for the project with : 

```
npm i
```

- Run the following command to start using the application :

```
npm run start
```

### - Use the application by building it yourself :

#### If you want a portable version, leave it like this and run this command : 

```
npm run build
```

#### If you'd like an application installation setup : 

- Modify `package.json` with a configuration similar to this one for the `build` part : 

```json
  "build": {
    "appId": "Automatic-File-Uploader",
    "copyright": "spel987",
    "directories": {
      "output": "build"
    },
    "win": {
      "target": ["nsis"],
      "icon": "./src/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "installerIcon": "./src/icon.ico",
      "uninstallerIcon": "./src/icon.ico",
      "uninstallDisplayName": "Automatic-File-Uploader",
      "license": "LICENSE",
      "allowToChangeInstallationDirectory": true
    }
  }
```

- Then run the following command : 

```
npm run build
```

(Here's the configuration used to build the portable version of the application in comparison)

```json
  "build": {
    "appId": "Automatic-File-Uploader",
    "copyright": "spel987",
    "directories": {
      "output": "build"
    },
    "win": {
      "target": ["portable"],
      "icon": "./src/icon.ico"
    },
    "portable": {
      "artifactName": "Automatic-File-Uploader Portable.exe"
    }
  }
```

### - Or simply download and run the [realease](https://github.com/spel987/Automatic-File-Uploader/releases).

# Code and precision

The application uses various file hosting APIs. Simply press the "Upload" button referring to the host you want, select your file and press "Upload" again.

For some sites, I was getting the famous "Access-Control-Allow-Origin" error. To counter this, I found and used a GitHub repository: https://github.com/Rob--W/cors-anywhere. 

He'll explain how it works better than I can, but basically, the application opens a "server" on port 61337, which I've defined. It then forwards API requests to the sites blocked by this server. It works wonderfully well, so go star Rob--W's project if you liked that one.

This part of the code in the `main.js` file is the part that manages the "cors-anywhere" server. As you can see, I simply define the local ip address and port 61337 (Haxor1337).

```js
// main.js

let cors_proxy = require('cors-anywhere');
let port = process.env.PORT || 61337;
let host = process.env.HOST || '127.0.0.1';

cors_proxy.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']

}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
```

And in the `script.js` file I pass requests through this server.

```js
// script.js

const url_for_bypass_cors = "http://127.0.0.1:61337"

if (host === "gofile") {
  sent_data_form.append("file", popup_file_input.files[0]);
  
  upload_to_host(url_for_bypass_cors + '/https://store2.gofile.io/uploadFile', 'POST', sent_data_form, 'json', ['data', 'downloadPage'])
```

I use a fairly comprehensive function to upload a file to the various hosts and retrieve the url in return. Here's an explanatory image : 

<img src="https://i.imgur.com/Swtd60o.png">

# Currently supported hosts

Below is a table of the hosting providers currently supported by the application.
<table></table>

| Name  | Url | Max files size | Time to file expiration | Uses the Cors-Anywhere repository |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Gofile  | https://gofile.io  | infinite  | infinite | Yes  |
| Litterbox  | https://litterbox.catbox.moe  | 1GB  | 24h  | Yes  |
| File.io  | https://file.io  | 2GB  | infinite  | No  |
| TmpFiles.org  | https://tmpfiles.org  | 100MB  | 1h  | No  |
| 0x0.st  | https://0x0.st/  | 512MB  | depends on the size of your file  | Yes  |
| c-v.sh  | https://c-v.sh | 4GB  | depends on the size of your file  | Yes  |
| ki.tc  | https://ki.tc | 400MB  | depends on the size of your file  | Yes  |
| Oshi.at  | https://oshi.at/ | 1GB  | 2h  | Yes  |
| Filebin  | https://filebin.net/ | infinite  |infinite  | Yes  |
| transfer.sh  | https://transfer.sh | 10GB  |14d  | Yes  |
| FroCDN  | https://frocdn.com/ | 15GB  | infinite  | Yes  |
| bashupload | https://bashupload.com | 50GB | 3d | Yes |
| Curl.by | https://curl.by | 32MB | 30d | Yes |
| x0.at | https://x0.at | 50MB | depends on the size of your file | Yes |
| Temp-file.org | https://temp-file.org | 5GB | 2d | Yes |
| Uplooad | https://uplooad.net | 1GB | 2d | Yes |
| Tommo.team | https://tommo.team | 4GB | 30d | Yes |
| AnonymFile | https://anonymfile.com | infinite | infinite | No |
| Anyfile | https://anyfile.co | infinite | infinite | No |
| Gofile.cc | https://gofile.cc | infinite | infinite | No |
| tempfiles.ninja | https://tempfiles.ninja | 100MB | 1d | Yes |
| Pixeldrain | https://pixeldrain.com | infinite | 60d | Yes |
| UploadHub | https://uplodhub.to | infinite | infinite | Yes |
| 1Cloudfile | https://1cloudfile.com | 5GB | 30d | Yes |
| Bowfile | https://bowfile.com | 5GB | 30d | Yes |
| Zero Upload | https://zeroupload.com | 3.14GB | 190d | Yes |
| Uploadify | https://uploadify.net | 2GB | infinite | Yes |
| AnonFiles.me | https://anonfiles.me | infinite | infinite | No |
| AnonTransfer | https://anontransfer.com | 1GB | 30d | Yes |
| AnonSharing | https://anonsharing.com | 1GB | 180d | Yes |
| Temp.sh | https://temp.sh | 4GB | 3d | Yes |
| Uguu.se | https://uguu.se | 32MB | 3h | Yes |
| Nopaste | https://nopaste.net | 2GB | 21d | Yes |
| udrop | https://udrop.com | 10GB | infinite | Yes |
| Tempsend | https://tempsend.com | 2GB | 7d | Yes |
| 1fichier | https://1fichier.com | infinite | infinite | Yes |
| Turbobit | https://turbobit.net | infinite | infinite | Yes |
| Hitfile | https://hitfile.net | 100GB | 30d | Yes |
| file-upload.org | https://file-upload.org | 200MB | infinite | Yes |
| HexUpload | https://hexupload.net | 2GB | 60d | Yes |
| Mexa.sh | https://mexa.sh | 500MB | 60d | Yes |
| RapidFileShare | http://rapidfileshare.net | 512MB | 5d | Yes |
| Send.cm | https://send.cm | 100GB | 15d | Yes |
| up-load.io | https://up-load.io | 100MB | infinite | Yes |
| Usercloud | https://usercloud.com | 5GB | infinite | Yes |

In all, Automatic-File-Uploader lets you upload your files to **45 different hosts** !

If you know of a host that has an API or just a CLI interface (without token or authentication key), please open an [issue](https://github.com/spel987/Automatic-File-Uploader/issues).

Video demonstration :

https://github.com/spel987/Automatic-File-Uploader/assets/89778476/fd87e525-dd84-461c-b6c1-0b05dea16973
# Made by and with

By :
- Spel<br>
    Discord : `spel987`<br>
    Email : `spel@usurp.in`<br>
    GitHub : https://github.com/spel987

With :
- Node.Js : https://nodejs.org/
- ElectronJs : https://www.electronjs.org
- Tailwind CSS : https://tailwindcss.com/
- Flaticon (and author [Ilham Fitrotul Hayat](https://www.flaticon.com/fr/auteurs/ilham-fitrotul-hayat)): https://www.flaticon.com/fr/icone-gratuite/telecharger_2763883
- electron-builder : https://www.electron.build/index.html
- cors-anywhere : https://github.com/Rob--W/cors-anywhere
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
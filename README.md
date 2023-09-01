# Automatic-File-Uploader 
## Upload your files to various platforms via their API.


This project lets you easily upload your files to various platforms via their API.

<h1 align="center">
<a href="#"><img src="https://i.imgur.com/uGePxtB.png"></a>
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

- Modify `package.json` with a configuration similar to this one for the "build" part : 

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
      "artifactName": "Automatic-File-Uploader Portable.exe",
    }
  }
```

Then run the following command : 

```
npm run build
```
### - Or simply download and run the [realease](https://github.com/spel987/Automatic-File-Uploader/releases).


# Usage

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

const urlForBypassCors = "http://127.0.0.1:61337"

else if (host === "0x0") {
     desactivate_button_when_upload()
        
     formData.append("file", popupFileInput.files[0]);

     uploadToHost(
        `${urlForBypassCors}/https://0x0.st/`,
        "POST",
        formData,
        "text",
        data => {const url_0x0 = data
          if (url_0x0) {
            activate_button_and_show_final_url(url_0x0)
            copyButton.addEventListener("click", function() {
              copy_to_clipboard(url_0x0);
            });
          }
        },
         error => {activate_button_when_error(error)})
 }
```


Below is a table of the hosting providers currently supported by the application.
<table></table>

| Name  | Url | Max files size | Time to file expiration | Uses the Cors-Anywhere repository |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Gofile  | https://gofile.io  | infinite  | infinite | No  |
| Litterbox  | https://litterbox.catbox.moe  | 1GB  | 24h  | No  |
| File.io  | https://file.io  | 2GB  | infinite  | No  |
| TmpFiles.org  | https://tmpfiles.org  | 100MB  | 1h  | No  |
| 0x0.st  | https://0x0.st/  | 512MB  | depends on the size of your file  | Yes  |
| c-v.sh  | https://c-v.sh | 4GB  | depends on the size of your file  | Yes  |
| ki.tc  | https://ki.tc | 400MB  | depends on the size of your file  | Yes  |
| Oshi.at  | https://oshi.at/ | 1GB  | 2h  | Yes  |
| Filebin  | https://filebin.net/ | infinite  |infinite  | Yes  |
| transfer.sh  | https://transfer.sh | 10GB  |14d  | Yes  |
| FroCDN  | https://frocdn.com/ | 15GB  | infinite  | Yes  |

If you know of a host that has an API or just a CLI interface (without token or authentication key), please open an [issue](https://github.com/spel987/Automatic-File-Uploader/issues).

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

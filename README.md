# PolyUploader 
## Upload your files remotely to different hosting sites.

<div align="center">
  <a href="https://polyuploader.vercel.app" target="_blank">📖 Documentation website</a> |
  <a href="https://p-u.vercel.app/statistics" target="_blank">📈 Statistics</a> |
  <a href="https://p-u.vercel.app/terms" target="_blank">🧾 Terms</a>
</div>

<div align="center">
  <hr width="500">
</div>

<div align="center">
  <a href="#quick-overview">🚀 Quick overview</a> |
  <a href="#installation">⬇️ Installation</a> |
  <a href="#supported-hosts">🌐 Supported hosts</a> |
  <a href="#comparison-with-mirroredto-mirroraceorg-and-multiup">🔍 Comparison with Mirrored.to, Mirrorace.org and MultiUp</a>
  <br><br>
  <a href="#telemetry">📊 Telemetry</a> |
  <a href="#managing-cors">🛠️ Managing CORS</a> |
  <a href="#notes-from-the-developer">🗒️ Notes from the developer</a> |
  <a href="#credits">👤 Credits</a>
</div>

<h1 align="center">
  <img src="https://i.imgur.com/ru5jvSs.png">
</h1>

<div align="center">
  <br>
    <a href="https://www.producthunt.com/products/polyuploader?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-polyuploader" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1002185&theme=light&t=1754471623485" alt="PolyUploader - Upload&#0032;files&#0032;to&#0032;130&#0043;&#0032;hosts&#0032;simultaneously | Product Hunt" style="width: 139px; height: 30px;" width="139" height="30" /></a>
    <a href="https://sourceforge.net/projects/polyuploader/files/latest/download"><img alt="Download PolyUploader" src="https://a.fsdn.com/con/app/sf-download-button" width=175 height=30 srcset="https://a.fsdn.com/con/app/sf-download-button?button_size=2x 2x"></a>
    <a href="https://alternativeto.net/software/polyuploader/about/" target="_blank"><img style='border-radius: 30px; height:30px;' src="https://i.imgur.com/H9JRjL5.png"/></a>
    <a href='https://ko-fi.com/I2I7ZG8O5' target='_blank'><img height='36' style='border:0px;height:30px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
</div>

# Quick overview:

- Upload from local storage or via URL to 130 hosts at once
- Link your own API keys for compatible hosts
- View a detailed history of your uploads with expiration status and delete buttons
- Create and manage upload profiles to automate frequent tasks
- Generate a single sharing link to bundle multiple host links (e.g. [example](https://p-u.vercel.app/QZZGsMNho9))
- No account required, fully open-source, fast, and free
- Built with a focus on speed and security using Rust backend

Be sure to respect the [terms](https://p-u.vercel.app/terms) when using the software.

# Installation

## - 🔧 Use the application by compiling it by hand:

1) **Clone the repository:**

```
git clone https://github.com/spel987/PolyUploader.git
```

2) **Install the latest version of Rust:** https://www.rust-lang.org/tools/install
3) **Install Tauri-CLI with this command:**

```
cargo install tauri-cli
```

4) **Start compilation with this command:**

```
cargo tauri build
```

You'll find the installer in the `.\src-tauri\target\release\bundle` folder.

**Or start debugging the application with this command:**

```
cargo tauri dev
```


*Optional: If you wish to modify the CSS with TailwindCSS:*

1) **Install the latest version of Node.js:** https://nodejs.org
2) **Install the dependencies:**

```
npm i
```

3) **Run the script command to build the CSS file:**

```
npm run tailwind
```

## - 🖥️ Or simply download and run the [release](https://github.com/spel987/PolyUploader/releases/latest) (Windows only).

> 1) For the moment, the application is only available on Windows. I tried to build the application for Linux but I kept getting webkit errors and on top of that Linux doesn't handle certain CSS effects in the same way. The application wouldn't look very good and would be full of bugs. However, why not work to solve this problem in future versions.
> 2) I'm not providing a portable version at the moment. In fact, Tauri creates a `C:\Users\<User>\AppData\Local\PolyUploader` folder containing the data required by the Webview.

# Supported hosts

## 📋 All hosts

### 🗒️ Legend

| Column                               | Emoji(s)  | Meaning(s)                                                         |
| ------------------------------------ | --------- | ------------------------------------------------------------------ |
| Name                                 | 🎞️       | 🎞️ = Specialist video streaming host                              |
| 📁 Max file size / 🕐 File retention | 👻, 👤    | 👻 = Anonymous upload limits<br>👤 = Account-based upload limits   |
| 🗑️ Supports manual file deletion    | ✔️, 🔧, - | ✔️ = Yes<br>🔧 = Only with API key<br>- = Not supported            |
| 🔑 API key support                   | ✨, 🔒, -  | ✨ = API key optional<br>🔒 = API key required<br>- = Not supported |

### 🌐 Hosts

| Name                                                                       | Url                          |    📁 Max file size    |    🕐 File retention time    | 🗑️ Supports manual file deletion | 🔑 API key support |
| :------------------------------------------------------------------------- | :--------------------------- | :--------------------: | :--------------------------: | :-------------------------------: | :----------------: |
| <img src="./src/images/1fichier.com.png" width="16"/> 1fichier             | https://1fichier.com         |     👻, 👤 300 GB      |   👻 15 days<br>👤 30 days   |                ✔️                 |         ✨          |
| <img src="./src/images/torbobit.net.png" width="16"/> Turbobit             | https://turbobit.net         | 👻 200 MB<br>👤 200 GB |   👻 7 days<br>👤 30 days    |                 -                 |         ✨          |
| <img src="./src/images/bowfile.com.png" width="16"/> Bowfile               | https://bowfile.com          |         20 GB          |           30 days            |                ✔️                 |         -          |
| <img src="./src/images/gofile.io.png" width="16"/> Gofile                  | https://gofile.io            |    👻, 👤 infinite     |        👻, 👤 10 days        |                ✔️                 |         ✨          |
| <img src="./src/images/hitfile.net.png" width="16"/> Hitfile               | https://hitfile.net          |  👻 4 GB<br>👤 100 GB  |       👻, 👤  30 days        |                 -                 |         ✨          |
| <img src="./src/images/1cloudfile.com.png" width="16"/> 1Cloudfile         | https://1cloudfile.com       |          5 GB          |           30 days            |                ✔️                 |         -          |
| <img src="./src/images/file-upload.org.png" width="16"/> file-upload.org   | https://file-upload.org      |         200 MB         |           60 days            |                 -                 |         -          |
| <img src="./src/images/rapidfileshare.net.png" width="16"/> RapidFileShare | http://rapidfileshare.net    |         512 MB         |            5 days            |                ✔️                 |         -          |
| <img src="./src/images/upload.ee.png" width="16"/> Upload.ee               | https://upload.ee            |         100 MB         |           50 days            |                ✔️                 |         -          |
| <img src="./src/images/waaw.ac.png" width="16"/> Netu 🎞️                  | https://netu.ac              |  👻 8 GB<br>👤 100 GB  |        👻, 👤 30 days        |                 -                 |         ✨          |
| <img src="./src/images/buzzheavier.com.png" width="16"/> Buzzheavier       | https://buzzheavier.com      |    👻, 👤 infinite     |        👻, 👤 7 days         |                🔧                 |         ✨          |
| <img src="./src/images/hexload.com.png" width="16"/> HexUpload             | https://hexload.com          |          2 GB          |           60 days            |                ✔️                 |         -          |
| <img src="./src/images/vikingfile.com.png" width="16"/> VikingFile         | https://vikingfile.com       |         10 GB          |           20 days            |                 -                 |         -          |
| DailyUploads                                                               | https://dailyuploads.net     |        infinite        |           30 days            |                 -                 |         -          |
| <img src="./src/images/usersdrive.com.png" width="16"/> UsersDrive         | https://usersdrive.com       |        2.25 GB         |           10 days            |                ✔️                 |         -          |
| <img src="./src/images/send.now.png" width="16"/> Send.now                 | https://send.now             |         100 GB         |           15 days            |                 -                 |         -          |
| <img src="./src/images/mexa.sh.png" width="16"/> Mexa.sh                   | https://mexa.sh              |         500 MB         |           60 days            |                ✔️                 |         -          |
| <img src="./src/images/megaup.net.png" width="16"/> MegaUp                 | https://megaup.net           |          5 GB          |           60 days            |                ✔️                 |         -          |
| <img src="./src/images/uploadify.net.png" width="16"/> Uploadify           | https://uploadify.net        |          2 GB          |           infinite           |                ✔️                 |         -          |
| <img src="./src/images/clicknupload.click.png" width="16"/> Clicknupload   | https://clicknupload.click   |          2 GB          |            7 days            |                ✔️                 |         -          |
| <img src="./src/images/filespace.com.png" width="16"/> Filespace           | https://filespace.com        |         150 MB         |           10 days            |                ✔️                 |         -          |
| <img src="./src/images/gulf-up.com.png" width="16"/> Gulfup                | https://www.gulf-up.com      | 👻 200 MB<br>👤 10 GB  |   👻 10 days<br>👤 30 days   |                ✔️                 |         ✨          |
| <img src="./src/images/fastupload.io.png" width="16"/> Fastupload          | https://fastupload.io        |         50 GB          |           30 days            |                ✔️                 |         -          |
| UploadHive                                                                 | https://uploadhive.com       |        infinite        |           30 days            |                 -                 |         -          |
| <img src="./src/images/dfiles.eu.png" width="16"/> DepositFiles            | https://dfiles.eu            |         10 GB          |           90 days            |                 -                 |         -          |
| <img src="./src/images/download.gg.png" width="16"/> Download.gg           | https://download.gg          |         25 GB          |           infinite           |                ✔️                 |         -          |
| <img src="./src/images/sendvid.com.png" width="16"/> Sendvid 🎞️           | https://sendvid.com          |          1 GB          |           90 days            |                 -                 |         -          |
| <img src="./src/images/uploady.io.png" width="16"/> Uploady                | https://uploady.io           |  👻 1 GB<br>👤 100 GB  |        👻, 👤 30 days        |                ✔️                 |         ✨          |
| <img src="./src/images/anontransfer.com.png" width="16"/> AnonTransfer     | https://anontransfer.com     |          1 GB          |           30 days            |                 -                 |         -          |
| <img src="./src/images/filemirage.com.png" width="16"/> FileMirage         | https://filemirage.com       |      👻, 👤 50 GB      |        👻, 👤 60 days        |                 -                 |         ✨          |
| <img src="./src/images/litter.catbox.moe.png" width="16"/> Litterbox       | https://litterbox.catbox.moe |          1 GB          |           24 hours           |                 -                 |         -          |
| Temp.sh                                                                    | https://temp.sh              |          4 GB          |            3 days            |                 -                 |         -          |
| <img src="./src/images/tmpfiles.org.png" width="16"/> TmpFiles.org         | https://tmpfiles.org         |         100 MB         |            1 hour            |                 -                 |         -          |
| <img src="./src/images/gofile.to.png" width="16"/> Gofile.to               | https://gofile.to            |          5 GB          |           infinite           |                 -                 |         -          |
| <img src="./src/images/free.fr.png" width="16"/> Free.fr                   | https://transfert.free.fr    |         10 GB          |            7 days            |                ✔️                 |         -          |
| <img src="./src/images/uguu.se.png" width="16"/> Uguu.se                   | https://uguu.se              |         32 MB          |           3 hours            |                 -                 |         -          |
| <img src="./src/images/uguu.se.png" width="16"/> lurkmore Uguu             | https://upload.lurkmore.com  |        1.28 GB         |           24 hours           |                 -                 |         -          |
| <img src="./src/images/uguu.se.png" width="16"/> Uguu                      | https://uguu.aishiteiru.moe/ |         128 MB         |           24 hours           |                 -                 |         -          |
| <img src="./src/images/uguu.se.png" width="16"/> Pomf.lain.la              | https://pomf.lain.la         |          1 GB          |           infinite           |                 -                 |         -          |
| <img src="./src/images/filer.net.png" width="16"/> Filer.net               | https://filer.net            |         500 MB         |           180 days           |                 -                 |         -          |
| <img src="./src/images/filebin.net.png" width="16"/> Filebin               | https://filebin.net          |        infinite        |            7 days            |                ✔️                 |         -          |
| <img src="./src/images/douploads.net.png" width="16"/> DoUploads           | https://douploads.net        |          1 GB          |           10 days            |                ✔️                 |         -          |
| Dataupload                                                                 | https://dataupload.net       |         300 MB         |           30 days            |                ✔️                 |         -          |
| <img src="./src/images/upstore.net.png" width="16"/> Upstore               | https://upstore.net          |          1 GB          |           30 days            |                 -                 |         -          |
| <img src="./src/images/ufile.io.png" width="16"/> uFile                    | https://ufile.io             |          5 GB          |           30 days            |                 -                 |         -          |
| <img src="./src/images/krakenfiles.com.png" width="16"/> KrakenFiles       | https://krakenfiles.com      |          1 GB          |           30 days            |                 -                 |         -          |
| Rapidshare.io                                                              | https://rapidshare.io        |          1 GB          |           10 days            |                ✔️                 |         -          |
| <img src="./src/images/media.cm.png" width="16"/> Media.cm 🎞️             | https://media.cm             |         300 MB         |           90 days            |                 -                 |         -          |
| <img src="./src/images/oshi.at.png" width="16"/> Oshi.at                   | https://oshi.at              |          5 GB          |           2 hours            |                ✔️                 |         -          |
| bashupload                                                                 | https://bashupload.com       |         50 GB          |            3 days            |                 -                 |         -          |
| <img src="./src/images/tommo.team.png" width="16"/> Tommo.team             | https://tommo.team           |          4 GB          |           30 days            |                 -                 |         -          |
| Desiupload                                                                 | https://desiupload.co        |        infinite        |           15 days            |                 -                 |         -          |
| <img src="./src/images/tempfiles.ninja.png" width="16"/> tempfiles.ninja   | https://tempfiles.ninja      |         100 MB         |           24 hours           |                ✔️                 |         -          |
| <img src="./src/images/fileditchstuff.me.png" width="16"/> Fileditch       | https://fileditch.com        |          5 GB          |           30 days            |                 -                 |         -          |
| <img src="./src/images/up2sha.re.png" width="16"/> Up2Share                | https://up2sha.re            |         64 MB          |           30 days            |                 -                 |         -          |
| Dbree                                                                      | https://dbree.org            |         100 MB         |           60 days            |                 -                 |         -          |
| <img src="./src/images/udrop.com.png" width="16"/> udrop                   | https://udrop.com            |         10 GB          |            7 days            |                ✔️                 |         -          |
| <img src="./src/images/tempsend.com.png" width="16"/> Tempsend             | https://tempsend.com         |          2 GB          |            7 days            |                 -                 |         -          |
| Curl.by                                                                    | https://curl.by              |         32 MB          |           30 days            |                 -                 |         -          |
| <img src="./src/images/uptomega.net.png" width="16"/> Uptomega             | https://uptomega.net         |          1 GB          |            3 days            |                 -                 |         -          |
| Data Vaults                                                                | https://datavaults.co        |          1 GB          |            3 days            |                 -                 |         -          |
| <img src="./src/images/qu.ax.png" width="16"/> qu.ax                       | https://qu.ax                |         256 MB         |           infinite           |                 -                 |         -          |
| <img src="./src/images/filetmp.com.png" width="16"/> FileTmp               | https://filetmp.com          |         300 MB         |           5 hours            |                 -                 |         -          |
| <img src="./src/images/ccu.to.png" width="16"/> CCU.to                     | https://ccu.to               |          5 GB          |            3 days            |                 -                 |         -          |
| <img src="./src/images/dosya.co.png" width="16"/> Dosya.co                 | https://dosya.co             |          2 GB          |           45 days            |                ✔️                 |         -          |
| <img src="./src/images/ibb.co.png" width="16"/> ImgBB                      | https://imgbb.com            |         32 MB          |           infinite           |                 -                 |         -          |
| ki.tc                                                                      | https://ki.tc                |         400 MB         | depends on the file size[^1] |                 -                 |         -          |
| <img src="./src/images/udrop.com.png" width="16"/> UploadFile.pl           | https://uploadfile.pl        |        5.98 GB         |           30 days            |                ✔️                 |         -          |
| <img src="./src/images/nippyfile.com.png" width="16"/> NippyFile           | https://nippyfile.com        |         100 MB         |           infinite           |                 -                 |         -          |
| <img src="./src/images/filestore.to.png" width="16"/> Filestore            | https://filestore.to         |          2 GB          |           15 days            |                ✔️                 |         -          |
| <img src="./src/images/fast-down.com.png" width="16"/> Fast Down           | https://down.fast-down.com   |         10 GB          |           30 days            |                 -                 |         -          |
| <img src="./src/images/cyberfile.me.png" width="16"/> CyberFile            | https://cyberfile.me         |         10 GB          |            5 days            |                ✔️                 |         -          |
| <img src="./src/images/end2end.tech.png" width="16"/> end2end              | https://end2end.tech         |          2 GB          |           infinite           |                ✔️                 |         -          |
| <img src="./src/images/c-v.sh.png" width="16"/> c-v.sh                     | https://c-v.sh               |         512 MB         | depends on the file size[^1] |                ✔️                 |         -          |
| x0.at                                                                      | https://x0.at                |         512 MB         | depends on the file size[^1] |                 -                 |         -          |
| <img src="./src/images/1filesharing.com.png" width="16"/> 1filesharing     | https://1filesharing.com     |          1 GB          |           10 days            |                ✔️                 |         -          |
| <img src="./src/images/nopaste.net.png" width="16"/> Nopaste               | https://nopaste.net          |          2 GB          |           21 days            |                 -                 |         -          |
| <img src="./src/images/tmpsend.com.png" width="16"/> TmpSend               | https://tmpsend.com          |          1 GB          |            7 days            |                 -                 |         -          |
| <img src="./src/images/mega4upload.net.png" width="16"/> Mega4up           | https://mega4upload.net      |         200 MB         |           15 days            |                ✔️                 |         -          |
| <img src="./src/images/hostuje.net.png" width="16"/> Hostuje               | https://hostuje.net          |         2.5 GB         |           90 days            |                ✔️                 |         -          |
| <img src="./src/images/uploadflix.com.png" width="16"/> UploadFlix         | https://uploadflix.com       |          3 GB          |           20 days            |                ✔️                 |         -          |
| <img src="./src/images/dz4up.com.png" width="16"/> DZ4Up                   | https://dz4up.com            |          2 GB          |           30 days            |                ✔️                 |         -          |
| <img src="./src/images/wdfiles.ru.png" width="16"/> WDFiles                | https://wdfiles.ru           |          3 GB          |           15 days            |                ✔️                 |         -          |
| <img src="./src/images/m1r.ai.png" width="16"/> m1rai                      | https://up.m1r.ai            |         100 MB         |           infinite           |                 -                 |         -          |
| <img src="./src/images/s3k.ai.png" width="16"/> s3kai                      | https://up.s3k.ai            |          1 GB          |           15 days            |                 -                 |         -          |
| <img src="./src/images/xup.in.png" width="16"/> XUP                        | https://www.xup.in           |         100 MB         |           150 days           |                ✔️                 |         -          |
| Filepv                                                                     | https://filepv.com           |          2 GB          |           30 days            |                 -                 |         -          |
| F2H                                                                        | https://f2h.io               |          1 GB          |           50 days            |                 -                 |         -          |
| ayaya.beauty                                                               | https://ayaya.beauty         |          1 GB          |           14 days            |                ✔️                 |         -          |
| <img src="./src/images/dropmb.com.png" width="16"/> DropMB                 | https://dropmb.com           |         512 MB         |           365 days           |                 -                 |         -          |
| <img src="./src/images/nelion.me.png" width="13"/> Nelion                  | https://nelion.me            |         20 MB          |            7 days            |                ✔️                 |         -          |
| <img src="./src/images/atomauth.com.png" width="16"/> Atomauth             | https://atomauth.com         |          1 GB          |           infinite           |                 -                 |         -          |
| <img src="./src/images/kawaii.su.png" width="16"/> imouto.kawaii.su        | https://imouto.kawaii.su     |         20 MB          |           30 days            |                 -                 |         -          |
| <img src="./src/images/do7go.com.png" width="16"/> DoodStream 🎞️          | https://doodstream.com       |        infinite        |           60 days            |                 -                 |         🔒         |
| <img src="./src/images/pixeldrain.com.png" width="16"/> Pixeldrain         | https://pixeldrain.com       |         20 GB          |           90 days            |                🔧                 |         🔒         |
| <img src="./src/images/drop.download.png" width="16"/> Drop.download       | https://drop.download        |         50 GB          |           10 days            |                 -                 |         🔒         |
| <img src="./src/images/filemoon.sx.png" width="16"/> FileMoon 🎞️          | https://filemoon.sx          |         50 GB          |           10 days            |                 -                 |         🔒         |
| <img src="./src/images/files.catbox.moe.png" width="16"/> Catbox           | https://catbox.moe           |         200 MB         |           infinite           |                🔧                 |         🔒         |
| <img src="./src/images/ddownload.com.png" width="16"/> ddownload           | https://ddownload.com        |          2 GB          |           30 days            |                🔧                 |         🔒         |
| <img src="./src/images/mp4upload.com.png" width="16"/> mp4upload 🎞️       | https://mp4upload.com        |         500 MB         |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/dropgalaxy.com.png" width="16"/> DropGalaxy         | https://dropgalaxy.com       |          5 GB          |           120 days           |                 -                 |         🔒         |
| <img src="./src/images/nitroflare.com.png" width="16"/> Nitroflare         | https://nitroflare.com       |         10 GB          |           90 days            |                 -                 |         🔒         |
| <img src="./src/images/vidoza.net.png" width="16"/> Vidoza 🎞️             | https://vidoza.net           |         50 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/katfile.com.png" width="16"/> Katfile               | https://katfile.com          |          5 GB          |           10 days            |                🔧                 |         🔒         |
| <img src="./src/images/rapidgator.net.png" width="16"/> Rapidgator         | https://rapidgator.net       |         80 GB          |           30 days            |                🔧                 |         🔒         |
| <img src="./src/images/streama2z.xyz.png" width="16"/> StreamA2Z 🎞️       | https://streama2z.com        |         10 GB          |           60 days            |                🔧                 |         🔒         |
| <img src="./src/images/strwish.com.png" width="16"/> StreamWish 🎞️        | https://streamwish.com       |         50 GB          |           infinite           |                 -                 |         🔒         |
| <img src="./src/images/rubystm.com.png" width="16"/> StreamRuby 🎞️        | https://streamruby.com       |         50 GB          |           10 days            |                 -                 |         🔒         |
| <img src="./src/images/voe.sx.png" width="16"/> Voe.sx 🎞️                 | https://voe.sx               |         25 GB          |           60 days            |                🔧                 |         🔒         |
| <img src="./src/images/devuploads.com.png" width="16"/> DevUploads         | https://devuploads.com       |          5 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/darkibox.com.png" width="16"/> Darkibox 🎞️         | https://darkibox.com         |         10 GB          |           30 days            |                🔧                 |         🔒         |
| <img src="./src/images/filegram.to.png" width="16"/> Filegram 🎞️          | https://filegram.to          |         15 GB          |           30 days            |                🔧                 |         🔒         |
| <img src="./src/images/goodstream.one.png" width="16"/> Goodstream 🎞️     | https://goodstream.one       |         25 GB          |           60 days            |                🔧                 |         🔒         |
| <img src="./src/images/dropload.io.png" width="16"/> Dropload 🎞️          | https://dropload.io          |          7 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/gett.su.png" width="16"/> GeTT                      | https://gett.su              |          2 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/oneupload.to.png" width="16"/> OneUpload 🎞️        | https://oneupload.to         |          4 GB          |           20 days            |                🔧                 |         🔒         |
| <img src="./src/images/smoothpre.com.png" width="16"/> EarnVids 🎞️        | https://earnvids.com         |         50 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/vinovo.to.png" width="16"/> Vinovo 🎞️              | https://vinovo.si            |         15 GB          |           60 days            |                 -                 |         🔒         |
| <img src="./src/images/uploadrar.com.png" width="16"/> Uploadrar           | https://uploadrar.com        |         30 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/listeamed.net.png" width="16"/> Vidguard 🎞️        | https://vidguard.to          |         15 GB          |           30 days            |                🔧                 |         🔒         |
| <img src="./src/images/savefiles.com.png" width="16"/> SaveFiles 🎞️       | https://savefiles.com        |         20 GB          |           15 days            |                🔧                 |         🔒         |
| <img src="./src/images/filespayouts.com.png" width="16"/> Filespayouts     | https://filespayouts.com     |         10 GB          |           60 days            |                 -                 |         🔒         |
| <img src="./src/images/fileaxa.com.png" width="16"/> Fileaxa               | https://fileaxa.com          |          1 GB          |           15 days            |                 -                 |         🔒         |
| <img src="./src/images/supervideo.cc.png" width="16"/> SuperVideo 🎞️      | https://supervideo.cc        |          6 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/mixloads.to.png" width="16"/> MixLoads              | https://mixloads.to          |         30 GB          |           20 days            |                 -                 |         🔒         |
| <img src="./src/images/ups2up.fun.png" width="16"/> Up4Stream              | https://up4stream.com        |         20 GB          |           15 days            |                🔧                 |         🔒         |
| <img src="./src/images/uqload.cx.png" width="16"/> Uqload 🎞️              | https://uqload.cx            |          4 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/lulustream.com.png" width="16"/> LuluStream 🎞️     | https://lulustream.com       |         150 GB         |           10 days            |                 -                 |         🔒         |
| <img src="./src/images/upfiles.com.png" width="16"/> UpFiles               | https://upfiles.com          |         25 GB          |           30 days            |                 -                 |         🔒         |
| <img src="./src/images/streambolt.tv.png" width="16"/> StreamBolt 🎞️      | https://streambolt.tv        |          5 GB          |           30 days            |                 -                 |         🔒         |
> [Don't know where to get your API key for a host?](https://polyuploader.vercel.app/get-api-keys)

### 📑 Details of hosts

| Category                             | Count |
| :----------------------------------- | :---: |
| 🌐 Number of hosts                   |  130  |
| 🔓 Hosts not requiring an API key    |  93   |
| ✨ Hosts supporting optional API key  |   9   |
| 🔒 Hosts requiring an API key        |  37   |
| 🗑️ Hosts supporting manual deletion |  55   |
| 🎞️ Specialist video streaming host  |  24   |

If you know of a host that I can add, please open an [issue](https://github.com/spel987/PolyUploader/issues).

<h1 align="center">
<img src="https://i.imgur.com/I7a1Tkb.jpeg">
</h1>

<details>
<summary>🖼️ See screenshots of the application</summary>

<img width="1140" height="730" alt="single_upload" src="https://i.imgur.com/y5z0g75.png" />
<img width="1140" height="730" alt="multiple_upload" src="https://i.imgur.com/jA4fVqw.png" />
<img width="1140" height="730" alt="history" src="https://i.imgur.com/rQZDzXI.png" />
<img width="1140" height="730" alt="api_keys" src="https://i.imgur.com/80laTjF.png" />
<img width="1140" height="730" alt="profiles" src="https://i.imgur.com/pswgfJq.png" />
<img width="1140" height="730" alt="settings_windows_context_menu" src="https://i.imgur.com/RuUJSrw.jpeg" />

</details>

# Comparison with [Mirrored.to](https://mirrored.to), [Mirrorace.org](https://mirrorace.org) and [MultiUp](https://multiup.io)

|                                                                           | PolyUploader | [Mirrored.to](https://mirrored.to) | [Mirrorace.org](https://mirrorace.org) | [MultiUp](https://multiup.io) |
| :------------------------------------------------------------------------ | :----------: | :--------------------------------: | :------------------------------------: | :---------------------------: |
| Number of hosting providers supported                                     |     130      |               42[^2]               |                 54[^3]                 |              44               |
| No need for a user account to fully use the service                       |      ✔️      |                 ❌                  |                   ❌                    |               ❌               |
| Maximum file size limit                                                   | infinite[^4] |               750MB                |                  5GB                   |             500GB             |
| History of uploaded files                                                 |      ✔️      |               ⚠️[^5]               |                 ⚠️[^5]                 |            ⚠️[^5]             |
| Flags up offline hosts and prevents the user from uploading files to them |      ✔️      |               ⚠️[^6]               |                   ❌                    |              ✔️               |
| Uploaded file can be deleted[^7]                                          |      ✔️      |                 ❌                  |                   ❌                    |               ❌               |
| Ability to upload a file from a URL                                       |      ✔️      |                 ✔️                 |                   ✔️                   |              ✔️               |
| Ability to upload multiple files simultaneously                           |      ❌       |               ✔️[^8]               |                 ✔️[^9]                 |              ✔️               |
| Profile features                                                          |      ✔️      |              ⚠️[^10]               |                ⚠️[^10]                 |            ⚠️[^10]            |
| Created links accessible from a shareable link                            |      ✔️      |                 ✔️                 |                   ✔️                   |              ✔️               |
| Supports user API keys for concerned hosts                                |      ✔️      |                 ✔️                 |                   ✔️                   |              ✔️               |
| Open-source                                                               |      ✔️      |                 ❌                  |                   ❌                    |               ❌               |
> The aim of this comparison is not to discredit Mirrored.to, Mirrorace.org and MultiUp or simply to say that PolyUploader is better. It is only a summary table of the functions supported or not by the 4 services to help you choose.

### 🗒️ Legend

| Emoji  | Meaning   |
| :---------: | :-----------: |
| ✔️       | Yes          |
| ❌       |    No        |
| ⚠️       | Partially    |

# Telemetry

PolyUploader collects minimal usage data (telemetry) to help improve the service. Only the host names and upload dates are collected, **never the full upload links**. 

This data is used to generate anonymous statistics available at [https://p-u.vercel.app/statistics](https://p-u.vercel.app/statistics).
It’s genuinely helpful for me as a developer (seeing that my software is used and works well is both motivating and rewarding).

For those who are cautious about telemetry, the PolyUploader API is fully open-source and publicly available here: https://github.com/spel987/PolyUploader-API.

# Managing CORS

To bypass CORS restrictions on certain hosts, PolyUploader uses a lightweight local HTTP proxy named [`warp-cors`](https://github.com/Bassetts/warp-cors). Instead of running the proxy as a standalone executable (`warp-cors.exe`), the logic has been integrated directly into the Rust backend. I've tweaked the `warp-cors` code to better suit my needs, especially for handling session cookies.

## 🤔 How it works

At startup, the app launches the `warp-cors` proxy server internally (on port `61337`). Rather than sending requests directly to `https://example.com`, they're routed through:

```
http://127.0.0.1:61337/https://example.com
```

This avoids any browser CORS errors entirely.

## 🪛 Integration

- The Rust backend imports and launches the `warp-cors` proxy via its library interface.
- Requests that require CORS bypass are automatically prefixed in the frontend.

## 🗒️ Example

```rust title="main.rs"
// Launch the warp-cors proxy
use tokio::runtime::Builder;
use warp_cors::app::{Config, run};

fn main() {
  std::thread::spawn(|| {
      let rt = Builder::new_multi_thread()
          .enable_all()
          .build()
          .unwrap();
      let cfg = Config { host: "0.0.0.0".into(), port: 61337 };
      rt.block_on(run(cfg));
  });
}
```

```js title="example.js"
// Use the proxy
const proxy = "http://127.0.0.1:61337/";
upload_to_host([
  proxy + "https://upload.gofile.io/uploadfile/",
  "POST",
  sent_data_form
]);
```

# Notes from the developer

To handle file uploads, I rely on various methods depending on the host: some provide APIs, others require converting cURL commands to JavaScript, and a few need request emulation based on their frontend behavior.

Maintaining support for over a hundred hosts has been a real challenge, especially as I’m working solo on this project while still pursuing my studies. While many hosts share similar logic (a lot of them run on XFileSharing Pro), each one brings its own quirks, making the work complex and often repetitive.

Special thanks to **Tux 528** ([@Tux528](https://github.com/Tux528)) for his valuable external feedback and all the ideas he brought to help improve and optimize the project.

If you enjoy the work and find it useful, feel free to ⭐ star the repository, it truly means a lot!

If you’d like to learn more, feel free to explore the repositories:
  - [PolyUploader-website](https://github.com/spel987/PolyUploader-website): contains the documentation
  - [PolyUploader-API](https://github.com/spel987/PolyUploader-API): powers the statistics, the unique shareable bundle links and other things to do with the database

<div align="center">
  <a href="https://github.com/spel987/PolyUploader-website" style="display: inline-block; margin-right: 20px;">
    <img src="https://i.imgur.com/T0v8isL.png" width="350">
  </a>
  <a href="https://github.com/spel987/PolyUploader-API" style="display: inline-block;">
    <img src="https://i.imgur.com/HxgaOxx.png" width="350">
  </a>
</div>

## ⭐ Star history

<a href="https://www.star-history.com/#spel987/PolyUploader&Timeline">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=spel987/PolyUploader&type=Timeline&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=spel987/PolyUploader&type=Timeline" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=spel987/PolyUploader&type=Timeline" />
 </picture>
</a>

# Credits

### Developer:

- spel987<br>
    Email: `spel987@pm.me`<br>
    GitHub: https://github.com/spel987<br>

### Contributors:

- Tux 528 ([GitHub](https://github.com/Tux528)): UX design, UI polishing, valuable feedback, testing, and ideas for improvement.
    
### Backend:

- Rust: https://www.rust-lang.org/
- Tauri: https://tauri.app/
- warp-cors: https://github.com/Bassetts/warp-cors/
  
### Frontend:

- Tailwind CSS: https://tailwindcss.com/
- Font Awesome: https://fontawesome.com/
- Flaticon (and author [DinosoftLabs](https://www.flaticon.com/authors/dinosoftlabs)): https://www.flaticon.com/free-icon/box_5899516
  
### The sites used

All the sites listed in the table [here](#supported-hosts).

# Suggestions

If you have any questions or suggestions, please open an [issue](https://github.com/spel987/PolyUploader/issues).

[^1]: **"depends on the file size"** means that the host keeps your files according to their weight. They use different algorithms. *For more information, please visit the chosen site.*
[^2]: Only 10 hosts are proposed when we don't use an account.
[^3]: Only 36 hosts are proposed when we don't use an account.. Many hosts are no longer supported, and I've found that around 60% of hosts are no longer functional.
[^4]: File size is not restricted by the software, but by the host. It all depends on the host's capacity.
[^5]: History is only available to registered users.
[^6]: Offline hosts are not deactivated, we need to go to "https://www.mirrored.to/p/host-status" for status information.
[^7]: Provided that the host is able to delete it and offers the ability to do so.
[^8]: This feature is limited to 20 files.
[^9]: This feature is limited to 50 files.
[^10]: Only a "profile" that checks off the favorite hosts selected in the settings. User account required.

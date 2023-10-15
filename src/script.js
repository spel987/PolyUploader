document.addEventListener("DOMContentLoaded", function () {

  const {ipcRenderer} = require('electron')
  const ipc = ipcRenderer

  const url_for_bypass_cors = "http://127.0.0.1:61337"
  
  const button_gofile = document.getElementById("button_gofile");
  const button_litterbox = document.getElementById("button_litterbox");
  const button_fileio = document.getElementById("button_fileio");
  const button_tmpfilesorg = document.getElementById("button_tmpfilesorg");
  const button_0x0 = document.getElementById("button_0x0");
  const button_cvsh = document.getElementById("button_cvsh");
  const button_kitc = document.getElementById("button_kitc");
  const button_oshi = document.getElementById("button_oshi");
  const button_filebin = document.getElementById("button_filebin");
  const button_transfersh = document.getElementById("button_transfersh");
  const button_frocdn = document.getElementById("button_frocdn");
  const button_bashupload = document.getElementById("button_bashupload");
  const button_curlby = document.getElementById("button_curlby");
  const button_x0at = document.getElementById("button_x0at");
  const button_tempfilesorg = document.getElementById("button_tempfilesorg");
  const button_uplooad = document.getElementById("button_uplooad");
  const button_tommoteam = document.getElementById("button_tommoteam");
  const button_anonymfile = document.getElementById("button_anonymfile");
  const button_anyfile = document.getElementById("button_anyfile");
  const button_gofilecc = document.getElementById("button_gofilecc");
  const button_tempfilesninja = document.getElementById("button_tempfilesninja");
  const button_pixeldrain = document.getElementById("button_pixeldrain");
  const button_uploadhub = document.getElementById("button_uploadhub");
  const button_1cloudfile = document.getElementById("button_1cloudfile");
  const button_bowfile = document.getElementById("button_bowfile");
  const button_zeroupload = document.getElementById("button_zeroupload");
  const button_uploadify = document.getElementById("button_uploadify");
  const button_anonfilesme = document.getElementById("button_anonfilesme");
  const button_anontransfer = document.getElementById("button_anontransfer");
  const button_anonsharing = document.getElementById("button_anonsharing");
  const button_tempsh = document.getElementById("button_tempsh");
  const button_uguuse = document.getElementById("button_uguuse");
  const button_nopaste = document.getElementById("button_nopaste");
  const button_udrop = document.getElementById("button_udrop");
  const button_tempsend = document.getElementById("button_tempsend");
  const button_1fichier = document.getElementById("button_1fichier");
  const button_turbobit = document.getElementById("button_turbobit");
  const button_hitfile = document.getElementById("button_hitfile");
  const button_fileupload = document.getElementById("button_fileupload");
  const button_hexupload = document.getElementById("button_hexupload");
  const button_mexash = document.getElementById("button_mexash");
  const button_rapidfileshare = document.getElementById("button_rapidfileshare");
  const button_sendcm = document.getElementById("button_sendcm");
  const button_uploadio = document.getElementById("button_uploadio");
  const button_usercloud = document.getElementById("button_usercloud");

  const close_button = document.getElementById("close_button");
  const minimize_button = document.getElementById("minimize_button")

  const update_popup = document.getElementById("update_popup")
  const new_version_text = document.getElementById("new_version_text")
  const current_version_text = document.getElementById("current_version_text")
  const popup_new_version_download = document.getElementById("popup_new_version_download")

  const upload_popup = document.getElementById("upload_popup");
  const popup_browse_button = document.getElementById("popup_browse_button");
  const popup_upload_button = document.getElementById("popup_upload_button");
  const popup_file_input = document.getElementById("popup_file_input");
  const final_upload_url = document.getElementById("final_upload_url");
  const copy_button = document.getElementById("copy_button");

  const conditions_of_use_link = document.getElementById("conditions_of_use_link");
  const table_of_providers = document.querySelector('table');
  const tbody_of_providers = table_of_providers.querySelector('tbody');
  const rows_of_providers = Array.from(tbody_of_providers.querySelectorAll('tr'));

  const sort_states = [null, null, null];

  let requests_controller = new AbortController()
  let controller_signal = requests_controller.signal

  close_button.addEventListener('click', () => {
    ipc.send("closeApp")
  })
  
  minimize_button.addEventListener('click', () => {
    ipc.send("minimizeApp")
  })

  ipcRenderer.on('current-version', (event, currentVersion) => {
    const current_version = currentVersion;

    fetch('https://api.github.com/repos/spel987/Automatic-File-Uploader/releases', {method: 'GET'})
    .then(response => response.json())
    .then(data => {
      const latest_version = data[0].tag_name

      new_version_text.innerHTML = 'A new version of Automatic-File-Downloader is now available : <b>' + latest_version + '<b>'
      popup_new_version_download.href = 'https://github.com/spel987/Automatic-File-Uploader/releases/tag/' + latest_version
      current_version_text.innerHTML = '(Current version : <b>'+ current_version +'</b>)'

      if (current_version != latest_version) {
        update_popup.classList.remove("hidden");
      }

      update_popup.addEventListener("click", function (event) {
        if (event.target === update_popup) {
          update_popup.classList.add("hidden");
        }})
    })
  });

  ipcRenderer.send('request-current-version');

  function upload_to_host(url, method, data, format, dataExtraction = [], regexExtraction = null, existingFinalUrl = null, urlPrefixToAdd = []) {

    disabled_upload_button()

    fetch(url, {
        method: method,
        body: data,
        signal: controller_signal,
        headers: {
          'X-Requested-With': '*',
        }
    })

    .then(response => {
        if (format === 'json') {
            return response.json();
        } else if (format === 'text') {
            return response.text()
        }
    })

    .then(data => {
      let final_url = null;
      
      if (existingFinalUrl) {
        final_url = existingFinalUrl

      } else if (regexExtraction) {
        if (regexExtraction[0] === 'match') {
          final_url = (urlPrefixToAdd[0] ? urlPrefixToAdd[0] : '') + (data.match(regexExtraction[1])[0]) + (urlPrefixToAdd[1] ? urlPrefixToAdd[1] : '')
        } else if (regexExtraction[0] === 'substr') {
          final_url = (urlPrefixToAdd[0] ? urlPrefixToAdd[0] : '') + (data.substr(data.indexOf(regexExtraction[1]) + regexExtraction[2])) + (urlPrefixToAdd[1] ? urlPrefixToAdd[1] : '')
        }
        
      } else {
        final_url = (urlPrefixToAdd[0] ? urlPrefixToAdd[0] : '') + (dataExtraction.reduce((initial_data, key) => initial_data?.[key], data)) + (urlPrefixToAdd[1] ? urlPrefixToAdd[1] : '')
      }
      
      if (final_url) {
        enable_button_and_display_result(final_url)
        copy_button.addEventListener("click", function() {
          copy_to_clipboard(final_url);
        });
      } else {
        enable_button_and_display_result("Error during upload. Check the console and requests in developper tools for more information.")
      }
    })

    .catch(error => {
      enable_button_and_display_result(error);
    });
  }

  function copy_to_clipboard(url) {
    navigator.clipboard.writeText(url)
  }

  function reset_popup() {
    upload_popup.classList.remove("hidden");
    popup_file_input.value = "";
    final_upload_url.textContent = "";
    popup_browse_button.textContent = "Browse";
    popup_upload_button.classList.add("opacity-50", "cursor-not-allowed");
    popup_upload_button.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500")
    popup_upload_button.setAttribute('disabled', '')
    popup_upload_button.innerHTML = "Upload";
    copy_button.classList.add("hidden");
  }

  function disabled_upload_button() {
    popup_upload_button.setAttribute('disabled', '')
    popup_upload_button.classList.add("cursor-not-allowed");
    popup_upload_button.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500", "active:scale-105")
  }

  function enable_button_and_display_result(result) {
    popup_upload_button.removeAttribute('disabled', '')
    popup_upload_button.classList.remove("cursor-not-allowed");
    popup_upload_button.innerHTML = 'Upload'
    popup_upload_button.classList.add("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500", "active:scale-105")
    if (String(result).includes('undef')) {
      final_upload_url.textContent = 'Error : undef (often when the file format is not supported).\n For more information, open the developper tool and look in the console and/or in the requests.'
      final_upload_url.href = "#"
      copy_button.classList.add("hidden")
    } else if (String(result).includes('https://') || String(result).includes('http://')) {
      final_upload_url.textContent = result
      final_upload_url.href = result
      copy_button.classList.remove("hidden")
    } else {
      final_upload_url.textContent = 'Error : ' + result + '\n For more information, open the developper tool and look in the console and/or in the requests.'
      final_upload_url.href = "#"
      copy_button.classList.add("hidden")
    }
  }  

  function upload_preparation(uploadButton, hostName, indicationsSendingFiles, conditionOfUseUrl) {
    uploadButton.addEventListener("click", function () {
      reset_popup()
      host = hostName
      final_upload_url.textContent = indicationsSendingFiles
      final_upload_url.href = "#"
      conditions_of_use_link.href = conditionOfUseUrl
    });
  }

  upload_preparation(button_gofile, "gofile", "Gofile has no known bugs or problems.", "https://gofile.io/terms")
  upload_preparation(button_litterbox, "litterbox", "Litterbox is regularly down.", "https://litterbox.catbox.moe/faq.php")
  upload_preparation(button_fileio, "fileio", "File.io has no known bugs or problems.", "https://www.file.io/tos/")
  upload_preparation(button_tmpfilesorg, "tmpfilesorg", "TmpFiles.org does not accept all file formats.", "https://tmpfiles.org/about")
  upload_preparation(button_0x0, "0x0", "0x0.st has no known bugs or problems.", "https://0x0.st/")
  upload_preparation(button_cvsh, "CV", "C-V.sh has no known bugs or problems.", "https://c-v.sh/")
  upload_preparation(button_kitc, "KITc", "Ki.tc has no known bugs or problems.", "https://logic-gate-demo.readthedocs.io/en/latest/readme.html")
  upload_preparation(button_oshi, "Oshi", "Ohsi.at is inaccessible from certain IPs with the error \"Connection reset\".", "https://oshi.at/abuse")
  upload_preparation(button_filebin, "Filebin", "Filebin often runs out of storage.", "https://filebin.net/terms")
  upload_preparation(button_transfersh, "TransferSh", "Transfer.sh has no known bugs or problems.", "https://transfer.sh/")
  upload_preparation(button_frocdn, "FroCDN", "FroCDN.com has no known bugs or problems.", "https://frocdn.com/tos.html")
  upload_preparation(button_bashupload, "Bashupload", "Bashupload.com allows only one download per link.", "https://bashupload.com/disclaimer")
  upload_preparation(button_curlby, "CurlBy", "Curl.by has no known bugs or problems.", "https://www.curl.by/disclaimer")
  upload_preparation(button_x0at, "x0At", "x0.at has no known bugs or problems.", "https://x0.at/")
  upload_preparation(button_tempfilesorg, "TempFilesOrg", "temp-file.org has no known bugs or problems.", "https://temp-file.org/en/page/terms-of-service")
  upload_preparation(button_uplooad, "Uplooad", "Uplooad has no known bugs or problems.", "https://uplooad.net/tos.html")
  upload_preparation(button_tommoteam, "TommoTeam", "Tommo.team has no known bugs or problems.", "https://tommo.team/faq.html")
  upload_preparation(button_anonymfile, "AnonymFile", "AnonymFiles imposes a 12-second waiting time before the file can be downloaded.", "https://anonymfile.com/terms")
  upload_preparation(button_gofilecc, "GofileCc", "Gofile.cc imposes a 12-second waiting time before the file can be downloaded.", "https://gofile.cc/terms")
  upload_preparation(button_anyfile, "Anyfile", "Anyfile has no known bugs or problems.", "https://anyfile.co/terms")
  upload_preparation(button_tempfilesninja, "TempFilesNinja", "tempfiles.ninja has no known bugs or problems.", "https://tempfiles.ninja/")
  upload_preparation(button_pixeldrain, "Pixeldrain", "Pixeldrain has no known bugs or problems.", "https://pixeldrain.com/abuse")
  upload_preparation(button_uploadhub, "UploadHub", "UploadHub imposes a 10-second waiting time before the file can be downloaded, and is sometimes down.", "https://uploadhub.to/tos.html")
  upload_preparation(button_1cloudfile, "1Cloudfile", "1Cloudfile has no known bugs or problems.", "https://1cloudfile.com/terms")
  upload_preparation(button_bowfile, "Bowfile", "Bowfile has no known bugs or problems.", "https://bowfile.com/terms")
  upload_preparation(button_zeroupload, "ZeroUpload", "Zero Upload imposes a 5-second waiting time before the file can be downloaded.", "https://zeroupload.com/terms")
  upload_preparation(button_uploadify, "Uploadify", "Uplodify imposes a 20-second waiting time before the file can be downloaded.", "https://uploadify.net/terms.html")
  upload_preparation(button_anonfilesme, "AnonFilesMe", "AnonFiles.me imposes a 3-second waiting time before the file can be downloaded.", "https://anonfiles.me/terms")
  upload_preparation(button_anontransfer, "AnonTransfer", "AnonTransfer does not accept all file formats.", "https://anontransfer.com/terms")
  upload_preparation(button_anonsharing, "AnonSharing", "AnonSharing imposes a 20-second waiting time before the file can be downloaded.", "https://anonsharing.com/terms")
  upload_preparation(button_tempsh, "TempSh", "Temp.sh has no known bugs or problems.", "https://temp.sh/")
  upload_preparation(button_uguuse, "UguuSe", "Uguu.se has no known bugs or problems.", "https://uguu.se/faq.html")
  upload_preparation(button_nopaste, "Nopaste", "Nopaste has no known bugs or problems.", "https://nopaste.net/")
  upload_preparation(button_udrop, "Udrop", "udrop has no known bugs or problems.", "https://www.udrop.com/terms")
  upload_preparation(button_tempsend, "Tempsend", "Tempsend has no known bugs or problems.", "https://tempsend.com/")
  upload_preparation(button_1fichier, "1fichier", "1fichier limits the connection during download and imposes a waiting time between file downloads.", "https://img.1fichier.com/2021-10-01-CGU.pdf")
  upload_preparation(button_turbobit, "Turbobit", "Turbobit limits the connection during download and imposes a waiting time between file downloads.", "https://turbobit.net/rules")
  upload_preparation(button_hitfile, "Hitfile", "Hitfile limits the connection during download and imposes a waiting time between file downloads.", "https://hitfile.net/rules")
  upload_preparation(button_fileupload, "FileUpload", "file-upload.org limits the connection during download and imposes a waiting time before the file can be downloaded.", "https://www.file-upload.org/tos.html")
  upload_preparation(button_hexupload, "HexUpload", "HexUpload does not accept jpeg/jpg/png files.", "https://hexupload.net/tos.html")
  upload_preparation(button_mexash, "MexaSh", "Mexa.sh does not accept .exe files.", "https://mexa.sh/tos.html")
  upload_preparation(button_rapidfileshare, "RapidFileShare", "RapidFileShare limits the connection and restricts downloads to 1GB per day.", "http://rapidfileshare.net/tos.html")
  upload_preparation(button_sendcm, "SendCm", "Send.cm has no known bugs or problems.", "https://send.cm/terms")
  upload_preparation(button_uploadio, "UpLoadIo", "up-load.io imposes a 30-second delay before the file can be downloaded.", "https://up-load.io/tos.html")
  upload_preparation(button_usercloud, "Usercloud", "Usercloud has no known bugs or problems.", "https://userscloud.com/tos.html")

  popup_browse_button.addEventListener("click", function () {
    popup_file_input.click();
  });
  
  popup_file_input.addEventListener("change", function () {
    const fileName = popup_file_input.files[0].name;
    if (fileName.length > 30) {
      popup_browse_button.textContent = fileName.substring(0, 30) + "...";;
    } else {
      popup_browse_button.textContent = fileName;
    }
    popup_upload_button.classList.remove("opacity-50", "cursor-not-allowed");
    popup_upload_button.classList.add("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500")
    popup_upload_button.removeAttribute('disabled', '')
    });
    
    upload_popup.addEventListener("click", function (event) {
      if (event.target === upload_popup) {
        requests_controller.abort();
        requests_controller = new AbortController();
        controller_signal = requests_controller.signal;
        upload_popup.classList.add("hidden");
      }
  });
  
  popup_upload_button.addEventListener("click", function (event) {
    event.preventDefault();

    popup_upload_button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...'

    const sent_data_form = new FormData();

    if (host === "gofile") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://store2.gofile.io/uploadFile', 'POST', sent_data_form, 'json', ['data', 'downloadPage'])

    } else if (host === "litterbox") {

      sent_data_form.append('reqtype', 'fileupload');
      sent_data_form.append('time', '24h');
      sent_data_form.append("fileToUpload", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://litterbox.catbox.moe/resources/internals/api.php', 'POST', sent_data_form, 'text')

    } else if (host === "fileio") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host('https://file.io/', 'POST', sent_data_form, 'json', ['link'])

    } else if (host === "tmpfilesorg") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host('https://tmpfiles.org/api/v1/upload', 'POST', sent_data_form, 'json', ['data', 'url'])
     
    } else if (host === "0x0") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://0x0.st/', 'POST', sent_data_form, 'text')
    
    } else if (host === "CV") {

      sent_data_form.append("a", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://c-v.sh/', 'POST', sent_data_form, 'text', [], ['match', /https:\/\/c-v\.sh\/[^\s]+/])

    } else if (host === "KITc") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://ki.tc/file/u/', 'POST', sent_data_form, 'json', ['file', 'download_page'])

    } else if (host === "Oshi") {

      sent_data_form.append("f", popup_file_input.files[0]);
      sent_data_form.append("expire", "120");
      upload_to_host(url_for_bypass_cors + '/https://oshi.at/', 'POST', sent_data_form, 'text', [], ['substr', 'DL:', 4])

    } else if (host === "Filebin") {

      const bin = (Math.random() + 1).toString(36).substring(2, 12);
      const filename = (Math.random() + 1).toString(36).substring(2, 12);
      const url_Filebin = `https://filebin.net/${bin}/${filename}`
      upload_to_host(url_for_bypass_cors + '/' + url_Filebin, 'POST', popup_file_input.files[0], 'json', [], null, [url_Filebin])

    } else if (host === "TransferSh") {

      upload_to_host(url_for_bypass_cors + '/https://transfer.sh/${popup_file_input.files[0].name}', 'PUT', popup_file_input.files[0], 'text')

    } else if (host === "FroCDN") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://frocdn.com/curl.php', 'POST', sent_data_form, 'text', [], ['substr', ['https://cdn1.frocdn.ch/'], 0])

    } else if (host === "Bashupload") {

      sent_data_form.append("file_1", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://bashupload.com/', 'POST', sent_data_form, 'text', [], ['match', /https:\/\/bashupload\.com\/[^\s]+/])
    
    } else if (host === "CurlBy") {

      sent_data_form.append("file_3", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://curl.by/', 'POST', sent_data_form, 'text', [], ['match', /http:\/\/curl\.by\/[^\s]+/])
  
    } else if (host === "x0At") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://x0.at/', 'POST', sent_data_form, 'text')

    } else if (host === "TempFilesOrg") {

      sent_data_form.append("file", popup_file_input.files[0]);
      sent_data_form.append("upload_auto_delete", "8");
      upload_to_host(url_for_bypass_cors + '/https://temp-file.org/upload', 'POST', sent_data_form, 'json', ['download_link'])

    } else if (host === "Uplooad") {

      sent_data_form.append("file_0", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://serv1.uplooad.net/cgi-bin/upload.cgi?upload_type=file&utype=anon', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['https://uplooad.net/'])
    
    } else if (host === "TommoTeam") {

      sent_data_form.append("files[]", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://www.tommo.team/upload.php', 'POST', sent_data_form, 'json', ['files', 0, 'url'])

    } else if (host === "AnonymFile") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host('https://anonymfile.com/api/v1/upload', 'POST', sent_data_form, 'json', ['data', 'file', 'url', 'full'])

    } else if (host === "Anyfile") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host('https://anyfile.co/api/v1/upload', 'POST', sent_data_form, 'json', ['data', 'file', 'url', 'full'])
    
    } else if (host === "GofileCc") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host('https://gofile.cc/api/v1/upload', 'POST', sent_data_form, 'json', ['data', 'file', 'url', 'full'])

    } else if (host === "TempFilesNinja") {

      upload_to_host(url_for_bypass_cors + '/https://tempfiles.ninja/api/upload?${popup_file_input.files[0].name}', 'POST', popup_file_input.files[0], 'json', ['download_url'])

    } else if (host === "Pixeldrain") {

      upload_to_host(url_for_bypass_cors + '/https://pixeldrain.com/api/file/${popup_file_input.files[0].name}', 'PUT', popup_file_input.files[0], 'json', ['id'], null, null, ['https://pixeldrain.com/u/'])

    } else if (host === "UploadHub") {

      sent_data_form.append("file_0", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://upload100.uploadhub.to:83/cgi-bin/upload.cgi?upload_type=file&utype=anon', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['https://uploadhub.to/'])

    } else if (host === "1Cloudfile") {

      sent_data_form.append("files[]", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://fs9.1cloudfile.com/ajax/file_upload_handler', 'POST', sent_data_form, 'json', [0, 'url'])

    } else if (host === "Bowfile") {

      sent_data_form.append("files[]", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://fs8.bowfile.com/ajax/file_upload_handler', 'POST', sent_data_form, 'json', [0, 'url'])
    
    } else if (host === "ZeroUpload") {

      sent_data_form.append("files[]", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://ww2.zeroupload.xyz/ajax/file_upload_handler', 'POST', sent_data_form, 'json', [0, 'url'])
    
    } else if (host === "Uploadify") {

      sent_data_form.append("files[]", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://uploadify.net/core/page/ajax/file_upload_handler.ajax.php', 'POST', sent_data_form, 'json', [0, 'url'])
    
    } else if (host === "AnonFilesMe") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host('https://anonfiles.me/api/v1/upload', 'POST', sent_data_form, 'json', ['data', 'file', 'url', 'full'])

    } else if (host === "AnonTransfer") {

      sent_data_form.append("file", popup_file_input.files[0]);
      upload_to_host(url_for_bypass_cors + '/https://www.anontransfer.com/upload.php', 'POST', sent_data_form, 'json', ['uri'])

    } else if (host === "AnonSharing") {

      sent_data_form.append("files[]", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://anonsharing.com/ajax/file_upload_handler', 'POST', sent_data_form, 'json', [0, 'url'])

    } else if (host === "TempSh") {

      sent_data_form.append("file", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://temp.sh/upload', 'POST', sent_data_form, 'text')

    } else if (host === "UguuSe") {

      sent_data_form.append("files[]", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://uguu.se/upload.php', 'POST', sent_data_form, 'json', ['files', 0, 'url'])

    } else if (host === "Nopaste") {

      upload_to_host(url_for_bypass_cors + '/https://nopaste.net/', 'PUT', popup_file_input.files[0], 'text', [], ['match', /https:\/\/nopaste\.net\/([A-Za-z0-9]+)/])
    
    } else if (host === "Udrop") {

      sent_data_form.append("files[]", popup_file_input.files[0])
      upload_to_host(url_for_bypass_cors + '/https://www.udrop.com/ajax/file_upload_handler', 'POST', sent_data_form, 'json', [0, 'url'])

    } else if (host === "Tempsend") {

        sent_data_form.append("file", popup_file_input.files[0])
        sent_data_form.append("expire", '604800')
  
        upload_to_host(url_for_bypass_cors + '/https://tempsend.com/send', 'POST', sent_data_form, 'text', [], ['match', /https:\/\/tempsend\.com\/([A-Za-z0-9]+)/])
    
    } else if (host === "1fichier") {

      disabled_upload_button()

      fetch(url_for_bypass_cors + '/https://api.1fichier.com/v1/upload/get_upload_server.cgi', {method: 'POST', headers: {'Content-Type': 'application/json', 'X-Requested-With': '*'}})
      .then(response => response.json())
      .then(data => {
        const url_1fichier_for_upload = data.url
        const id_1fichier_for_upload = data.id

        sent_data_form.append("file[]", popup_file_input.files[0])
        sent_data_form.append("send_ssl", 'on')
        sent_data_form.append("domain", '0')
        sent_data_form.append("mail", '')
        sent_data_form.append("dpass", '')
        sent_data_form.append("mails", '')
        sent_data_form.append("message", '')
        sent_data_form.append("did", '0')
        sent_data_form.append("submit", 'Envoyer')
  
        upload_to_host(url_for_bypass_cors + '/https://' + url_1fichier_for_upload + '/upload.cgi?id=' + id_1fichier_for_upload, 'POST', sent_data_form, 'text', [], ['match', /https:\/\/1fichier\.com\/\?([A-Za-z0-9]+)/])
      })

    } else if (host === "Turbobit") {

      sent_data_form.append("apptype", 'fd1')
      sent_data_form.append("sort-by", 'defaultSort')
      sent_data_form.append("sort-by", 'defaultSort')
      sent_data_form.append("sort-by", 'defaultSort')
      sent_data_form.append("Filedata", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/https://s341.turbobit.net/uploadfile', 'POST', sent_data_form, 'json', ['id'], null, null, ['https://turbobit.net/', '.html'])

    } else if (host === "Hitfile") {

      sent_data_form.append("apptype", 'fd2')
      sent_data_form.append("Filedata", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/https://s379.hitfile.net/uploadfile', 'POST', sent_data_form, 'json', ['id'], null, null, ['https://hitfile.net/'])

    } else if (host === "FileUpload") {

      sent_data_form.append("sess_id", '')
      sent_data_form.append("utype", 'anon')
      sent_data_form.append("file_descr", '')
      sent_data_form.append("file_public", '1')
      sent_data_form.append("link_rcpt", '')
      sent_data_form.append("link_pass", '')
      sent_data_form.append("to_folder", '')
      sent_data_form.append("upload", 'Start upload')
      sent_data_form.append("", 'Add more')
      sent_data_form.append("keepalive", '1')
      sent_data_form.append("file_0", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/https://f3.file-upload.download/cgi-bin/upload.cgi?upload_type=file&utype=anon', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['https://file-upload.org/'])

    } else if (host === "HexUpload") {

      sent_data_form.append("sess_id", '')
      sent_data_form.append("utype", 'anon')
      sent_data_form.append("mode", '')
      sent_data_form.append("file_public", '')
      sent_data_form.append("link_rcpt", '')
      sent_data_form.append("link_pass", '')
      sent_data_form.append("keepalive", '1')
      sent_data_form.append("file_0", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/https://cloudflare-944btwd2ivy.mx-content-delivery.com/cgi-bin/upload.cgi?upload_type=file&utype=anon', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['https://hexupload.net/'])

    } else if (host === "MexaSh") {

      sent_data_form.append("sess_id", '')
      sent_data_form.append("utype", 'anon')
      sent_data_form.append("to_folder", '')
      sent_data_form.append("", 'Start upload')
      sent_data_form.append("", 'Add more')
      sent_data_form.append("keepalive", '1')
      sent_data_form.append("file_0", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/https://srv29.mexa.sh/cgi-bin/upload.cgi?upload_type=file', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['https://mexa.sh/', '.html'])

    } else if (host === "RapidFileShare") {

      sent_data_form.append("sess_id", '')
      sent_data_form.append("utype", 'anon')
      sent_data_form.append("file_descr", '')
      sent_data_form.append("file_public", '')
      sent_data_form.append("link_rcpt", '')
      sent_data_form.append("link_pass", '')
      sent_data_form.append("to_folder", '')
      sent_data_form.append("upload", 'Start upload')
      sent_data_form.append("", 'Add more')
      sent_data_form.append("keepalive", '1')
      sent_data_form.append("file_0", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/http://trinity.rapidfileshare.net/cgi-bin/upload.cgi?upload_type=file&utype=anon', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['http://www.rapidfileshare.net/', '.html'])

    } else if (host === "SendCm") {

      sent_data_form.append("sess_id", '')
      sent_data_form.append("utype", 'anon')
      sent_data_form.append("hidden", '')
      sent_data_form.append("file_public", '')
      sent_data_form.append("enableemail", '')
      sent_data_form.append("link_rcpt", '')
      sent_data_form.append("link_pass", '')
      sent_data_form.append("file_expire_time", '15')
      sent_data_form.append("file_expire_unit", 'DAY')
      sent_data_form.append("file_max_dl", '')
      sent_data_form.append("keepalive", '1')
      sent_data_form.append("file_0", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/https://4884.send.cm/cgi-bin/upload.cgi?upload_type=file&utype=anon', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['https://send.cm/'])

    } else if (host === "UpLoadIo") {

      sent_data_form.append("sess_id", '')
      sent_data_form.append("utype", 'anon')
      sent_data_form.append("file_public", '1')
      sent_data_form.append("link_rcpt", '')
      sent_data_form.append("link_pass", '')
      sent_data_form.append("to_folder", '')
      sent_data_form.append("keepalive", '1')
      sent_data_form.append("file_0", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/https://s2.up-load.download/cgi-bin/upload.cgi?upload_type=file&utype=anon', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['https://up-load.io/'])

    } else if (host === "Usercloud") {

      sent_data_form.append("sess_id", '')
      sent_data_form.append("utype", 'anon')
      sent_data_form.append("link_rcpt", '')
      sent_data_form.append("link_pass", '')
      sent_data_form.append("keepalive", '1')
      sent_data_form.append("file_0", popup_file_input.files[0])

      upload_to_host(url_for_bypass_cors + '/https://u3174.userscloud.com/cgi-bin/upload.cgi?upload_type=file&utype=anon', 'POST', sent_data_form, 'json', [0, 'file_code'], null, null, ['https://userscloud.com/'])

    }
  });

  // I'll be honest, the part of the script that sorts the hosts according to their maximum file size and the time before the file is deleted was generated with ChatGPT, but I tried to understand and decompose it as much as possible to get a better view.
  const sort_table = (sortIndex, getValue) => {
    const sort_order = sort_states[sortIndex] === 'asc' ? -1 : 1;

    rows_of_providers.sort((rowA, rowB) => {
      const valueA = getValue(rowA.cells[sortIndex]);
      const valueB = getValue(rowB.cells[sortIndex]);
      return sort_order * (valueB - valueA);
    });

    tbody_of_providers.innerHTML = '';
    rows_of_providers.forEach((row, index) => {
      const originalClass = index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700';
      row.classList.remove('bg-slate-800', 'bg-slate-700');
      row.classList.add(originalClass, 'alternate-row');
      tbody_of_providers.appendChild(row);
    });

    sort_states[sortIndex] = sort_states[sortIndex] === 'asc' ? 'desc' : 'asc';
  };

  const get_max_size_file_value = cell => {
      const text = cell.textContent.trim();
      if (text === 'infinite') return Infinity;
      const unit = text.slice(-2);
      const size = parseFloat(text);
      switch (unit) {
        case 'GB':
          return size * 1024;
        case 'MB':
          return size;
        default:
          return 0;
      }
    };

    const get_expire_value = cell => {
      const text = cell.textContent.trim();
      if (text === 'infinite') return Infinity;
      const unit = text.slice(-1);
      const time = parseFloat(text);
      switch (unit) {
        case 'd':
          return time * 24 * 60;
        case 'h':
          return time * 60;
        default:
          return 0;
      }
    };

    document.getElementById('max_file_size_header').addEventListener('click', () => {
      sort_table(1, get_max_size_file_value);
    });

    document.getElementById('expire_header').addEventListener('click', () => {
      sort_table(2, get_expire_value);
    }); 


    const search_input = document.getElementById('search_input');

    search_input.addEventListener('input', () => {
      const searchTerm = search_input.value.toLowerCase();

      rows_of_providers.forEach((row) => {
        const providerName = row.cells[0].textContent.toLowerCase();
        const isSearchResult = providerName.includes(searchTerm);

        if (isSearchResult) {
          row.classList.add('search-result'); 
          row.classList.remove("cursor-not-allowed", 'blur-[2px]');
        } else {
          row.classList.remove('search-result');
          row.classList.add("cursor-not-allowed", 'blur-[2px]');
        }
      });

      rows_of_providers.sort((rowA, rowB) => {
        const isSearchResultA = rowA.classList.contains('search-result');
        const isSearchResultB = rowB.classList.contains('search-result');

        if (isSearchResultA && !isSearchResultB) {
          return -1;
        } else if (!isSearchResultA && isSearchResultB) {
          return 1;
        } else {
          return 0;
        }
      });

      tbody_of_providers.innerHTML = '';
      rows_of_providers.forEach((row, index) => {
        const originalClass = index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700';
        row.classList.remove('bg-slate-800', 'bg-slate-700');
        row.classList.add(originalClass, 'alternate-row');
        tbody_of_providers.appendChild(row);
      });
    });
});
document.addEventListener("DOMContentLoaded", function () {

    const {ipcRenderer} = require('electron')
    const ipc = ipcRenderer

    const urlForBypassCors = "http://127.0.0.1:61337"
    
    const uploadButtonGoFile = document.getElementById("uploadButtonGoFile");
    const uploadButtonLitterbox = document.getElementById("uploadButtonLitterbox");
    const uploadButtonFileIo = document.getElementById("uploadButtonFileIo");
    const uploadFormTmpfilesOrg = document.getElementById("uploadFormTmpfilesOrg");
    const uploadButton0x0 = document.getElementById("uploadButton0x0");
    const uploadButtonCVSh = document.getElementById("uploadFormCVSh");
    const uploadButtonKITc = document.getElementById("uploadButtonKITc");
    const uploadButtonOshi = document.getElementById("uploadFormOshi");
    const uploadButtonFilebin = document.getElementById("uploadButtonFilebin");
    const uploadButtonTransferSh = document.getElementById("uploadFormtransferSh");
    const uploadButtonFroCDN = document.getElementById("uploadButtonFroCDN");
    const uploadButtonBashupload = document.getElementById("uploadButtonBashupload");
    const uploadButtonCurlBy = document.getElementById("uploadButtonCurlBy");
    const uploadButtonx0At = document.getElementById("uploadButtonx0At");
    const uploadButtonTempFilesOrg = document.getElementById("uploadButtonTempFileOrg");
    const uploadButtonUplooad = document.getElementById("uploadButtonUplooad");
    const uploadButtonTempSendCom = document.getElementById("uploadButtonTempSendCom");
    const uploadButtonTommoTeam = document.getElementById("uploadButtonTommoTeam");
    const uploadButtonAnonymFile = document.getElementById("uploadButtonAnonymFile");
    const uploadButtonAnyfile = document.getElementById("uploadButtonAnyfile");
    const uploadButtonGofileCc = document.getElementById("uploadButtonGofileCc");
    const uploadButtonTempFilesNinja = document.getElementById("uploadButtonTempFilesNinja");
    const uploadButtonPixeldrain = document.getElementById("uploadButtonPixeldrain");
    const uploadButtonUploadHub = document.getElementById("uploadButtonUploadHub");
    const uploadButton1Cloudfile = document.getElementById("uploadButton1Cloudfile");
    const uploadButtonBowfile = document.getElementById("uploadButtonBowfile");
    const uploadButtonZeroUpload = document.getElementById("uploadButtonZeroUpload");
    const uploadButtonUploadify = document.getElementById("uploadButtonUploadify");
    const uploadButtonAnonFilesMe = document.getElementById("uploadButtonAnonFilesMe");
    const uploadButtonAnonTransfer = document.getElementById("uploadButtonAnonTransfer");
    const uploadButtonAnonSharing = document.getElementById("uploadButtonAnonSharing");

    const closeButton = document.getElementById("closeButton");
    const minimizeButton = document.getElementById("minimizeButton")

    const popup = document.getElementById("popup");
    const popupBrowseButton = document.getElementById("popupBrowseButton");
    const popupUploadButton = document.getElementById("popupUploadButton");
    const popupFileInput = document.getElementById("popupFileInput");
    const urlFinalUpload = document.getElementById("urlFinalUpload");
    const copyButton = document.getElementById("copyButton");
    const conditionOfUse = document.getElementById("conditionsOfUse");
    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const sortStates = [null, null, null];

    let controller = new AbortController()
    let signal = controller.signal

    closeButton.addEventListener('click', () => {
      ipc.send("closeApp")
    })
    
    minimizeButton.addEventListener('click', () => {
      ipc.send("minimizeApp")
    })


    function uploadToHost(url, method, data, format, successCallback, errorCallback) {

      fetch(url, {
          method: method,
          body: data,
          signal: signal,
          headers: {
            'X-Requested-With': '*',
          }

      })
  
      .then(response => {
          if (format === "json") {
              return response.json();
          } else if (format === "text") {
              return response.text()
          } else {
              console.log("Error : unsurported format")
          }
      })
  
      .then(data => {
          successCallback(data);
      })
  
      .catch(error => {
          errorCallback(error);
      });
  }

    function copy_to_clipboard(url) {
      navigator.clipboard.writeText(url)
    }

    function reset_popup() {
      popup.classList.remove("hidden");
      popupFileInput.value = "";
      urlFinalUpload.textContent = "";
      popupBrowseButton.textContent = "Browse";
      popupUploadButton.classList.add("opacity-50", "cursor-not-allowed");
      popupUploadButton.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500")
      popupUploadButton.setAttribute('disabled', '')
      popupUploadButton.innerHTML = "Upload";
      copyButton.classList.add("hidden");
    }

    function desactivate_button_when_upload() {
      popupUploadButton.setAttribute('disabled', '')
      popupUploadButton.classList.add("cursor-not-allowed");
      popupUploadButton.classList.remove("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500")
    }

    function activate_button_and_show_final_url(final_url) {
      popupUploadButton.removeAttribute('disabled', '')
      popupUploadButton.classList.remove("cursor-not-allowed");
      popupUploadButton.innerHTML = 'Upload'
      urlFinalUpload.textContent = final_url
      urlFinalUpload.href = final_url
      copyButton.classList.remove("hidden")
      popupUploadButton.classList.add("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500")
    }

    function activate_button_when_error(error) {
      urlFinalUpload.textContent = "Error : " + error
      popupUploadButton.innerHTML = 'Upload'
      popupUploadButton.classList.add("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500")
      popupUploadButton.removeAttribute('disabled', '')
      urlFinalUpload.href = "#"
      popupUploadButton.classList.remove("cursor-not-allowed");
    }

    function uploadPreparation(uploadButton, hostName, indications, conditionOfUseUrl) {
      uploadButton.addEventListener("click", function () {
        reset_popup()
        host = hostName
        urlFinalUpload.textContent = indications
        urlFinalUpload.href = "#"
        conditionOfUse.href = conditionOfUseUrl
      });
    }

    uploadPreparation(uploadButtonGoFile, "gofile", "Gofile has no known bugs or problems.", "https://gofile.io/terms")
    uploadPreparation(uploadButtonLitterbox, "litterbox", "Litterbox is regularly down.", "https://litterbox.catbox.moe/faq.php")
    uploadPreparation(uploadButtonFileIo, "fileio", "File.io has no known bugs or problems.", "https://www.file.io/tos/")
    uploadPreparation(uploadFormTmpfilesOrg, "tmpfilesorg", "TmpFiles.org does not accept all file formats.", "https://tmpfiles.org/about")
    uploadPreparation(uploadButton0x0, "0x0", "0x0.st has no known bugs or problems.", "https://0x0.st/")
    uploadPreparation(uploadButtonCVSh, "CV", "C-V.sh has no known bugs or problems.", "https://c-v.sh/")
    uploadPreparation(uploadButtonKITc, "KITc", "Ki.tc has no known bugs or problems.", "https://logic-gate-demo.readthedocs.io/en/latest/readme.html")
    uploadPreparation(uploadButtonOshi, "Oshi", "Ohsi.at is inaccessible from certain IPs with the error \"Connection reset\".", "https://oshi.at/abuse")
    uploadPreparation(uploadButtonFilebin, "Filebin", "Filebin often runs out of storage.", "https://filebin.net/terms")
    uploadPreparation(uploadButtonTransferSh, "TransferSh", "Transfer.sh has no known bugs or problems.", "https://transfer.sh/")
    uploadPreparation(uploadButtonFroCDN, "FroCDN", "FroCDN.com has no known bugs or problems.", "https://frocdn.com/tos.html")
    uploadPreparation(uploadButtonBashupload, "Bashupload", "Bashupload.com allows only one download per link.", "https://bashupload.com/disclaimer")
    uploadPreparation(uploadButtonCurlBy, "CurlBy", "Curl.by has no known bugs or problems.", "https://www.curl.by/disclaimer")
    uploadPreparation(uploadButtonx0At, "x0At", "x0.at has no known bugs or problems.", "https://x0.at/")
    uploadPreparation(uploadButtonTempFilesOrg, "TempFilesOrg", "temp-file.org has no known bugs or problems.", "https://temp-file.org/en/page/terms-of-service")
    uploadPreparation(uploadButtonUplooad, "Uplooad", "Uplooad has no known bugs or problems.", "https://uplooad.net/tos.html")
    uploadPreparation(uploadButtonTempSendCom, "TempSendCom", "Tempsend has no known bugs or problems.", "https://tempsend.com/")
    uploadPreparation(uploadButtonTommoTeam, "TommoTeam", "Tommo.team has no known bugs or problems.", "https://tommo.team/faq.html")
    uploadPreparation(uploadButtonAnonymFile, "AnonymFile", "AnonymFiles imposes a 12-second waiting time before the file can be downloaded.", "https://anonymfile.com/terms")
    uploadPreparation(uploadButtonGofileCc, "Anyfile", "Anyfile has no known bugs or problems.", "https://anyfile.co/terms")
    uploadPreparation(uploadButtonAnyfile, "GofileCc", "Gofile.cc imposes a 12-second waiting time before the file can be downloaded.", "https://gofile.cc/terms")
    uploadPreparation(uploadButtonTempFilesNinja, "TempFilesNinja", "tempfiles.ninja has no known bugs or problems.", "https://tempfiles.ninja/")
    uploadPreparation(uploadButtonPixeldrain, "Pixeldrain", "Pixeldrain has no known bugs or problems.", "https://pixeldrain.com/abuse")
    uploadPreparation(uploadButtonUploadHub, "UploadHub", "UploadHub imposes a 10-second waiting time before the file can be downloaded.", "https://uploadhub.to/tos.html")
    uploadPreparation(uploadButton1Cloudfile, "1Cloudfile", "1Cloudfile has no known bugs or problems.", "https://1cloudfile.com/terms")
    uploadPreparation(uploadButtonBowfile, "Bowfile", "Bowfile has no known bugs or problems.", "https://bowfile.com/terms")
    uploadPreparation(uploadButtonZeroUpload, "ZeroUpload", "Zero Upload imposes a 5-second waiting time before the file can be downloaded.", "https://zeroupload.com/terms")
    uploadPreparation(uploadButtonUploadify, "Uploadify", "Uplodify imposes a 20-second waiting time before the file can be downloaded.", "https://uploadify.net/terms.html")
    uploadPreparation(uploadButtonAnonFilesMe, "AnonFilesMe", "AnonFiles.me imposes a 3-second waiting time before the file can be downloaded.", "https://anonfiles.me/terms")
    uploadPreparation(uploadButtonAnonTransfer, "AnonTransfer", "AnonTransfer does not accept all file formats.", "https://anontransfer.com/terms")
    uploadPreparation(uploadButtonAnonSharing, "AnonSharing", "AnonSharing imposes a 20-second waiting time before the file can be downloaded.", "https://anonsharing.com/terms")

    popupBrowseButton.addEventListener("click", function () {
      popupFileInput.click();
    });
    
    popupFileInput.addEventListener("change", function () {
    const fileName = popupFileInput.files[0].name;
    if (fileName.length > 30) {
      popupBrowseButton.textContent = fileName.substring(0, 30) + "...";;
    } else {
      popupBrowseButton.textContent = fileName;
    }
    popupUploadButton.classList.remove("opacity-50", "cursor-not-allowed");
    popupUploadButton.classList.add("transition", "hover:scale-105", "hover:from-red-500", "hover:to-rose-500")
    popupUploadButton.removeAttribute('disabled', '')
    });
    
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        controller.abort();
        controller = new AbortController();
        signal = controller.signal;
        popup.classList.add("hidden");
      }
    });
    
    popupUploadButton.addEventListener("click", function(event) {
      event.preventDefault();

      popupUploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...'

      const formData = new FormData();

      if (host === "gofile") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
          `${urlForBypassCors}/https://store5.gofile.io/uploadFile`,
          "POST",
          formData,
          "json",
          data => {
            const url_gofile = data.data.downloadPage
            if (url_gofile) {
              activate_button_and_show_final_url(url_gofile)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_gofile);
              });
            } 
          },
          error => {activate_button_when_error(error)})


      } else if (host === "litterbox") {
        desactivate_button_when_upload()

        formData.append('reqtype', 'fileupload');
        formData.append('time', '24h');

        formData.append("fileToUpload", popupFileInput.files[0]);

        uploadToHost(
            "https://litterbox.catbox.moe/resources/internals/api.php",
            "POST",
            formData,
            "text",
            data => {
              if (data) {
                const url_litterbox = data
                activate_button_and_show_final_url(url_litterbox)
                copyButton.addEventListener("click", function() {
                  copy_to_clipboard(url_litterbox);
                });
            } 
          },
            error => {activate_button_when_error(error)})


      } else if (host === "fileio") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            "https://file.io/",
            "POST",
            formData,
            "json",
            data => {const url_fileio = data.link
            if (url_fileio) {
              activate_button_and_show_final_url(url_fileio)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_fileio);
              });
            }
          },
            error => {activate_button_when_error(error)})


      } else if (host === "tmpfilesorg") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            "https://tmpfiles.org/api/v1/upload",
            "POST",
            formData,
            "json",
            data => {const url_tmpfilesorg = data.data.url
            if (url_tmpfilesorg) {
              activate_button_and_show_final_url(url_tmpfilesorg)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_tmpfilesorg);
              });
            }
          },
            error => {if (error.message.includes("can't access property \"url\", data.data is undefined")) {
              activate_button_when_error("This file type is not supported by this host.")
            } else {
              activate_button_when_error(error)
            }
          })
      } 

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

      else if (host === "CV") {
        desactivate_button_when_upload()

        formData.append("a", popupFileInput.files[0]);

        uploadToHost(
          `${urlForBypassCors}/https://c-v.sh/`,
          "POST",
          formData,
          "text",
          data => {const url_CV = data
          if (url_CV) {
            activate_button_and_show_final_url(url_CV)
            copyButton.addEventListener("click", function() {
              copy_to_clipboard(url_CV);
            });
          }
        },
          error => {activate_button_when_error(error)})
      }

      else if (host === "KITc") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
          `${urlForBypassCors}/https://ki.tc/file/u/`,
          "POST",
          formData,
          "json",
          data => {const url_KI = data.file.download_page
          if (url_KI) {
            activate_button_and_show_final_url(url_KI)
            copyButton.addEventListener("click", function() {
              copy_to_clipboard(url_KI);
            });
          }
        },
          error => {activate_button_when_error(error)})
      }

      else if (host === "Oshi") {
        desactivate_button_when_upload()

        formData.append("f", popupFileInput.files[0]);
        formData.append("expire", "120");

        uploadToHost(
          `${urlForBypassCors}/https://oshi.at/`,
          "POST",
          formData,
          "text",
          data => {const url_Oshi = data.substr(data.indexOf("DL:") + 4, data.legth)
          if (url_Oshi) {
            activate_button_and_show_final_url(url_Oshi)
            copyButton.addEventListener("click", function() {
              copy_to_clipboard(url_Oshi);
            });
          }
        },
          error => {activate_button_when_error(error)})
      }

      else if (host === "Filebin") {
        desactivate_button_when_upload()

        const bin = (Math.random() + 1).toString(36).substring(2, 12);
        const filename = (Math.random() + 1).toString(36).substring(2, 12);

        const url_Filebin = `https://filebin.net/${bin}/${filename}`

        uploadToHost(
            `${urlForBypassCors}/${url_Filebin}`,
            "POST",
            popupFileInput.files[0],
            "json",
            data => {if (url_Filebin) {
              activate_button_and_show_final_url(url_Filebin)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_Filebin);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "TransferSh") {
        desactivate_button_when_upload()

        uploadToHost(
            `${urlForBypassCors}/https://transfer.sh/${popupFileInput.files[0].name}`,
            "PUT",
            popupFileInput.files[0],
            "text",
            data => {const url_transfer_sh = data
              if (url_transfer_sh) {
              activate_button_and_show_final_url(url_transfer_sh)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_transfer_sh);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "FroCDN") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            `${urlForBypassCors}/https://frocdn.com/curl.php`,
            "POST",
            formData,
            "text",
            data => {const url_frocdn = data
              if (url_frocdn) {
              activate_button_and_show_final_url(url_frocdn)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_frocdn);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "Bashupload") {
        desactivate_button_when_upload()

        formData.append("file_1", popupFileInput.files[0]);

        uploadToHost(
            `${urlForBypassCors}/https://bashupload.com/`,
            "POST",
            formData,
            "text",
            data => {const url_bashupload = data.match(/https:\/\/bashupload\.com\/[^\s]+/)
              if (url_bashupload) {
              activate_button_and_show_final_url(url_bashupload)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_bashupload);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "CurlBy") {
        desactivate_button_when_upload()

        formData.append("file_3", popupFileInput.files[0]);

        uploadToHost(
            `${urlForBypassCors}/https://curl.by/`,
            "POST",
            formData,
            "text",
            data => {const url_curlby = data.match(/http:\/\/curl\.by\/[^\s]+/)
              if (url_curlby) {
              activate_button_and_show_final_url(url_curlby)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_curlby);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "x0At") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            `${urlForBypassCors}/https://x0.at/`,
            "POST",
            formData,
            "text",
            data => {const url_0xat = data
              if (url_0xat) {
              activate_button_and_show_final_url(url_0xat)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_0xat);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "TempFilesOrg") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);
        formData.append("upload_auto_delete", "8");

        uploadToHost(
            `${urlForBypassCors}/https://temp-file.org/upload`,
            "POST",
            formData,
            "json",
            data => {const url_tempfileorg = data.download_link
              if (url_tempfileorg) {
              activate_button_and_show_final_url(url_tempfileorg)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_tempfileorg);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "Uplooad") {
        desactivate_button_when_upload()

        formData.append("file_0", popupFileInput.files[0]);

        uploadToHost(
            `${urlForBypassCors}/https://serv1.uplooad.net/cgi-bin/upload.cgi?upload_type=file&utype=anon`,
            "POST",
            formData,
            "json",
            data => {const url_uplooadnet = "https://www.uplooad.net/"+data[0].file_code
              if (url_uplooadnet) {
              activate_button_and_show_final_url(url_uplooadnet)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_uplooadnet);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "TempSendCom") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            `${urlForBypassCors}/https://tempsend.com/send`,
            "POST",
            formData,
            "text",
            data => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(data, 'text/html');

              let url_tempsendcom = null;
              for (const link of doc.querySelectorAll('a')) {
                const href = link.getAttribute('href');
                if (href && href.includes('https://tempsend.com/')) {
                  url_tempsendcom = href;
                  break;
                }
              }
              if (url_tempsendcom) {
              activate_button_and_show_final_url(url_tempsendcom)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_tempsendcom);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "TommoTeam") {
        desactivate_button_when_upload()

        formData.append("files[]", popupFileInput.files[0]);

        uploadToHost(
            `${urlForBypassCors}/https://www.tommo.team/upload.php`,
            "POST",
            formData,
            "json",
            data => {const url_tommoteam = data.files[0].url
              if (url_tommoteam) {
              activate_button_and_show_final_url(url_tommoteam)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_tommoteam);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "AnonymFile") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            "https://anonymfile.com/api/v1/upload",
            "POST",
            formData,
            "json",
            data => {const url_anonymfile = data.data.file.url.full
              if (url_anonymfile) {
              activate_button_and_show_final_url(url_anonymfile)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_anonymfile);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "Anyfile") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            "https://anyfile.co/api/v1/upload",
            "POST",
            formData,
            "json",
            data => {const url_anyfile = data.data.file.url.full
              if (url_anyfile) {
              activate_button_and_show_final_url(url_anyfile)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_anyfile);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "GofileCc") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            "https://gofile.cc/api/v1/upload",
            "POST",
            formData,
            "json",
            data => {const url_gofilecc = data.data.file.url.full
              if (url_gofilecc) {
              activate_button_and_show_final_url(url_gofilecc)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_gofilecc);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "TempFilesNinja") {
        desactivate_button_when_upload()

        uploadToHost(
            `${urlForBypassCors}/https://tempfiles.ninja/api/upload?${popupFileInput.files[0].name}`,
            "POST",
            popupFileInput.files[0],
            "json",
            data => {const url_tempfilesninja = data.download_url
              if (url_tempfilesninja) {
              activate_button_and_show_final_url(url_tempfilesninja)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_tempfilesninja);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "Pixeldrain") {
        desactivate_button_when_upload()

        uploadToHost(
            `${urlForBypassCors}/https://pixeldrain.com/api/file/${popupFileInput.files[0].name}`,
            "PUT",
            popupFileInput.files[0],
            "json",
            data => {const url_pixeldrain = "https://pixeldrain.com/u/"+data.id
              if (url_pixeldrain) {
              activate_button_and_show_final_url(url_pixeldrain)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_pixeldrain);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "UploadHub") {
        desactivate_button_when_upload()

        formData.append("file_0", popupFileInput.files[0])

        uploadToHost(
            `${urlForBypassCors}/https://upload100.uploadhub.to:83/cgi-bin/upload.cgi?upload_type=file&utype=anon`,
            "POST",
            formData,
            "json",
            data => {const url_uploadhub = "https://uploadhub.to/"+data[0].file_code
              if (url_uploadhub) {
              activate_button_and_show_final_url(url_uploadhub)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_uploadhub);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "1Cloudfile") {
        desactivate_button_when_upload()

        formData.append("files[]", popupFileInput.files[0])

        uploadToHost(
            `${urlForBypassCors}/https://fs9.1cloudfile.com/ajax/file_upload_handler`,
            "POST",
            formData,
            "json",
            data => {const url_1cloudfile = data[0].url
              if (url_1cloudfile) {
              activate_button_and_show_final_url(url_1cloudfile)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_1cloudfile);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "Bowfile") {
        desactivate_button_when_upload()

        formData.append("files[]", popupFileInput.files[0])

        uploadToHost(
            `${urlForBypassCors}/https://fs8.bowfile.com/ajax/file_upload_handler`,
            "POST",
            formData,
            "json",
            data => {const url_bowfile = data[0].url
              if (url_bowfile) {
              activate_button_and_show_final_url(url_bowfile)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_bowfile);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "ZeroUpload") {
        desactivate_button_when_upload()

        formData.append("files[]", popupFileInput.files[0])

        uploadToHost(
            `${urlForBypassCors}/https://ww2.zeroupload.xyz/ajax/file_upload_handler`,
            "POST",
            formData,
            "json",
            data => {const url_zeroupload = data[0].url
              if (url_zeroupload) {
              activate_button_and_show_final_url(url_zeroupload)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_zeroupload);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "Uploadify") {
        desactivate_button_when_upload()

        formData.append("files[]", popupFileInput.files[0])

        uploadToHost(
            `${urlForBypassCors}/https://uploadify.net/core/page/ajax/file_upload_handler.ajax.php`,
            "POST",
            formData,
            "json",
            data => {const url_uploadify = data[0].url
              if (url_uploadify) {
              activate_button_and_show_final_url(url_uploadify)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_uploadify);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "AnonFilesMe") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            "https://anonfiles.me/api/v1/upload",
            "POST",
            formData,
            "json",
            data => {const url_anonfilesme = data.data.file.url.full
              if (url_anonfilesme) {
              activate_button_and_show_final_url(url_anonfilesme)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_anonfilesme);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "AnonTransfer") {
        desactivate_button_when_upload()

        formData.append("file", popupFileInput.files[0]);

        uploadToHost(
            `${urlForBypassCors}/https://www.anontransfer.com/upload.php`,
            "POST",
            formData,
            "json",
            data => {const url_anontransfer = data.uri
              if (url_anontransfer) {
              activate_button_and_show_final_url(url_anontransfer)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_anontransfer);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }

      else if (host === "AnonSharing") {
        desactivate_button_when_upload()

        formData.append("files[]", popupFileInput.files[0])

        uploadToHost(
            `${urlForBypassCors}/https://anonsharing.com/ajax/file_upload_handler`,
            "POST",
            formData,
            "json",
            data => {const url_anonsharings = data[0].url
              if (url_anonsharings) {
              activate_button_and_show_final_url(url_anonsharings)
              copyButton.addEventListener("click", function() {
                copy_to_clipboard(url_anonsharings);
              });
            }
          },
            error => {activate_button_when_error(error)})
      }


    });

    // I'll be honest, the part of the script that sorts the hosts according to their maximum file size and the time before the file is deleted was generated with ChatGPT, but I tried to understand and decompose it as much as possible to get a better view.
    const sortTable = (sortIndex, getValue) => {
      const sortOrder = sortStates[sortIndex] === 'asc' ? -1 : 1;
  
      rows.sort((rowA, rowB) => {
        const valueA = getValue(rowA.cells[sortIndex]);
        const valueB = getValue(rowB.cells[sortIndex]);
        return sortOrder * (valueB - valueA);
      });
  
      tbody.innerHTML = '';
      rows.forEach((row, index) => {
        const originalClass = index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700';
        row.classList.remove('bg-slate-800', 'bg-slate-700');
        row.classList.add(originalClass, 'alternate-row');
        tbody.appendChild(row);
      });
  
      sortStates[sortIndex] = sortStates[sortIndex] === 'asc' ? 'desc' : 'asc';
    };
  
    const getMaxFileSizeValue = cell => {
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
  
      const getExpireInValue = cell => {
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
  
      document.getElementById('maxFileSizeHeader').addEventListener('click', () => {
        sortTable(1, getMaxFileSizeValue);
      });
  
      document.getElementById('expireInHeader').addEventListener('click', () => {
        sortTable(2, getExpireInValue);
      });

  });
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
            'X-Requested-With': '*'
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

    
    uploadButtonGoFile.addEventListener("click", function () {
      reset_popup()
      host = "gofile"
      urlFinalUpload.textContent = "Gofile has no known bugs or problems."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://gofile.io/terms"
    });

    uploadButtonLitterbox.addEventListener("click", function () {
      reset_popup()
      host = "litterbox"
      urlFinalUpload.textContent = "Litterbox is regularly down."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://litterbox.catbox.moe/faq.php"
    });

    uploadButtonFileIo.addEventListener("click", function () {
      reset_popup()
      host = "fileio"
      urlFinalUpload.textContent = "File.io has no known bugs or problems."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://www.file.io/tos/"
    });

    uploadFormTmpfilesOrg.addEventListener("click", function () {
      reset_popup()
      host = "tmpfilesorg"
      urlFinalUpload.textContent = "TmpFiles.org does not accept all file formats."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://tmpfiles.org/about"
    });

    uploadButton0x0.addEventListener("click", function () {
      reset_popup()
      host = "0x0"
      urlFinalUpload.textContent = "0x0.st has no known bugs or problems."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://0x0.st/"
    });

    uploadButtonCVSh.addEventListener("click", function () {
      reset_popup()
      host = "CV"
      urlFinalUpload.textContent = "C-V.sh has no known bugs or problems."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://c-v.sh/"
    });

    uploadButtonKITc.addEventListener("click", function () {
      reset_popup()
      host = "KITc"
      urlFinalUpload.textContent = "Ki.tc has no known bugs or problems."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://logic-gate-demo.readthedocs.io/en/latest/readme.html"
    });

    uploadButtonOshi.addEventListener("click", function () {
      reset_popup()
      host = "Oshi"
      urlFinalUpload.textContent = "Ohsi.at is inaccessible from certain IPs with the error \"Connection reset\"."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://oshi.at/abuse"
    });

    uploadButtonFilebin.addEventListener("click", function () {
      reset_popup()
      host = "Filebin"
      urlFinalUpload.textContent = "Filebin often runs out of storage."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://filebin.net/terms"
    });

    uploadButtonTransferSh.addEventListener("click", function () {
      reset_popup()
      host = "TransferSh"
      urlFinalUpload.textContent = "Transfer.sh has no known bugs or problems."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://transfer.sh/"
    });

    uploadButtonFroCDN.addEventListener("click", function () {
      reset_popup()
      host = "FroCDN"
      urlFinalUpload.textContent = "FroCDN.com has no known bugs or problems."
      urlFinalUpload.href = "#"
      conditionOfUse.href = "https://frocdn.com/tos.html"
    });

    
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
          "https://store6.gofile.io/uploadFile",
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
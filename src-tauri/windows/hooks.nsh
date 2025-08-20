!macro NSIS_HOOK_POSTINSTALL
  DetailPrint "Configuring the Windows firewall"
 
  UserInfo::GetAccountType
  Pop $R0
  ${If} $R0 != "Admin"
    DetailPrint "Requesting administrator privileges..."
    FileOpen $R1 "$TEMP\polyuploader_firewall.bat" w
    FileWrite $R1 "@echo off$\r$\n"
    FileWrite $R1 "echo Configuring firewall rules for PolyUploader...$\r$\n"
    FileWrite $R1 "netsh advfirewall firewall show rule name=$\"PolyUploader$\" >nul 2>&1$\r$\n"
    FileWrite $R1 "if errorlevel 1 ($\r$\n"
    FileWrite $R1 "    netsh advfirewall firewall add rule name=$\"PolyUploader$\" dir=in action=allow program=$\"$INSTDIR\PolyUploader.exe$\" enable=yes profile=any$\r$\n"
    FileWrite $R1 "    echo Firewall rule IN added$\r$\n"
    FileWrite $R1 ") else ($\r$\n"
    FileWrite $R1 "    echo Firewall rule IN already exists$\r$\n"
    FileWrite $R1 ")$\r$\n"
    FileWrite $R1 "netsh advfirewall firewall show rule name=$\"PolyUploader OUT$\" >nul 2>&1$\r$\n"
    FileWrite $R1 "if errorlevel 1 ($\r$\n"
    FileWrite $R1 "    netsh advfirewall firewall add rule name=$\"PolyUploader OUT$\" dir=out action=allow program=$\"$INSTDIR\PolyUploader.exe$\" enable=yes profile=any$\r$\n"
    FileWrite $R1 "    echo Firewall rule OUT added$\r$\n"
    FileWrite $R1 ") else ($\r$\n"
    FileWrite $R1 "    echo Firewall rule OUT already exists$\r$\n"
    FileWrite $R1 ")$\r$\n"
    FileClose $R1
    
    ExecShell "runas" "$TEMP\polyuploader_firewall.bat" "" SW_HIDE
    
    Sleep 1500
    Delete "$TEMP\polyuploader_firewall.bat"
  ${Else}
    nsExec::ExecToStack 'netsh advfirewall firewall show rule name="PolyUploader"' $0
    Pop $1
    Pop $0
    ${If} $0 != 0
      nsExec::Exec 'netsh advfirewall firewall add rule name="PolyUploader" dir=in action=allow program="$INSTDIR\PolyUploader.exe" enable=yes profile=any' $0
      Pop $0
      ${If} $0 == 0
        DetailPrint "Firewall rule (IN) added"
      ${Else}
        DetailPrint "Firewall error rule (IN): code $0"
      ${EndIf}
    ${Else}
      DetailPrint "Firewall rule (IN) already exists"
    ${EndIf}
  
    nsExec::ExecToStack 'netsh advfirewall firewall show rule name="PolyUploader OUT"' $0
    Pop $1
    Pop $0
    ${If} $0 != 0
      nsExec::Exec 'netsh advfirewall firewall add rule name="PolyUploader OUT" dir=out action=allow program="$INSTDIR\PolyUploader.exe" enable=yes profile=any' $0
      Pop $0
      ${If} $0 == 0
        DetailPrint "Firewall rule (OUT) added"
      ${Else}
        DetailPrint "Firewall error rule (OUT): code $0"
      ${EndIf}
    ${Else}
      DetailPrint "Firewall rule (OUT) already exists"
    ${EndIf}
  ${EndIf}

  DetailPrint "Firewall configuration complete"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  DetailPrint "Deleting firewall rules"
  
  UserInfo::GetAccountType
  Pop $R0
  ${If} $R0 != "Admin"
    FileOpen $R1 "$TEMP\polyuploader_firewall_remove.bat" w
    FileWrite $R1 "@echo off$\r$\n"
    FileWrite $R1 "netsh advfirewall firewall delete rule name=$\"PolyUploader$\"$\r$\n"
    FileWrite $R1 "netsh advfirewall firewall delete rule name=$\"PolyUploader OUT$\"$\r$\n"
    FileWrite $R1 "exit$\r$\n"
    FileClose $R1

    ExecShell "runas" "$TEMP\polyuploader_firewall_remove.bat" "" SW_HIDE
    
    Sleep 1500
    Delete "$TEMP\polyuploader_firewall_remove.bat"
  ${Else}
    nsExec::Exec 'netsh advfirewall firewall delete rule name="PolyUploader"' $0
    Pop $0
    nsExec::Exec 'netsh advfirewall firewall delete rule name="PolyUploader OUT"' $0
    Pop $0
  ${EndIf}
  
  DetailPrint "Deleting PolyUploader context menu registry key"
  DeleteRegKey HKCU "Software\\Classes\\*\\shell\\PolyUploader"
 
  DetailPrint "Firewall rules and context menu key deleted"
!macroend
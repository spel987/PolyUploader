!macro NSIS_HOOK_POSTINSTALL
  DetailPrint "Configuring the Windows firewall"
  
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
  
  DetailPrint "Firewall configuration complete"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  DetailPrint "Deleting firewall rules"

  nsExec::Exec 'netsh advfirewall firewall delete rule name="PolyUploader"' $0
  Pop $0
  nsExec::Exec 'netsh advfirewall firewall delete rule name="PolyUploader OUT"' $0
  Pop $0

  DetailPrint "Deleting PolyUploader context menu registry key"
  DeleteRegKey HKCU "Software\\Classes\\*\\shell\\PolyUploader"
  
  DetailPrint "Firewall rules and context menu key deleted"
!macroend
; installer.nsh — include via electron-builder’s nsis.include

;======================================================================
; customInstall macro is invoked by electron-builder after files are in $INSTDIR
!macro customInstall
  ; Check if .md is already associated with JsMarkNote (upgrade skips prompt)
  ReadRegStr $0 HKCU "Software\Classes\.md" ""
  StrCmp $0 "JsMarkNote.Document" UpdateAssoc

  ; Ask the user if they want to register file associations
  MessageBox MB_YESNO|MB_ICONQUESTION \
  "Do you want to associate Markdown files (.md, .markdown, .mmd, .mdown, .mdtext, .mdx) with JsMarkNote?" /SD IDNO IDNO SkipAssoc

UpdateAssoc:
  WriteRegStr HKCU "Software\Classes\.md"       "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.markdown" "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mmd"      "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mdown"    "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mdtxt"    "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mdtext"   "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mdx"      "" "JsMarkNote.Document"

  WriteRegStr HKCU "Software\Classes\JsMarkNote.Document" "" "JsMarkNote Markdown Document"
  WriteRegExpandStr HKCU "Software\Classes\JsMarkNote.Document\DefaultIcon" "" "$INSTDIR\resources\icons\md.ico,0"
  WriteRegExpandStr HKCU "Software\Classes\JsMarkNote.Document\shell\open\command" "" "$\"$INSTDIR\jsmarknote.exe$\" $\"%1$\""

SkipAssoc:
!macroend

;======================================================================
; customUnInstall macro cleans up on uninstall
!macro customUnInstall
  ; If .md is still associated with JsMarkNote, this is an upgrade (new installer
  ; is already running) — skip cleanup so the new installer doesn’t need to re-ask.
  ; If .md points to something else or is empty, the user switched editors or is
  ; doing a genuine uninstall — clean up our ProgID.
  ReadRegStr $0 HKCU "Software\Classes\.md" ""
  StrCmp $0 "JsMarkNote.Document" SkipUnassoc

  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document\shell\open\command"
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document\shell\open"
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document\shell"
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document\DefaultIcon"
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document"

SkipUnassoc:
  MessageBox MB_YESNO "Do you want to delete user settings?" /SD IDNO IDNO SkipRemoval
    SetShellVarContext current
    RMDir /r "$APPDATA\jsmarknote"
  SkipRemoval:
!macroend
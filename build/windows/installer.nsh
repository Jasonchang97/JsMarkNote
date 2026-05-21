; installer.nsh — include via electron-builder’s nsis.include

;======================================================================
; customInstall macro is invoked by electron-builder after files are in $INSTDIR
!macro customInstall
  ; Check if .md is already associated with JsMarkNote
  ReadRegStr $0 HKCU "Software\Classes\.md" ""
  StrCmp $0 "JsMarkNote.Document" SkipAssoc

  ; Ask the user if they want to register file associations
  MessageBox MB_YESNO|MB_ICONQUESTION \
  "Do you want to associate Markdown files (.md, .markdown, .mmd, .mdown, .mdtext, .mdx) with JsMarkNote?" /SD IDNO IDNO SkipAssoc

  ;— User clicked YES, perform the registry writes —
  WriteRegStr HKCU "Software\Classes\.md"       "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.markdown" "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mmd"      "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mdown"    "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mdtxt"    "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mdtext"   "" "JsMarkNote.Document"
  WriteRegStr HKCU "Software\Classes\.mdx"      "" "JsMarkNote.Document"

  WriteRegStr HKCU "Software\Classes\JsMarkNote.Document" \
    "" "JsMarkNote Markdown Document"
  WriteRegExpandStr HKCU "Software\Classes\JsMarkNote.Document\DefaultIcon" \
    "" "$INSTDIR\resources\icons\icon.ico,0"
  WriteRegExpandStr HKCU "Software\Classes\JsMarkNote.Document\shell\open\command" \
    "" ‘"$INSTDIR\jsmarknote.exe" "%1"’

SkipAssoc:
!macroend

;======================================================================
; customUnInstall macro cleans up on uninstall
!macro customUnInstall
  ; Delete the open command subtree
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document\shell\open\command"
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document\shell\open"
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document\shell"

  ; Delete the DefaultIcon and ProgID
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document\DefaultIcon"
  DeleteRegKey HKCU "Software\Classes\JsMarkNote.Document"

  ; Delete each extension mapping
  DeleteRegKey HKCU "Software\Classes\.md"
  DeleteRegKey HKCU "Software\Classes\.markdown"
  DeleteRegKey HKCU "Software\Classes\.mmd"
  DeleteRegKey HKCU "Software\Classes\.mdown"
  DeleteRegKey HKCU "Software\Classes\.mdtxt"
  DeleteRegKey HKCU "Software\Classes\.mdtext"
  DeleteRegKey HKCU "Software\Classes\.mdx"

  MessageBox MB_YESNO "Do you want to delete user settings?" /SD IDNO IDNO SkipRemoval
    SetShellVarContext current
    RMDir /r "$APPDATA\jsmarknote"
  SkipRemoval:
!macroend
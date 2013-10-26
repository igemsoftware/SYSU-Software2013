Set WshShell = WScript.CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop") 'special folder desktop
rem 在桌面创建一个记事本快捷方式
set oShellLink = WshShell.CreateShortcut(strDesktop & "\CAST_designer.exe.lnk")
oShellLink.TargetPath = createobject("Scripting.FileSystemObject").GetFolder(".").Path +"\CAST_Designer_64bit.exe"  'target
oShellLink.Arguments = "" '
oShellLink.WindowStyle = 7 '1 activative，3 max window，7 min window
oShellLink.Hotkey = ""  '
oShellLink.IconLocation = createobject("Scripting.FileSystemObject").GetFolder(".").Path +"\CAST_Designer_32bit.exe, 0"  'icon
oShellLink.Description = ""  '
oShellLink.WorkingDirectory = createobject("Scripting.FileSystemObject").GetFolder(".").Path  'start location
oShellLink.Save  'save link
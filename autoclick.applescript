repeat
  tell application "System Events" to tell process "Xcode"
    click menu item "pokemonLocation" of menu 1 of menu item "Simulate Location" of menu 1 of menu bar item "Debug" of menu bar 1
  end tell
  delay 0.67
end repeat

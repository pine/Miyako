## Miyako with launchd

launchd is service-management framework in macOS.

First, please create configuration for daemon with the name "~/Library/LaunchAgents/miyako.plist".
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>KeepAlive</key>
  <true/>
  <key>Label</key>
  <string>miyako</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/Users/username/project/Miyako/bin/run</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>WorkingDirectory</key>
  <string>/Users/username/project/Miyako</string>
  <key>StandardOutPath</key>
  <string>/Users/username/Library/Logs/miyako.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/username/Library/Logs/miyako.log</string>
</dict>
</plist>
```

Next, please load daemon configuration.
```
launchctl unload ~/Library/LaunchAgents/miyako.plist
launchctl load ~/Library/LaunchAgents/miyako.plist
```

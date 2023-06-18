(cd /home/tomos/Projects/VESCDash/vesc-dash/build ;sudo -H -u tomos /bin/python -m http.server 5051) &
DISPLAY=:0 xdotool mousemove 2000 2000
DISPLAY=:0 ./Electron.js
# DISPLAY=:0 firefox --kiosk http://localhost:5051
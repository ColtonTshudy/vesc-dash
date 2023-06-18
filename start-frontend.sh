(cd /home/tomos/Projects/VESCDash/vesc-dash/build ;sudo -H -u tomos /bin/python -m http.server 5051) &
DISPLAY=:0 firefox --kiosk http://localhost:5051
DISPLAY=:0 unclutter -idle 0.1
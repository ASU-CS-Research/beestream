if [ $(pgrep -c "npm") -eq 0 ]
then
    cd /var/www/https/appmais.cs.appstate.edu/beestream_files/beestream
    npm start >/var/log/beestream.log
fi

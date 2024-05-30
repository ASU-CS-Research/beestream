if [ $(pgrep -c "npm") -eq 0 ]
then
    cd /var/www/https/beemon.cs.appstate.edu/beestream/
    npm start
fi

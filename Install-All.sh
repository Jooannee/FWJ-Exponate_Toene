#!/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

cd "$(dirname "$0")"

echo $(date +%d%t%b%t%Y%t%T%t%:z) > Install.log

npm install --global yarn >> Install.log
npm install --global @yao-pkg/pkg >> Install.log
npm install --global electron >> Install.log
npm install --global ws >> Install.log
npm install --global concurrently >> Install.log


cd Hörbeeinträchtigungen
yarn >> Install.log

cd ../Hörtest
yarn >> Install.log

cd ../Instrumenten-Ratespiel
yarn >> Install.log

cd ../Liedermacher
yarn >> Install.log

cd ../McGurk-Effekt
yarn >> Install.log

cd ../Töne-Hannovers
yarn >> Install.log

cd ../statistics-server
yarn >> Install.log

cd ../Dash
npm link ws >> Install.log

sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

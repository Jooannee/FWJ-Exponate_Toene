#!/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

cd "$(dirname "$0")"

echo $(date +%d%t%b%t%Y%t%T%t%:z) > Install.log

npm install --global yarn >> Install.log 2>&1
npm install --global @yao-pkg/pkg >> Install.log 2>&1
npm install --global electron >> Install.log 2>&1
npm install --global ws >> Install.log 2>&1
npm install --global concurrently >> Install.log 2>&1


cd Hörbeeinträchtigungen
yarn >> Install.log 2>&1

cd ../Hörtest
yarn >> Install.log 2>&1

cd ../Instrumenten-Ratespiel
yarn >> Install.log 2>&1

cd ../Liedermacher
yarn >> Install.log 2>&1

cd ../McGurk-Effekt
yarn >> Install.log 2>&1

cd ../Töne-Hannovers
yarn >> Install.log 2>&1

cd ../statistics-server
yarn >> Install.log 2>&1

cd ../Dash
npm link ws >> Install.log 2>&1

sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

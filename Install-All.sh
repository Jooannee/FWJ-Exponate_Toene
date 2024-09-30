#!/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

cd "$(dirname "$0")"

npm install --global yarn
npm install --global @yao-pkg/pkg
npm install --global electron
npm install --global ws
npm install --global concurrently


cd Hörbeeinträchtigungen
yarn

cd ../Hörtest
yarn

cd ../Instrumenten-Ratespiel
yarn

cd ../Liedermacher
yarn

cd ../McGurk-Effekt
yarn

cd ../Töne-Hannovers
yarn

cd ../statistics-server
yarn

cd ../Dash
npm link ws
sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

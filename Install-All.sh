#!/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

cd "$(dirname "$0")"

echo $(date +%d%t%b%t%Y%t%T%t%:z) > Install.log

echo "Installing global dependencies"
npm install --global yarn >> Install.log 2>&1
npm install --global @yao-pkg/pkg >> Install.log 2>&1
npm install --global electron >> Install.log 2>&1
npm install --global ws >> Install.log 2>&1
npm install --global concurrently >> Install.log 2>&1

echo "Installing \"Hörbeeinträchtigungen\""
cd Hörbeeinträchtigungen
yarn >> Install.log 2>&1

echo "Installing \"Hörtest\""
cd ../Hörtest
yarn >> Install.log 2>&1

echo "Installing \"Instrumenten Ratespiel\""
cd ../Instrumenten-Ratespiel
yarn >> Install.log 2>&1

echo "Installing \"Liedermacher\""
cd ../Liedermacher
yarn >> Install.log 2>&1

echo "Installing \"McGurk Effekt\""
cd ../McGurk-Effekt
yarn >> Install.log 2>&1

echo "Installing \"Töne Hannovers\""
cd ../Töne-Hannovers
yarn >> Install.log 2>&1

echo "Installing Statistics Server"
cd ../statistics-server
yarn >> Install.log 2>&1

echo "Installing Dashboard"
cd ../Dash
npm link ws >> Install.log 2>&1

echo "Please enter your password to complete the installation (Changing file permissions)"
sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

read "Installation complete, press enter to exit."
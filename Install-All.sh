#!/usr/bin/env bash

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

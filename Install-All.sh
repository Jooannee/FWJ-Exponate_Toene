#!/bin/bash

npm install --global yarn
npm install --global @yao-pkg/pkg
npm install --global electron
npm install --global ws



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
#!/bin/bash

npm install --global yarn
npm install --global @yao-pkg/pkg

rm build.tar.gz
rm McGurk-Effekt.tar.gz
rm Hörbeeinträchtigungen.tar.gz
rm Instrumenten-Ratespiel.tar.gz
rm Töne-Hannovers.tar.gz
rm Liedermacher.tar.gz
# rm react-wavetester.tar.gz
rm Hörtest.tar.gz


cd McGurk-Effekt
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-mcgurk-effekt.sh McGurk-Effekt/dist/win-unpacked
tar -czvf McGurk-Effekt.tar.gz McGurk-Effekt/dist/win-unpacked
rm -rf McGurk-Effekt/dist
cd Hörbeeinträchtigungen
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-hörbeeinträchtigungen.sh Hörbeeinträchtigungen/dist/win-unpacked
tar -czvf Hörbeeinträchtigungen.tar.gz Hörbeeinträchtigungen/dist/win-unpacked
rm -rf Hörbeeinträchtigungen/dist
cd Instrumenten-Ratespiel
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-instrumenten-ratespiel.sh Instrumenten-Ratespiel/dist/win-unpacked
tar -czvf Instrumenten-Ratespiel.tar.gz Instrumenten-Ratespiel/dist/win-unpacked
rm -rf Instrumenten-Ratespiel/dist
cd Töne-Hannovers
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-töne-hannovers.sh Töne-Hannovers/dist/win-unpacked
tar -czvf Töne-Hannovers.tar.gz Töne-Hannovers/dist/win-unpacked
rm -rf Töne-Hannovers/dist
cd Liedermacher
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-liedermacher.sh Liedermacher/dist/win-unpacked
tar -czvf Liedermacher.tar.gz Liedermacher/dist/win-unpacked
rm -rf Liedermacher/dist
# cd react-wavetester
# yarn
# yarn build
# yarn electron-builder
# cd ..
cd Hörtest
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-hörtest.sh Hörtest/dist/win-unpacked
tar -czvf Hörtest.tar.gz Hörtest/dist/win-unpacked
rm -rf Hörtest/dist
cd statistics-server
yarn
yarn build
cd dist
pkg index.js -t node20-win-x64
mv index server
chmod +x server
cd ..
cd ..



mv statistics-server/dist/server server.exe

# zip the three zip files and the server executable all together
tar -czvf win-build.tar.gz McGurk-Effekt.tar.gz Hörbeeinträchtigungen.tar.gz Instrumenten-Ratespiel.tar.gz Töne-Hannovers.tar.gz Liedermacher.tar.gz Hörtest.tar.gz server.exe
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

rm -rf McGurk-Effekt/dist
rm -rf Hörbeeinträchtigungen/dist
rm -rf Instrumenten-Ratespiel/dist
rm -rf Töne-Hannovers/dist
rm -rf Liedermacher/dist
# rm -rf react-wavetester/dist
rm -rf Hörtest/dist

chmod +x scripts/run-mcgurk-effekt.sh
chmod +x scripts/run-hörbeeinträchtigungen.sh
chmod +x scripts/run-instrumenten-ratespiel.sh
chmod +x scripts/run-töne-hannovers.sh
chmod +x scripts/run-liedermacher.sh
# chmod +x scripts/run-wavetester.sh
chmod +x scripts/run-hörtest.sh

cd McGurk-Effekt
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-mcgurk-effekt.sh McGurk-Effekt/dist/linux-unpacked
tar -czvf McGurk-Effekt.tar.gz McGurk-Effekt/dist/linux-unpacked
rm -rf McGurk-Effekt/dist
cd Hörbeeinträchtigungen
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-hörbeeinträchtigungen.sh Hörbeeinträchtigungen/dist/linux-unpacked
tar -czvf Hörbeeinträchtigungen.tar.gz Hörbeeinträchtigungen/dist/linux-unpacked
rm -rf Hörbeeinträchtigungen/dist
cd Instrumenten-Ratespiel
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-instrumenten-ratespiel.sh Instrumenten-Ratespiel/dist/linux-unpacked
tar -czvf Instrumenten-Ratespiel.tar.gz Instrumenten-Ratespiel/dist/linux-unpacked
rm -rf Instrumenten-Ratespiel/dist
cd Töne-Hannovers
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-töne-hannovers.sh Töne-Hannovers/dist/linux-unpacked
tar -czvf Töne-Hannovers.tar.gz Töne-Hannovers/dist/linux-unpacked
rm -rf Töne-Hannovers/dist
cd Liedermacher
yarn
yarn build
yarn electron-builder
cd ..
cp scripts/run-liedermacher.sh Liedermacher/dist/linux-unpacked
tar -czvf Liedermacher.tar.gz Liedermacher/dist/linux-unpacked
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
cp scripts/run-hörtest.sh Hörtest/dist/linux-unpacked
tar -czvf Hörtest.tar.gz Hörtest/dist/linux-unpacked
rm -rf Hörtest/dist
cd statistics-server
yarn
yarn build
cd dist
pkg index.js -t node20-linux-x64
mv index server
chmod +x server
cd ..
cd ..



# tar -czvf react-wavetester.tar.gz react-wavetester/dist/linux-unpacked
# rm -rf react-wavetester/dist



mv statistics-server/dist/server server

# zip the three zip files and the server executable all together
tar -czvf build.tar.gz McGurk-Effekt.tar.gz Hörbeeinträchtigungen.tar.gz Instrumenten-Ratespiel.tar.gz Töne-Hannovers.tar.gz Liedermacher.tar.gz Hörtest.tar.gz server

rm McGurk-Effekt.tar.gz
rm Hörbeeinträchtigungen.tar.gz
rm Instrumenten-Ratespiel.tar.gz
rm Töne-Hannovers.tar.gz
rm Liedermacher.tar.gz
# rm react-wavetester.tar.gz
rm Hörtest.tar.gz
rm server
#!/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

cleanup () {
    pkill -f node
}


cd "$(dirname "$0")"

concurrently \
"cd Hörbeeinträchtigungen && npm run dev" \
"cd Hörtest && npm run dev" \
"cd Instrumenten-Ratespiel && npm run dev" \
"cd Liedermacher && npm run dev" \
"cd McGurk-Effekt && npm run dev" \
"cd Töne-Hannovers && npm run dev" \
"cd statistics-server && npm run dev" \
"cd Dash && npm start"

trap cleanup EXIT
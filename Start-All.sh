#!/bin/bash

concurrently \
"cd Hörbeeinträchtigungen && npm run dev" \
"cd Hörtest && npm run dev" \
"cd Instrumenten-Ratespiel && npm run dev" \
"cd Liedermacher && npm run dev" \
"cd McGurk-Effekt && npm run dev" \
"cd Töne-Hannovers && npm run dev"
#!/bin/bash

# Clean previous distribution build.
rm -rf lib/browser/*


echo "Browserifying..."

mkdir -p lib/browser

./node_modules/.bin/browserify lib/gsm.js --standalone gsm --no-browser-field --outfile lib/browser/gsm.js

echo "Minifying..."

./node_modules/.bin/browserify lib/gsm.js --standalone gsm --plugin \[minifyify --no-map\] --outfile lib/browser/gsm.min.js

echo "Build completed!"
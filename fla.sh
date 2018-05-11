#!/bin/bash
yarn run fla;
mv ./fonts ./dist/static/.;
rm ./dist/static/js/*.map;
rm ./dist/static/*.png;
rm ./dist/static/*.jpg;
rm ./dist/static/*.JPG;
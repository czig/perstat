#!/bin/bash
yarn run build;
mv ./fonts ./dist/static/.;
rm ./dist/static/js/*.map;
rm ./dist/static/*.png;
rm ./dist/static/*.jpg;
rm ./dist/static/*.JPG;

cd ../ps_prod;
git pull origin master;
cd ../perstat/dist;

rm -rf ../../ps_prod/static;
rm -rf ../../ps_prod/index.html;

cp -a ./static ../../ps_prod;
cp -a ./index.html ../../ps_prod/index.html;

cd ../../ps_prod;

git add . ;
git commit -m "`(date +%F%T)`";
git push origin master;
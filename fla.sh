#!/bin/bash
#begin with git pull!
git --git-dir=./dist/.git --work-tree=./dist pull origin master
#build for fla (need fla endpoints)
yarn run fla;
#move/remove files for serving over apache
mv ./fonts ./dist/static/.;
rm ./dist/static/js/*.map;
rm ./dist/static/*.png;
rm ./dist/static/*.jpg;
rm ./dist/static/*.JPG;
cd ./dist;
#push code up to github ps_fla
git add . ;
git commit -m "`(date +%F%T)`";
git push origin master;

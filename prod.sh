#!/bin/bash
#begin by resetting ps_prod working directory to last commit state
git -C ../ps_prod reset --hard;
#git pull to sync with remote
git -C ../ps_prod pull origin master;
#build for prod (need prod endpoints)
yarn run build;
#get most recent commit and current branch in perstat
lastCommitHash=$(git rev-parse --short HEAD)
lastCommit=$(git log -n 1 --oneline)
branchName=$(git rev-parse --abbrev-ref HEAD)
#push code up to github ps_prod
git -C ../ps_prod add . ;
git -C ../ps_prod commit -m "Push on: `(date "+%F %T")` from ${lastCommitHash} on branch ${branchName}" -m "Built version of: ${lastCommit}";
git -C ../ps_prod push origin master;

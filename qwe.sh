#!/bin/bash
git log --pretty=format:'%H' -1 > static/git.txt
git add . && git commit -m"git spy"
git push
yarn generate
yarn deploy
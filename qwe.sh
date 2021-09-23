#!/bin/bash
git log --pretty=format:'%H' -1 > static/git.txt
yarn generate
yarn deploy
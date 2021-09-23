#!/bin/bash
git log --pretty=format:'%H' -1 > static/git
yarn generate
yarn deploy
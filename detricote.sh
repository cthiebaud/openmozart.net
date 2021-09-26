#!/bin/bash
set -e
shopt -s nullglob
ignore() {
  	git reset HEAD $1
	git checkout -- $1
}
for fname in static/favicon/*; do
   ignore ${fname}
done

List=(
	README.md
   package.json
   static/git.txt 
   static/CNAME 
)
for fname2 in ${List[*]}; do
   ignore ${fname2}
done 
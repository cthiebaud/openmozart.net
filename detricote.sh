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
   configuration.json
   static/CNAME 
   static/favicon_package_v0.16.zip
   static/pure_html/index.html
   matches-5-cheat.jpg
)
for fname2 in ${List[*]}; do
   ignore ${fname2}
done 
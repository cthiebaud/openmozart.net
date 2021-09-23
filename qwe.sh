#!/bin/bash
git log --pretty=format:'%H' -1 > static/git.yml
yarn generate
yarn deploy

echo git checkout openricard
echo git merge --no-commit --no-ff master
echo "# ... review and commit ..."
echo git push openricard HEAD:master
echo git checkout master

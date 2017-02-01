#!/bin/bash
set -o -e errexit

git clone ./master ./production-deploy
cd production-deploy
VERSION=$(cat ../production-deploy/number)
echo "Nova versão $VERSION"

git config --global user.name "CI"
git config --global user.email "renan.padilha@zeta.com.br"

git commit -am "Nova versão $VERSION [ci skip]"

cd ..

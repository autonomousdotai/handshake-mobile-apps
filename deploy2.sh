#!/bin/bash

yarn install
yarn add https://github.com/ninjadotorg/handshake-i18n

cp ./deployment/conf/.production2.env.js ./.env.js
yarn build
bash ./deployment/deploy.sh production

rm -r dist

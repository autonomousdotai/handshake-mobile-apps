#!/bin/bash

yarn install
yarn add https://github.com/ninjadotorg/handshake-i18n

cp ./deployment/conf/.production-coinbowl.env.js ./.env.js
yarn build
bash ./deployment/deploy_coinbowl.sh production

rm -r dist

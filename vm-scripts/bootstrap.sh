#!/usr/bin/env bash

# install Git
apt-get update
sudo apt-get install -y git

# install Node.js
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential

# install MonogDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# install bower
sudo npm install -g bower

# install gulp
sudo npm install -g gulp-cli

# install node modules
(cd /vagrant && sudo npm install --no-optional --no-bin-links)

# install bower modules
(cd /vagrant && sudo bower install --allow-root)

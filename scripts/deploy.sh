#!/usr/bin/env bash

set -ev

if  [ -z "$GIT_USER" ]; then
    echo "GIT_USER has not existed."
    exit 1
fi

if  [ -z "$GIT_EMAIL" ]; then
    echo "GIT_EMAIL has not existed."
    exit 1
fi

git config --global user.name $GIT_USER
git config --global user.email $GIT_EMAIL
git config --global credential.helper store
echo "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com" > ~/.git-credentials

gem install bundler
bundle install

bundle exec middleman build
bundle exec middleman deploy

rm ~/.git-credentials

#!/usr/bin/env bash

set -eu

bundle exec middleman build

function printHeader() {
  echo -e "\n\n==== $1 ..."
}

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  wget https://github.com/arukasio/cli/releases/download/v0.1.2/arukas_v0.1.2_linux_amd64.zip
  unzip arukas_v0.1.2_linux_amd64.zip

  appName=wakate-org-$TRAVIS_PULL_REQUEST
  imageName="$DOCKER_USER/$DOCKER_IMAGE_NAME:$TRAVIS_PULL_REQUEST"

  printHeader "Display informations"
  echo "AppName:    $appName"
  echo "ImageName:  $imageName"

  printHeader "Login to docker.io"
  docker login \
    -u $DOCKER_USER \
    -p $DOCKER_PASSWORD

  printHeader "Build docker image"
  docker build \
    -t $imageName \
    .

  printHeader "Push docker image"
  docker push $imageName

  if ./arukas ps --all | grep -q $appName; then
    appId=$(./arukas ps --all | grep $appName | awk '{ print $1 }')
    printHeader "Restart arukas app (id: $appId)"
    ./arukas stop $appId
    ./arukas start $appId
  else
    printHeader "Run arukas app (name: $appName)"
    ./arukas run \
        --instances=1 \
        --mem=256 \
        --ports=80:tcp \
        --app-name="$appName" \
        --name="$appName" \
        "$imageName"

    appId=$(./arukas ps --all | grep $appName | awk '{ print $1 }')
    printHeader "Start arukas app (id: $appId, name: $appName)"
    ./arukas start $appId
  fi
fi

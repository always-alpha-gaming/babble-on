#!/usr/bin/env bash
docker run --name babble-on-mongo -detach --publish 27017:27017 mongo

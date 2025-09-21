#!/bin/bash

# Build docker
docker rm firework -f
docker build . --no-cache -t firework
docker run -d -p 3011:80 --name firework firework
#!/bin/bash
export RASE=stockwatch.cloud
baseDirectory=$(basename "`pwd`")
repository=$STOCKWATCH_DOCKERHUB_REPO
docker compose -f compose.yml build
docker tag $baseDirectory-server:latest $repository:server
docker tag $baseDirectory-client:latest $repository:client
docker push $repository:client
docker push $repository:server
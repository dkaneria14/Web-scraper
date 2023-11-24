#!/bin/bash
export RASE=stockwatch.cloud
repository=$STOCKWATCH_DOCKERHUB_REPO
docker compose -f compose.yml build
docker tag stockwatch-server:latest $repository:server
docker tag stockwatch-client:latest $repository:client
docker push $repository:client
docker push $repository:server
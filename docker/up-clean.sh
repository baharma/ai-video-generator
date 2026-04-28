#!/bin/sh
set -e

docker compose down --remove-orphans
docker builder prune -f
docker image prune -f
docker compose up --build

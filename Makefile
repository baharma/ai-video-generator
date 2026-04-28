DOCKER_COMPOSE ?= docker compose

.PHONY: docker-up docker-up-build docker-up-clean docker-down docker-prune docker-reset-cache

docker-up:
	$(DOCKER_COMPOSE) up

docker-up-build:
	$(DOCKER_COMPOSE) up --build

docker-up-clean:
	sh docker/up-clean.sh

docker-down:
	$(DOCKER_COMPOSE) down --remove-orphans

docker-prune:
	$(DOCKER_COMPOSE) down --remove-orphans
	docker builder prune -f
	docker image prune -f
	docker container prune -f
	docker network prune -f

docker-reset-cache:
	$(DOCKER_COMPOSE) down --remove-orphans --volumes
	docker builder prune -f
	docker image prune -f
	docker container prune -f
	docker network prune -f

export DOCKER_CLIENT_TIMEOUT=180
export COMPOSE_HTTP_TIMEOUT=180
sudo docker login docker.io
sudo docker-compose push --ignore-push-failures

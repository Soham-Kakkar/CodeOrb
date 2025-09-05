#!/bin/bash

DOCKER_IMAGE="multi-lang-env:latest"

# Check if the Docker image exists locally
if ! docker images | grep -q "$DOCKER_IMAGE"; then
    echo "Docker image $DOCKER_IMAGE not found. Building..."
    # Build the Docker image if not found
    docker build -t $DOCKER_IMAGE -f Dockerfile .
else
    echo "Docker image $DOCKER_IMAGE already exists."
fi
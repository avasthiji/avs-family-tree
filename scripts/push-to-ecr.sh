#!/bin/bash

set -e

# Configuration
REGION=${AWS_REGION:-us-east-1}
REPO_NAME=avs-family-tree
IMAGE_NAME=avs-family-tree

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$ACCOUNT_ID" ]; then
  echo "Error: Unable to get AWS account ID"
  exit 1
fi

# ECR repository URI
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}"

echo "Building Docker image..."
docker build -t ${IMAGE_NAME}:latest .

echo "Authenticating Docker to ECR..."
aws ecr get-login-password --region ${REGION} | \
  docker login --username AWS --password-stdin ${ECR_URI}

echo "Tagging image..."
GIT_SHA=$(git rev-parse --short HEAD)
docker tag ${IMAGE_NAME}:latest ${ECR_URI}:latest
docker tag ${IMAGE_NAME}:latest ${ECR_URI}:${GIT_SHA}

# Get version from package.json (if available)
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "latest")
if [ "$VERSION" != "latest" ]; then
  docker tag ${IMAGE_NAME}:latest ${ECR_URI}:v${VERSION}
fi

echo "Pushing images to ECR..."
docker push ${ECR_URI}:latest
docker push ${ECR_URI}:${GIT_SHA}

if [ "$VERSION" != "latest" ]; then
  docker push ${ECR_URI}:v${VERSION}
fi

echo "Successfully pushed to ECR:"
echo "  - ${ECR_URI}:latest"
echo "  - ${ECR_URI}:${GIT_SHA}"
if [ "$VERSION" != "latest" ]; then
  echo "  - ${ECR_URI}:v${VERSION}"
fi



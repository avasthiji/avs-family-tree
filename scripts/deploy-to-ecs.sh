#!/bin/bash

set -e

CLUSTER=${ECS_CLUSTER:-avs-family-tree-cluster}
SERVICE=${ECS_SERVICE:-avs-family-tree-service}
REGION=${AWS_REGION:-us-east-1}

echo "Getting current task definition..."
aws ecs describe-task-definition \
  --task-definition ${SERVICE} \
  --query taskDefinition > task-definition.json

echo "Updating task definition with new image..."
IMAGE_TAG=$(git rev-parse --short HEAD)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
NEW_IMAGE="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/avs-family-tree:${IMAGE_TAG}"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed. Please install jq first."
  exit 1
fi

# Update image in task definition
jq ".containerDefinitions[0].image = \"${NEW_IMAGE}\"" task-definition.json > task-definition-new.json

echo "Registering new task definition..."
TASK_DEF_ARN=$(aws ecs register-task-definition \
  --cli-input-json file://task-definition-new.json \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

echo "Updating ECS service..."
aws ecs update-service \
  --cluster ${CLUSTER} \
  --service ${SERVICE} \
  --task-definition ${TASK_DEF_ARN} \
  --force-new-deployment

echo "Waiting for service to stabilize..."
aws ecs wait services-stable \
  --cluster ${CLUSTER} \
  --services ${SERVICE}

echo "Deployment completed successfully!"
echo "Task Definition: ${TASK_DEF_ARN}"



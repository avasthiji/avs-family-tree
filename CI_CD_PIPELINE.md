# 🔄 CI/CD Pipeline Guide

**Complete guide for setting up GitHub Actions CI/CD pipeline for AVS Family Tree Application**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [GitHub Actions Setup](#github-actions-setup)
4. [Pipeline Workflow](#pipeline-workflow)
5. [Step-by-Step Configuration](#step-by-step-configuration)
6. [Deployment Scripts](#deployment-scripts)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide covers setting up a complete CI/CD pipeline using GitHub Actions that:
- Builds Docker images
- Pushes to AWS ECR
- Updates ECS services
- Deploys to production

---

## ✅ Prerequisites

- GitHub repository
- AWS Account with appropriate permissions
- ECR repository created (see [AWS_ECR_SETUP.md](./AWS_ECR_SETUP.md))
- ECS cluster and service created (see [AWS_ECS_DEPLOYMENT.md](./AWS_ECS_DEPLOYMENT.md))
- AWS credentials configured in GitHub Secrets

---

## 🏗️ GitHub Actions Setup

### Step 1: Create GitHub Secrets

Go to your GitHub repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**

Add the following secrets:

1. **AWS_ACCESS_KEY_ID**: AWS access key
2. **AWS_SECRET_ACCESS_KEY**: AWS secret key
3. **AWS_REGION**: AWS region (e.g., `us-east-1`)
4. **ECR_REPOSITORY**: ECR repository name (e.g., `avs-family-tree`)
5. **ECS_CLUSTER**: ECS cluster name (e.g., `avs-family-tree-cluster`)
6. **ECS_SERVICE**: ECS service name (e.g., `avs-family-tree-service`)
7. **ECR_REGISTRY**: ECR registry URL (e.g., `<account-id>.dkr.ecr.us-east-1.amazonaws.com`)

---

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: avs-family-tree
  ECS_CLUSTER: avs-family-tree-cluster
  ECS_SERVICE: avs-family-tree-service

jobs:
  build-and-deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Get version from package.json
        id: package-version
        run: |
          VERSION=$(node -p "require('./package.json').version")
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "Version: $VERSION"

      - name: Get short commit SHA
        id: commit-sha
        run: |
          SHA=$(git rev-parse --short HEAD)
          echo "sha=$SHA" >> $GITHUB_OUTPUT
          echo "Commit SHA: $SHA"

      - name: Build, tag, and push image to Amazon ECR
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ steps.commit-sha.outputs.sha }}
        run: |
          # Build Docker image
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          
          # Push image with commit SHA tag
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          
          # Push latest tag
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
          
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT
          echo "Image pushed: $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"

      - name: Download task definition
        run: |
          aws ecs describe-task-definition \
            --task-definition ${{ env.ECS_SERVICE }} \
            --query taskDefinition > task-definition.json

      - name: Fill in the new image ID in the Amazon ECS task definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: task-definition.json
          container-name: avs-family-tree
          image: ${{ steps.build-image.outputs.image }}

      - name: Deploy Amazon ECS task definition
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ${{ steps.task-def.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true

      - name: Deployment status
        run: |
          echo "Deployment completed successfully!"
          echo "Image: ${{ steps.build-image.outputs.image }}"
          echo "Service: ${{ env.ECS_SERVICE }}"
          echo "Cluster: ${{ env.ECS_CLUSTER }}"
```

---

### Step 3: Create Test Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
```

---

### Step 4: Create Build Workflow

Create `.github/workflows/build.yml`:

```yaml
name: Build Docker Image

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Get short commit SHA
        id: commit-sha
        run: |
          SHA=$(git rev-parse --short HEAD)
          echo "sha=$SHA" >> $GITHUB_OUTPUT

      - name: Build Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: avs-family-tree
          IMAGE_TAG: ${{ steps.commit-sha.outputs.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          echo "Image built: $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"

      - name: Test Docker image
        run: |
          docker run --rm -d --name test-container -p 3000:3000 $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          sleep 10
          curl -f http://localhost:3000 || exit 1
          docker stop test-container
```

---

## 🔄 Pipeline Workflow

### Workflow Stages

1. **Checkout**: Get code from repository
2. **Configure AWS**: Set up AWS credentials
3. **Login to ECR**: Authenticate with ECR
4. **Build Image**: Build Docker image
5. **Tag Image**: Tag with commit SHA and latest
6. **Push Image**: Push to ECR
7. **Update Task Definition**: Update ECS task definition
8. **Deploy**: Deploy to ECS service

### Branch Strategy

- **main**: Production deployments
- **develop**: Development deployments
- **feature/***: Build and test only

---

## 📝 Step-by-Step Configuration

### 1. Create Workflow Directory

```bash
mkdir -p .github/workflows
```

### 2. Add Workflow Files

Copy the workflow files above to `.github/workflows/`

### 3. Configure GitHub Secrets

Add secrets in GitHub repository settings (see Step 1 above)

### 4. Test Workflow

```bash
# Push to main branch
git push origin main

# Or trigger manually
# GitHub > Actions > Deploy to AWS ECS > Run workflow
```

---

## 📜 Deployment Scripts

### Script: Push to ECR

Create `scripts/push-to-ecr.sh`:

```bash
#!/bin/bash
set -e

REGION=${AWS_REGION:-us-east-1}
REPO_NAME=avs-family-tree
IMAGE_NAME=avs-family-tree

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
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

echo "Pushing images to ECR..."
docker push ${ECR_URI}:latest
docker push ${ECR_URI}:${GIT_SHA}

echo "Successfully pushed to ECR"
```

### Script: Deploy to ECS

Create `scripts/deploy-to-ecs.sh`:

```bash
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

# Update image in task definition (requires jq)
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
```

---

## 🐛 Troubleshooting

### Workflow Fails at ECR Login

**Check:**
1. AWS credentials are correct in GitHub Secrets
2. IAM user has ECR permissions
3. Region is correct

### Build Fails

**Check:**
1. Dockerfile is correct
2. Build context is correct
3. Dependencies are available

### Deployment Fails

**Check:**
1. ECS cluster and service exist
2. Task definition is valid
3. Image exists in ECR
4. IAM role has ECS permissions

### View Workflow Logs

1. Go to GitHub > Actions
2. Click on failed workflow
3. Click on failed job
4. View logs

---

## 📊 Useful Commands

```bash
# Test workflow locally (using act)
act -j build-and-deploy

# View workflow runs
gh run list

# View workflow logs
gh run view <run-id> --log

# Re-run failed workflow
gh run rerun <run-id>
```

---

## ✅ Best Practices

1. **Use secrets** - Don't hardcode credentials
2. **Test workflows** - Test on feature branches first
3. **Use tags** - Tag images with commit SHA
4. **Rolling updates** - ECS handles rolling updates
5. **Monitor deployments** - Set up notifications
6. **Clean up** - Remove old images from ECR
7. **Security scanning** - Scan images for vulnerabilities
8. **Approval gates** - Require approval for production
9. **Environment separation** - Separate dev/staging/prod
10. **Version control** - Keep workflow files in git

---

## 📚 Next Steps

- [AWS ECR Setup Guide](./AWS_ECR_SETUP.md) - Container registry
- [AWS ECS Deployment Guide](./AWS_ECS_DEPLOYMENT.md) - ECS deployment
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment overview

---

**Questions?** Check the main [Deployment Guide](./DEPLOYMENT_GUIDE.md) or [Troubleshooting](#troubleshooting) section.



# 📦 AWS ECR Setup Guide

**Complete guide for setting up Amazon Elastic Container Registry (ECR)**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Creating ECR Repository](#creating-ecr-repository)
4. [Pushing Images to ECR](#pushing-images-to-ecr)
5. [Pulling Images from ECR](#pulling-images-from-ecr)
6. [Repository Policies](#repository-policies)
7. [Image Tagging Strategy](#image-tagging-strategy)
8. [Lifecycle Policies](#lifecycle-policies)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Amazon ECR is a fully managed Docker container registry that makes it easy to store, manage, and deploy Docker container images. This guide covers setting up ECR for the AVS Family Tree application.

---

## ✅ Prerequisites

- AWS Account
- AWS CLI installed and configured
- Docker installed locally
- IAM permissions for ECR:
  - `ecr:CreateRepository`
  - `ecr:GetAuthorizationToken`
  - `ecr:BatchCheckLayerAvailability`
  - `ecr:GetDownloadUrlForLayer`
  - `ecr:BatchGetImage`
  - `ecr:PutImage`
  - `ecr:InitiateLayerUpload`
  - `ecr:UploadLayerPart`
  - `ecr:CompleteLayerUpload`

---

## 🏗️ Creating ECR Repository

### Method 1: Using AWS CLI

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name avs-family-tree \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Verify repository was created
aws ecr describe-repositories --repository-names avs-family-tree
```

### Method 2: Using AWS Console

1. Go to **Amazon ECR** in AWS Console
2. Click **Create repository**
3. Configure settings:
   - **Repository name**: `avs-family-tree`
   - **Visibility**: Private
   - **Tag immutability**: Enable (recommended)
   - **Scan on push**: Enable (recommended)
   - **Encryption**: AES-256 (default)
   - **KMS encryption**: Optional (for advanced encryption)
4. Click **Create repository**

### Get Repository URI

```bash
# Get repository URI
aws ecr describe-repositories \
  --repository-names avs-family-tree \
  --query 'repositories[0].repositoryUri' \
  --output text

# Output will be: <account-id>.dkr.ecr.<region>.amazonaws.com/avs-family-tree
```

---

## 🚀 Pushing Images to ECR

### Step 1: Authenticate Docker to ECR

```bash
# Get login token (valid for 12 hours)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Example output:
# Login Succeeded
```

### Step 2: Build Docker Image

```bash
# Build the image
docker build -t avs-family-tree:latest .

# Or build with specific tag
docker build -t avs-family-tree:v1.0.0 .
```

### Step 3: Tag Image for ECR

```bash
# Get your AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1
REPO_NAME=avs-family-tree

# Tag image for ECR
docker tag avs-family-tree:latest \
  ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:latest

# Tag with version
docker tag avs-family-tree:v1.0.0 \
  ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:v1.0.0

# Tag with git commit SHA (recommended for CI/CD)
docker tag avs-family-tree:latest \
  ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:$(git rev-parse --short HEAD)
```

### Step 4: Push Image to ECR

```bash
# Push latest tag
docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:latest

# Push version tag
docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:v1.0.0

# Push commit SHA tag
docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:$(git rev-parse --short HEAD)
```

### Complete Push Script

Create `scripts/push-to-ecr.sh`:

```bash
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
docker tag ${IMAGE_NAME}:latest ${ECR_URI}:latest

# Get git commit SHA
GIT_SHA=$(git rev-parse --short HEAD)
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
```

Make it executable:

```bash
chmod +x scripts/push-to-ecr.sh
```

---

## 📥 Pulling Images from ECR

### Pull Image Locally

```bash
# Authenticate
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Pull image
docker pull <account-id>.dkr.ecr.us-east-1.amazonaws.com/avs-family-tree:latest
```

### Pull in ECS Task Definition

ECR images are automatically pulled by ECS when you specify the image URI in your task definition.

---

## 🔐 Repository Policies

### View Current Policy

```bash
aws ecr get-repository-policy \
  --repository-name avs-family-tree \
  --region us-east-1
```

### Set Repository Policy (Allow Cross-Account Access)

Create `ecr-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCrossAccountPull",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<other-account-id>:root"
      },
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchCheckLayerAvailability",
        "ecr:BatchGetImage"
      ]
    }
  ]
}
```

Apply policy:

```bash
aws ecr set-repository-policy \
  --repository-name avs-family-tree \
  --policy-text file://ecr-policy.json \
  --region us-east-1
```

---

## 🏷️ Image Tagging Strategy

### Recommended Tagging Strategy

1. **latest**: Always points to the most recent production build
2. **v1.0.0**: Semantic version tags for releases
3. **<commit-sha>**: Git commit SHA for traceability
4. **<branch-name>**: Branch name for feature branches (CI/CD)

### Example Tagging

```bash
# Production release
docker tag avs-family-tree:latest \
  ${ECR_URI}:v1.0.0

# Git commit SHA
docker tag avs-family-tree:latest \
  ${ECR_URI}:abc1234

# Feature branch
docker tag avs-family-tree:latest \
  ${ECR_URI}:feature-user-profile
```

---

## ♻️ Lifecycle Policies

Lifecycle policies help manage image retention and reduce storage costs.

### Create Lifecycle Policy

Create `ecr-lifecycle-policy.json`:

```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 10 production images",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["v"],
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {
        "type": "expire"
      }
    },
    {
      "rulePriority": 2,
      "description": "Keep last 5 latest images",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["latest"],
        "countType": "imageCountMoreThan",
        "countNumber": 5
      },
      "action": {
        "type": "expire"
      }
    },
    {
      "rulePriority": 3,
      "description": "Delete untagged images older than 7 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 7
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```

Apply lifecycle policy:

```bash
aws ecr put-lifecycle-policy \
  --repository-name avs-family-tree \
  --lifecycle-policy-text file://ecr-lifecycle-policy.json \
  --region us-east-1
```

### View Lifecycle Policy

```bash
aws ecr get-lifecycle-policy \
  --repository-name avs-family-tree \
  --region us-east-1
```

---

## 🔍 Image Scanning

### Automatic Scanning

Enable scan on push when creating repository (already configured above).

### Manual Scan

```bash
aws ecr start-image-scan \
  --repository-name avs-family-tree \
  --image-id imageTag=latest \
  --region us-east-1
```

### View Scan Results

```bash
aws ecr describe-image-scan-findings \
  --repository-name avs-family-tree \
  --image-id imageTag=latest \
  --region us-east-1
```

---

## 🐛 Troubleshooting

### Authentication Errors

**Issue:** `no basic auth credentials`

```bash
# Re-authenticate
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### Permission Denied

**Issue:** `AccessDenied` when pushing/pulling

- Verify IAM user has required ECR permissions
- Check repository policy
- Verify you're using correct AWS account

### Image Not Found

**Issue:** `Image not found` when pulling

```bash
# List images in repository
aws ecr list-images \
  --repository-name avs-family-tree \
  --region us-east-1

# Verify tag exists
aws ecr describe-images \
  --repository-name avs-family-tree \
  --image-ids imageTag=latest \
  --region us-east-1
```

### Push Fails with Layer Size

**Issue:** Layer too large

- Docker has a 10GB layer size limit
- Optimize Dockerfile to reduce layer size
- Use multi-stage builds

---

## 📊 Useful Commands

```bash
# List repositories
aws ecr describe-repositories

# List images in repository
aws ecr list-images --repository-name avs-family-tree

# Describe specific image
aws ecr describe-images \
  --repository-name avs-family-tree \
  --image-ids imageTag=latest

# Delete image
aws ecr batch-delete-image \
  --repository-name avs-family-tree \
  --image-ids imageTag=old-tag

# Get repository URI
aws ecr describe-repositories \
  --repository-names avs-family-tree \
  --query 'repositories[0].repositoryUri' \
  --output text
```

---

## ✅ Best Practices

1. **Enable scan on push** - Detect vulnerabilities automatically
2. **Use lifecycle policies** - Manage image retention
3. **Tag immutability** - Prevent tag overwrites
4. **Use semantic versioning** - Clear version management
5. **Tag with commit SHA** - Traceability
6. **Cross-account access** - Use repository policies
7. **Monitor costs** - Lifecycle policies reduce storage costs
8. **Regular scanning** - Check for vulnerabilities
9. **Access control** - Use IAM policies for security
10. **Backup strategy** - Keep important versions

---

## 📚 Next Steps

- [AWS ECS Deployment Guide](./AWS_ECS_DEPLOYMENT.md) - Deploy to ECS
- [CI/CD Pipeline Guide](./CI_CD_PIPELINE.md) - Automated deployments
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment overview

---

**Questions?** Check the main [Deployment Guide](./DEPLOYMENT_GUIDE.md) or [Troubleshooting](#troubleshooting) section.



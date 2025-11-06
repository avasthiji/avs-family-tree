# 🚢 AWS ECS Deployment Guide

**Complete guide for deploying AVS Family Tree Application on Amazon ECS**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Step 1: Create ECS Cluster](#step-1-create-ecs-cluster)
5. [Step 2: Create Task Definition](#step-2-create-task-definition)
6. [Step 3: Create Service](#step-3-create-service)
7. [Step 4: Configure Auto Scaling](#step-4-configure-auto-scaling)
8. [Step 5: Set Up CloudWatch Logs](#step-5-set-up-cloudwatch-logs)
9. [Step 6: Configure Security Groups](#step-6-configure-security-groups)
10. [Step 7: Update and Deploy](#step-7-update-and-deploy)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Amazon Elastic Container Service (ECS) is a fully managed container orchestration service. This guide covers deploying the AVS Family Tree application on ECS using Fargate (serverless).

---

## ✅ Prerequisites

- AWS Account with appropriate permissions
- ECR repository set up (see [AWS_ECR_SETUP.md](./AWS_ECR_SETUP.md))
- Docker image pushed to ECR
- VPC with public and private subnets
- Application Load Balancer (optional, recommended)
- MongoDB Atlas cluster or database endpoint

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  Application    │
│  Load Balancer   │
└────────┬────────┘
         │
┌────────▼────────┐
│  ECS Cluster    │
│  ┌──────────┐   │
│  │  Task 1   │   │
│  │  (Fargate)│   │
│  └──────────┘   │
│  ┌──────────┐   │
│  │  Task 2   │   │
│  │  (Fargate)│   │
│  └──────────┘   │
└────────┬────────┘
         │
┌────────▼────────┐
│  MongoDB Atlas  │
└─────────────────┘
```

---

## 📝 Step-by-Step Deployment

### Step 1: Create ECS Cluster

#### Method 1: Using AWS CLI

```bash
# Create ECS cluster
aws ecs create-cluster \
  --cluster-name avs-family-tree-cluster \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1 \
    capacityProvider=FARGATE_SPOT,weight=1

# Verify cluster
aws ecs describe-clusters --clusters avs-family-tree-cluster
```

#### Method 2: Using AWS Console

1. Go to **Amazon ECS** in AWS Console
2. Click **Clusters** > **Create Cluster**
3. Configure cluster:
   - **Cluster name**: `avs-family-tree-cluster`
   - **Infrastructure**: AWS Fargate (Serverless)
   - **Monitoring**: CloudWatch Container Insights (optional)
4. Click **Create**

---

### Step 2: Create Task Definition

#### Method 1: Using AWS CLI

Create `ecs-task-definition.json`:

```json
{
  "family": "avs-family-tree",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "avs-family-tree",
      "image": "<account-id>.dkr.ecr.<region>.amazonaws.com/avs-family-tree:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:<region>:<account-id>:secret:avs-family-tree/mongodb-uri"
        },
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:<region>:<account-id>:secret:avs-family-tree/nextauth-secret"
        },
        {
          "name": "NEXTAUTH_URL",
          "valueFrom": "arn:aws:secretsmanager:<region>:<account-id>:secret:avs-family-tree/nextauth-url"
        },
        {
          "name": "EMAIL_USER",
          "valueFrom": "arn:aws:secretsmanager:<region>:<account-id>:secret:avs-family-tree/email-user"
        },
        {
          "name": "EMAIL_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:<region>:<account-id>:secret:avs-family-tree/email-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/avs-family-tree",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register task definition:

```bash
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json
```

#### Method 2: Using AWS Console

1. Go to **ECS** > **Task Definitions** > **Create new Task Definition**
2. Configure:
   - **Task definition family**: `avs-family-tree`
   - **Launch type**: Fargate
   - **Task size**:
     - CPU: 0.5 vCPU (512)
     - Memory: 1 GB (1024)
3. Add container:
   - **Container name**: `avs-family-tree`
   - **Image**: `<account-id>.dkr.ecr.<region>.amazonaws.com/avs-family-tree:latest`
   - **Port mappings**: 3000
   - **Environment variables**: Add from Secrets Manager or directly
4. Configure logging:
   - **Log driver**: awslogs
   - **Log group**: `/ecs/avs-family-tree`
   - **Region**: us-east-1
5. Click **Create**

---

### Step 3: Create Service

#### Method 1: Using AWS CLI

Create `ecs-service.json`:

```json
{
  "cluster": "avs-family-tree-cluster",
  "serviceName": "avs-family-tree-service",
  "taskDefinition": "avs-family-tree",
  "desiredCount": 2,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": [
        "subnet-12345678",
        "subnet-87654321"
      ],
      "securityGroups": [
        "sg-12345678"
      ],
      "assignPublicIp": "ENABLED"
    }
  },
  "loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:us-east-1:account-id:targetgroup/avs-family-tree-tg/1234567890123456",
      "containerName": "avs-family-tree",
      "containerPort": 3000
    }
  ],
  "healthCheckGracePeriodSeconds": 60,
  "deploymentConfiguration": {
    "maximumPercent": 200,
    "minimumHealthyPercent": 100,
    "deploymentCircuitBreaker": {
      "enable": true,
      "rollback": true
    }
  }
}
```

Create service:

```bash
aws ecs create-service \
  --cli-input-json file://ecs-service.json
```

#### Method 2: Using AWS Console

1. Go to **ECS** > **Clusters** > `avs-family-tree-cluster`
2. Click **Services** tab > **Create**
3. Configure:
   - **Launch type**: Fargate
   - **Task definition**: `avs-family-tree`
   - **Service name**: `avs-family-tree-service`
   - **Desired tasks**: 2
4. Configure networking:
   - **VPC**: Select your VPC
   - **Subnets**: Select public subnets
   - **Security groups**: Create or select existing
   - **Auto-assign public IP**: Enable
5. Load balancing (optional):
   - **Load balancer type**: Application Load Balancer
   - **Target group**: Select or create new
   - **Container to load balance**: `avs-family-tree:3000`
6. Auto Scaling (optional):
   - Enable auto scaling
   - Min tasks: 2
   - Max tasks: 10
   - Target CPU: 70%
7. Click **Create**

---

### Step 4: Configure Auto Scaling

#### Method 1: Using AWS CLI

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/avs-family-tree-cluster/avs-family-tree-service \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/avs-family-tree-cluster/avs-family-tree-service \
  --policy-name cpu-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
```

#### Method 2: Using AWS Console

1. Go to **ECS** > **Clusters** > `avs-family-tree-cluster` > **Services** > `avs-family-tree-service`
2. Click **Auto Scaling** tab
3. Click **Create auto scaling**
4. Configure:
   - **Min capacity**: 2
   - **Max capacity**: 10
   - **Target tracking**: CPU utilization
   - **Target value**: 70%
5. Click **Create**

---

### Step 5: Set Up CloudWatch Logs

#### Create Log Group

```bash
# Create log group
aws logs create-log-group \
  --log-group-name /ecs/avs-family-tree

# Set retention (optional, in days)
aws logs put-retention-policy \
  --log-group-name /ecs/avs-family-tree \
  --retention-in-days 7
```

#### View Logs

```bash
# View logs
aws logs tail /ecs/avs-family-tree --follow

# Or in AWS Console:
# CloudWatch > Log groups > /ecs/avs-family-tree
```

---

### Step 6: Configure Security Groups

#### Security Group Rules

**Inbound Rules:**
- Port 3000: From ALB security group (if using ALB)
- Port 3000: From anywhere (if not using ALB, for testing only)

**Outbound Rules:**
- All traffic: To anywhere (for MongoDB Atlas access)

#### Create Security Group

```bash
# Create security group
aws ec2 create-security-group \
  --group-name avs-family-tree-sg \
  --description "Security group for AVS Family Tree ECS tasks" \
  --vpc-id vpc-12345678

# Allow inbound from ALB (replace sg-alb-id with ALB security group ID)
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 3000 \
  --source-group sg-alb-id

# Or allow from anywhere (for testing only)
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0
```

---

### Step 7: Update and Deploy

#### Update Service with New Task Definition

```bash
# Get latest task definition revision
TASK_DEF=$(aws ecs describe-task-definition \
  --task-definition avs-family-tree \
  --query 'taskDefinition.revision' \
  --output text)

# Update service
aws ecs update-service \
  --cluster avs-family-tree-cluster \
  --service avs-family-tree-service \
  --task-definition avs-family-tree:${TASK_DEF} \
  --force-new-deployment
```

#### Rolling Update

ECS automatically performs rolling updates:
1. New tasks are created with new task definition
2. Health checks pass
3. Old tasks are drained and stopped
4. Service maintains desired count during update

---

## 🔍 Monitoring

### View Service Status

```bash
# Describe service
aws ecs describe-services \
  --cluster avs-family-tree-cluster \
  --services avs-family-tree-service

# List tasks
aws ecs list-tasks \
  --cluster avs-family-tree-cluster \
  --service-name avs-family-tree-service

# Describe tasks
aws ecs describe-tasks \
  --cluster avs-family-tree-cluster \
  --tasks <task-id>
```

### CloudWatch Metrics

- CPUUtilization
- MemoryUtilization
- RunningTaskCount
- DesiredTaskCount

---

## 🐛 Troubleshooting

### Tasks Won't Start

**Check:**
1. Task definition is correct
2. Image exists in ECR
3. Security groups allow traffic
4. Subnets are configured correctly
5. IAM role has correct permissions

**View logs:**
```bash
aws logs tail /ecs/avs-family-tree --follow
```

### Tasks Keep Stopping

**Check:**
1. Health check configuration
2. Application is listening on port 3000
3. Environment variables are set correctly
4. Database connection is working

**View task logs:**
```bash
aws ecs describe-tasks \
  --cluster avs-family-tree-cluster \
  --tasks <task-id> \
  --query 'tasks[0].stoppedReason'
```

### Health Check Failures

**Check:**
1. Health check endpoint exists: `/api/health`
2. Health check command is correct
3. Application is starting correctly
4. Health check grace period is sufficient

### Service Won't Update

**Check:**
1. Task definition is registered
2. Service is not in DRAINING state
3. Deployment is in progress
4. Check service events

---

## 📊 Useful Commands

```bash
# List clusters
aws ecs list-clusters

# Describe cluster
aws ecs describe-clusters --clusters avs-family-tree-cluster

# List services
aws ecs list-services --cluster avs-family-tree-cluster

# Describe service
aws ecs describe-services \
  --cluster avs-family-tree-cluster \
  --services avs-family-tree-service

# List tasks
aws ecs list-tasks \
  --cluster avs-family-tree-cluster \
  --service-name avs-family-tree-service

# Describe task
aws ecs describe-tasks \
  --cluster avs-family-tree-cluster \
  --tasks <task-id>

# Stop task
aws ecs stop-task \
  --cluster avs-family-tree-cluster \
  --task <task-id>

# Update service
aws ecs update-service \
  --cluster avs-family-tree-cluster \
  --service avs-family-tree-service \
  --task-definition avs-family-tree:latest \
  --force-new-deployment

# Scale service
aws ecs update-service \
  --cluster avs-family-tree-cluster \
  --service avs-family-tree-service \
  --desired-count 4
```

---

## ✅ Best Practices

1. **Use Fargate** - No server management
2. **Multiple tasks** - High availability
3. **Auto scaling** - Handle traffic spikes
4. **Health checks** - Ensure tasks are healthy
5. **CloudWatch Logs** - Monitor application
6. **Secrets Manager** - Store sensitive data
7. **Security groups** - Restrict access
8. **Task definitions** - Version control
9. **Rolling updates** - Zero downtime
10. **Monitoring** - Set up alerts

---

## 📚 Next Steps

- [AWS ALB Setup Guide](./AWS_ALB_SETUP.md) - Configure load balancer
- [CI/CD Pipeline Guide](./CI_CD_PIPELINE.md) - Automated deployments
- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md) - Configure secrets

---

**Questions?** Check the main [Deployment Guide](./DEPLOYMENT_GUIDE.md) or [Troubleshooting](#troubleshooting) section.



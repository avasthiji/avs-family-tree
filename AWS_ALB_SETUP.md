# ⚖️ AWS Application Load Balancer Setup Guide

**Complete guide for setting up Application Load Balancer (ALB) for AVS Family Tree Application**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Step 1: Create Target Group](#step-1-create-target-group)
5. [Step 2: Create Application Load Balancer](#step-2-create-application-load-balancer)
6. [Step 3: Configure Listeners](#step-3-configure-listeners)
7. [Step 4: Configure SSL/TLS](#step-4-configure-ssltls)
8. [Step 5: Configure Health Checks](#step-5-configure-health-checks)
9. [Step 6: Configure Security Groups](#step-6-configure-security-groups)
10. [Step 7: Attach to ECS Service](#step-7-attach-to-ecs-service)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Application Load Balancer (ALB) distributes incoming application traffic across multiple targets (ECS tasks) in multiple Availability Zones. This guide covers setting up ALB for the AVS Family Tree application.

---

## ✅ Prerequisites

- AWS Account with appropriate permissions
- VPC with at least 2 public subnets in different Availability Zones
- ECS cluster and service created (see [AWS_ECS_DEPLOYMENT.md](./AWS_ECS_DEPLOYMENT.md))
- SSL certificate in ACM (for HTTPS)
- Domain name (optional but recommended)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Internet      │
└────────┬────────┘
         │
┌────────▼────────┐
│  Route 53        │ (DNS)
└────────┬────────┘
         │
┌────────▼────────┐
│  Application    │
│  Load Balancer   │
│  ┌──────────┐   │
│  │Listener  │   │ (HTTPS:443)
│  │          │   │ (HTTP:80)
│  └────┬─────┘   │
│       │         │
│  ┌────▼─────┐   │
│  │Target    │   │
│  │Group     │   │
│  └────┬─────┘   │
└───────┼─────────┘
        │
┌───────▼──────────┐
│  ECS Tasks       │
│  ┌──────────┐   │
│  │  Task 1   │   │
│  └──────────┘   │
│  ┌──────────┐   │
│  │  Task 2   │   │
│  └──────────┘   │
└─────────────────┘
```

---

## 📝 Step-by-Step Setup

### Step 1: Create Target Group

#### Method 1: Using AWS CLI

```bash
# Create target group
aws elbv2 create-target-group \
  --name avs-family-tree-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-12345678 \
  --target-type ip \
  --health-check-protocol HTTP \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --matcher HttpCode=200

# Get target group ARN
TG_ARN=$(aws elbv2 describe-target-groups \
  --names avs-family-tree-tg \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)
```

#### Method 2: Using AWS Console

1. Go to **EC2** > **Load Balancers** > **Target Groups** > **Create target group**
2. Configure:
   - **Target type**: IP addresses
   - **Target group name**: `avs-family-tree-tg`
   - **Protocol**: HTTP
   - **Port**: 3000
   - **VPC**: Select your VPC
3. Health checks:
   - **Protocol**: HTTP
   - **Path**: `/api/health`
   - **Health check interval**: 30 seconds
   - **Health check timeout**: 5 seconds
   - **Healthy threshold**: 2
   - **Unhealthy threshold**: 3
   - **Success codes**: 200
4. Click **Next** > **Create target group**

---

### Step 2: Create Application Load Balancer

#### Method 1: Using AWS CLI

```bash
# Create security group for ALB
aws ec2 create-security-group \
  --group-name avs-family-tree-alb-sg \
  --description "Security group for AVS Family Tree ALB" \
  --vpc-id vpc-12345678

ALB_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=avs-family-tree-alb-sg" \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

# Allow HTTP and HTTPS from internet
aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Get subnet IDs (replace with your subnet IDs)
SUBNET_1=subnet-12345678
SUBNET_2=subnet-87654321

# Create ALB
aws elbv2 create-load-balancer \
  --name avs-family-tree-alb \
  --subnets $SUBNET_1 $SUBNET_2 \
  --security-groups $ALB_SG_ID \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

# Get ALB ARN
ALB_ARN=$(aws elbv2 describe-load-balancers \
  --names avs-family-tree-alb \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names avs-family-tree-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

echo "ALB DNS: $ALB_DNS"
```

#### Method 2: Using AWS Console

1. Go to **EC2** > **Load Balancers** > **Create Load Balancer**
2. Select **Application Load Balancer**
3. Configure:
   - **Name**: `avs-family-tree-alb`
   - **Scheme**: Internet-facing
   - **IP address type**: IPv4
   - **Network mapping**:
     - **VPC**: Select your VPC
     - **Availability Zones**: Select at least 2 public subnets
4. Security groups:
   - Create new or select existing
   - Allow inbound: HTTP (80), HTTPS (443)
5. Listeners:
   - **HTTP**: Port 80
   - **HTTPS**: Port 443 (add SSL certificate)
6. Click **Create load balancer**

---

### Step 3: Configure Listeners

#### HTTP Listener (Port 80)

Redirect HTTP to HTTPS:

```bash
# Create HTTP listener with redirect to HTTPS
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'
```

#### HTTPS Listener (Port 443)

```bash
# Get SSL certificate ARN (from ACM)
CERT_ARN=arn:aws:acm:us-east-1:account-id:certificate/cert-id

# Create HTTPS listener
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=$CERT_ARN \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN \
    --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06
```

---

### Step 4: Configure SSL/TLS

#### Request SSL Certificate in ACM

1. Go to **ACM** (Certificate Manager) > **Request certificate**
2. Configure:
   - **Domain name**: `yourdomain.com`
   - **Subject alternative names**: `*.yourdomain.com` (optional)
   - **Validation method**: DNS validation (recommended)
3. Validate certificate:
   - Add DNS CNAME records to your domain
   - Wait for validation (usually 5-30 minutes)
4. Get certificate ARN

#### Use Certificate in ALB

The certificate is automatically used when you create the HTTPS listener (see Step 3).

---

### Step 5: Configure Health Checks

Health checks are configured when creating the target group. Update if needed:

```bash
# Update health check
aws elbv2 modify-target-group \
  --target-group-arn $TG_ARN \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --matcher HttpCode=200
```

---

### Step 6: Configure Security Groups

#### ALB Security Group

**Inbound Rules:**
- Port 80: From anywhere (0.0.0.0/0)
- Port 443: From anywhere (0.0.0.0/0)

**Outbound Rules:**
- All traffic: To ECS task security group

#### ECS Task Security Group

**Inbound Rules:**
- Port 3000: From ALB security group

**Outbound Rules:**
- All traffic: To anywhere (for MongoDB Atlas)

---

### Step 7: Attach to ECS Service

#### Update ECS Service

```bash
# Update ECS service to attach ALB
aws ecs update-service \
  --cluster avs-family-tree-cluster \
  --service avs-family-tree-service \
  --load-balancers \
    targetGroupArn=$TG_ARN,containerName=avs-family-tree,containerPort=3000 \
  --health-check-grace-period-seconds 60
```

Or update via AWS Console:

1. Go to **ECS** > **Clusters** > `avs-family-tree-cluster` > **Services** > `avs-family-tree-service`
2. Click **Update**
3. Configure load balancing:
   - **Load balancer type**: Application Load Balancer
   - **Load balancer name**: `avs-family-tree-alb`
   - **Container to load balance**: `avs-family-tree:3000`
   - **Target group name**: `avs-family-tree-tg`
4. Click **Update**

---

## 🔍 Monitoring

### View ALB Metrics

```bash
# Get ALB metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name RequestCount \
  --dimensions Name=LoadBalancer,Value=app/avs-family-tree-alb/1234567890abcdef \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### CloudWatch Metrics

- RequestCount
- TargetResponseTime
- HTTPCode_Target_2XX_Count
- HTTPCode_Target_4XX_Count
- HTTPCode_Target_5XX_Count
- ActiveConnectionCount
- HealthyHostCount
- UnHealthyHostCount

---

## 🐛 Troubleshooting

### Health Check Failures

**Check:**
1. Health check path is correct: `/api/health`
2. Application is running on port 3000
3. Security groups allow traffic
4. Target group is registered correctly

**View health check status:**
```bash
aws elbv2 describe-target-health \
  --target-group-arn $TG_ARN
```

### 502 Bad Gateway

**Check:**
1. ECS tasks are running
2. Tasks are registered in target group
3. Security groups allow traffic
4. Application is listening on port 3000

### SSL Certificate Issues

**Check:**
1. Certificate is validated in ACM
2. Certificate is in the same region as ALB
3. Certificate ARN is correct
4. Domain name matches certificate

---

## 📊 Useful Commands

```bash
# List load balancers
aws elbv2 describe-load-balancers

# Describe load balancer
aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN

# List target groups
aws elbv2 describe-target-groups

# Describe target group
aws elbv2 describe-target-groups \
  --target-group-arns $TG_ARN

# Describe target health
aws elbv2 describe-target-health \
  --target-group-arn $TG_ARN

# List listeners
aws elbv2 describe-listeners \
  --load-balancer-arn $ALB_ARN

# Get ALB DNS
aws elbv2 describe-load-balancers \
  --names avs-family-tree-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text
```

---

## ✅ Best Practices

1. **Use HTTPS** - Secure connections
2. **Redirect HTTP to HTTPS** - Force secure connections
3. **Multiple Availability Zones** - High availability
4. **Health checks** - Ensure targets are healthy
5. **Sticky sessions** - If needed for session management
6. **SSL/TLS policies** - Use modern TLS versions
7. **WAF** - Web Application Firewall (optional)
8. **Monitoring** - Set up CloudWatch alarms
9. **Access logs** - Enable ALB access logs
10. **Cost optimization** - Use appropriate instance types

---

## 📚 Next Steps

- [CI/CD Pipeline Guide](./CI_CD_PIPELINE.md) - Automated deployments
- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md) - Configure secrets
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment overview

---

**Questions?** Check the main [Deployment Guide](./DEPLOYMENT_GUIDE.md) or [Troubleshooting](#troubleshooting) section.



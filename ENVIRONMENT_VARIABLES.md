# 🔐 Environment Variables Guide

**Complete guide for configuring environment variables for AVS Family Tree Application**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Required Variables](#required-variables)
3. [Optional Variables](#optional-variables)
4. [AWS Secrets Manager Setup](#aws-secrets-manager-setup)
5. [ECS Task Definition Configuration](#ecs-task-definition-configuration)
6. [Local Development Setup](#local-development-setup)
7. [Production Setup](#production-setup)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide covers all environment variables needed for the AVS Family Tree application, how to set them up for local development and production deployment on AWS.

---

## ✅ Required Variables

### Database

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/avs-family-tree?retryWrites=true&w=majority
```

**Description:** MongoDB connection string  
**Example (Atlas):** `mongodb+srv://user:pass@cluster.mongodb.net/dbname`  
**Example (Local):** `mongodb://localhost:27017/avs-family-tree`

---

### Authentication

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

**NEXTAUTH_URL:**  
- **Description:** Public URL of your application
- **Local:** `http://localhost:3000`
- **Production:** `https://yourdomain.com`

**NEXTAUTH_SECRET:**  
- **Description:** Secret key for NextAuth.js (generate random string)
- **Generate:** `openssl rand -base64 32`

---

### Email Configuration

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

**EMAIL_USER:** Gmail address for sending emails  
**EMAIL_PASSWORD:** Gmail app password (not regular password)  
**EMAIL_FROM:** From address for emails

---

### Application

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Description:** Public URL of your application (used for client-side)  
**Local:** `http://localhost:3000`  
**Production:** `https://yourdomain.com`

---

## 📋 Optional Variables

### Feature Flags

```env
MATRIMONIAL_FEATURE=true
EVENT_FEATURE=true
```

**Description:** Enable/disable features  
**Values:** `true` or `false`  
**Default:** `false`

---

### Node Environment

```env
NODE_ENV=production
```

**Description:** Node.js environment  
**Values:** `development`, `production`, `test`  
**Default:** `development`

---

### Upload Configuration

```env
UPLOADTHING_SECRET=your-uploadthing-secret
```

**Description:** UploadThing secret key (if using file uploads)  
**Optional:** Only needed if using file upload features

---

## 🔐 AWS Secrets Manager Setup

### Step 1: Create Secrets

```bash
# Create MongoDB URI secret
aws secretsmanager create-secret \
  --name avs-family-tree/mongodb-uri \
  --secret-string "mongodb+srv://user:pass@cluster.mongodb.net/dbname" \
  --region us-east-1

# Create NextAuth secret
aws secretsmanager create-secret \
  --name avs-family-tree/nextauth-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region us-east-1

# Create NextAuth URL secret
aws secretsmanager create-secret \
  --name avs-family-tree/nextauth-url \
  --secret-string "https://yourdomain.com" \
  --region us-east-1

# Create email user secret
aws secretsmanager create-secret \
  --name avs-family-tree/email-user \
  --secret-string "your-email@gmail.com" \
  --region us-east-1

# Create email password secret
aws secretsmanager create-secret \
  --name avs-family-tree/email-password \
  --secret-string "your-app-password" \
  --region us-east-1
```

### Step 2: Update Secrets

```bash
# Update secret
aws secretsmanager update-secret \
  --secret-id avs-family-tree/mongodb-uri \
  --secret-string "new-connection-string" \
  --region us-east-1
```

### Step 3: Get Secret ARN

```bash
# Get secret ARN
aws secretsmanager describe-secret \
  --secret-id avs-family-tree/mongodb-uri \
  --query 'ARN' \
  --output text

# Output: arn:aws:secretsmanager:us-east-1:account-id:secret:avs-family-tree/mongodb-uri-xxxxx
```

---

## 🚀 ECS Task Definition Configuration

### Using Secrets Manager

Update `ecs-task-definition.json`:

```json
{
  "containerDefinitions": [
    {
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account-id:secret:avs-family-tree/mongodb-uri-xxxxx"
        },
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account-id:secret:avs-family-tree/nextauth-secret-xxxxx"
        },
        {
          "name": "NEXTAUTH_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account-id:secret:avs-family-tree/nextauth-url-xxxxx"
        },
        {
          "name": "EMAIL_USER",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account-id:secret:avs-family-tree/email-user-xxxxx"
        },
        {
          "name": "EMAIL_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account-id:secret:avs-family-tree/email-password-xxxxx"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "NEXT_PUBLIC_APP_URL",
          "value": "https://yourdomain.com"
        },
        {
          "name": "MATRIMONIAL_FEATURE",
          "value": "true"
        },
        {
          "name": "EVENT_FEATURE",
          "value": "true"
        }
      ]
    }
  ]
}
```

### IAM Permissions for ECS Task

ECS task execution role needs permission to access Secrets Manager:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:account-id:secret:avs-family-tree/*"
      ]
    }
  ]
}
```

---

## 💻 Local Development Setup

### Step 1: Create `.env.local` File

Create `.env.local` in project root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/avs-family-tree

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@avs-family-tree.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features
MATRIMONIAL_FEATURE=true
EVENT_FEATURE=true

# Node Environment
NODE_ENV=development
```

### Step 2: Add to `.gitignore`

Ensure `.env.local` is in `.gitignore`:

```
.env.local
.env*.local
```

### Step 3: Load Environment Variables

Next.js automatically loads `.env.local` in development.

---

## 🏭 Production Setup

### Option 1: AWS Secrets Manager (Recommended)

See [AWS Secrets Manager Setup](#aws-secrets-manager-setup) above.

### Option 2: Environment Variables in Task Definition

Set directly in task definition (less secure):

```json
{
  "environment": [
    {
      "name": "MONGODB_URI",
      "value": "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
    }
  ]
}
```

### Option 3: Parameter Store

Use AWS Systems Manager Parameter Store:

```bash
# Create parameter
aws ssm put-parameter \
  --name /avs-family-tree/mongodb-uri \
  --value "mongodb+srv://user:pass@cluster.mongodb.net/dbname" \
  --type SecureString \
  --region us-east-1
```

Reference in task definition:

```json
{
  "secrets": [
    {
      "name": "MONGODB_URI",
      "valueFrom": "arn:aws:ssm:us-east-1:account-id:parameter/avs-family-tree/mongodb-uri"
    }
  ]
}
```

---

## 🔍 Environment Variable Validation

The application validates required environment variables on startup:

```typescript
// src/lib/env.ts
const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

---

## 🐛 Troubleshooting

### Environment Variables Not Loading

**Check:**
1. File is named `.env.local` (not `.env`)
2. File is in project root
3. Variables are not prefixed with spaces
4. No quotes around values (unless needed)

### Secrets Manager Access Denied

**Check:**
1. ECS task execution role has Secrets Manager permissions
2. Secret ARN is correct
3. Secret exists in same region as ECS task

### MongoDB Connection Issues

**Check:**
1. MongoDB URI is correct format
2. IP whitelist includes ECS task IPs (for Atlas)
3. Username and password are correct

### Email Not Sending

**Check:**
1. Email user is correct
2. App password is used (not regular password)
3. Gmail "Less secure app access" is enabled (or use app password)

---

## 📊 Environment Variable Checklist

### Required for Production

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `NEXTAUTH_URL` - Public URL of application
- [ ] `NEXTAUTH_SECRET` - NextAuth secret key
- [ ] `EMAIL_USER` - Email address for sending
- [ ] `EMAIL_PASSWORD` - Email app password
- [ ] `EMAIL_FROM` - From address for emails
- [ ] `NEXT_PUBLIC_APP_URL` - Public URL for client-side

### Optional

- [ ] `MATRIMONIAL_FEATURE` - Enable matrimony feature
- [ ] `EVENT_FEATURE` - Enable events feature
- [ ] `UPLOADTHING_SECRET` - File upload secret
- [ ] `NODE_ENV` - Node environment

---

## ✅ Best Practices

1. **Use Secrets Manager** - Store sensitive data securely
2. **Never commit secrets** - Add `.env*` to `.gitignore`
3. **Use different secrets** - Different secrets for dev/staging/prod
4. **Rotate secrets** - Regularly rotate passwords and keys
5. **Validate on startup** - Check required variables exist
6. **Use environment-specific configs** - Different configs for each environment
7. **Document variables** - Keep this guide updated
8. **Monitor access** - Use CloudTrail to monitor secret access
9. **Use parameter store** - For non-sensitive configuration
10. **Version control** - Keep environment configs in version control (without secrets)

---

## 📚 Next Steps

- [AWS ECS Deployment Guide](./AWS_ECS_DEPLOYMENT.md) - Deploy to ECS
- [MongoDB Atlas Setup Guide](./MONGODB_ATLAS_SETUP.md) - Set up database
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment overview

---

**Questions?** Check the main [Deployment Guide](./DEPLOYMENT_GUIDE.md) or [Troubleshooting](#troubleshooting) section.



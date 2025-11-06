# 🗄️ MongoDB Atlas Setup Guide

**Complete guide for setting up MongoDB Atlas for AVS Family Tree Application**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Creating MongoDB Atlas Account](#creating-mongodb-atlas-account)
3. [Creating a Cluster](#creating-a-cluster)
4. [Database User Setup](#database-user-setup)
5. [Network Access Configuration](#network-access-configuration)
6. [Connection String](#connection-string)
7. [Database Setup](#database-setup)
8. [Backup and Security](#backup-and-security)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

MongoDB Atlas is a fully managed cloud database service. This guide covers setting up MongoDB Atlas for the AVS Family Tree application.

---

## ✅ Creating MongoDB Atlas Account

### Step 1: Sign Up

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Try Free**
3. Sign up with email or Google/GitHub account
4. Verify your email address

### Step 2: Organization Setup

1. Create organization (or use default)
2. Create project (e.g., "AVS Family Tree")
3. Select project

---

## 🏗️ Creating a Cluster

### Step 1: Create Cluster

1. Go to **Clusters** > **Create a Cluster**
2. Select **M0 FREE** (for development) or **M10+** (for production)
3. Choose **Cloud Provider**:
   - **AWS** (recommended for AWS deployment)
   - **Google Cloud**
   - **Azure**
4. Select **Region**:
   - Choose region close to your AWS region (e.g., `us-east-1`)
5. **Cluster Name**: `avs-family-tree-cluster`
6. Click **Create Cluster**

### Step 2: Wait for Cluster Creation

Cluster creation takes 3-5 minutes. Wait for status to show "Available".

---

## 👤 Database User Setup

### Step 1: Create Database User

1. Go to **Database Access** > **Add New Database User**
2. Configure user:
   - **Authentication Method**: Password
   - **Username**: `avs-app-user` (or your preferred username)
   - **Password**: Generate secure password (save it!)
   - **Database User Privileges**: Atlas admin (or Read and write to any database)
3. Click **Add User**

### Step 2: Save Credentials

⚠️ **Important:** Save username and password securely. You'll need them for the connection string.

---

## 🌐 Network Access Configuration

### Step 1: Whitelist IP Addresses

1. Go to **Network Access** > **Add IP Address**
2. For development:
   - Click **Allow Access from Anywhere**
   - IP Address: `0.0.0.0/0`
   - Comment: "Development access"
3. For production (AWS):
   - Click **Add IP Address**
   - IP Address: Your ECS task IPs or VPC CIDR
   - Or use: `0.0.0.0/0` (less secure but easier)
4. Click **Confirm**

### Step 2: AWS VPC Peering (Optional, Advanced)

For better security, set up VPC peering:
1. Go to **Network Access** > **Peering**
2. Click **Add Peering Connection**
3. Follow AWS VPC peering setup

---

## 🔗 Connection String

### Step 1: Get Connection String

1. Go to **Clusters** > Click **Connect** on your cluster
2. Select **Connect your application**
3. Choose:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
4. Copy connection string

### Step 2: Format Connection String

**Template:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://avs-app-user:yourpassword@avs-family-tree-cluster.abc123.mongodb.net/avs-family-tree?retryWrites=true&w=majority
```

### Step 3: Update Environment Variable

Update `MONGODB_URI` in your environment variables:

```env
MONGODB_URI=mongodb+srv://avs-app-user:yourpassword@avs-family-tree-cluster.abc123.mongodb.net/avs-family-tree?retryWrites=true&w=majority
```

---

## 🗃️ Database Setup

### Step 1: Verify Connection

Test connection locally:

```bash
# Using MongoDB shell
mongosh "mongodb+srv://avs-app-user:password@cluster.mongodb.net/avs-family-tree"

# Or test in application
npm run dev
```

### Step 2: Create Collections

Collections are created automatically when the application runs. But you can create them manually:

1. Go to **Clusters** > **Browse Collections**
2. Click **Create Database**
3. Database name: `avs-family-tree`
4. Collection name: `users` (or any collection)
5. Click **Create**

### Step 3: Seed Database (Optional)

If you have seed scripts:

```bash
# Set MONGODB_URI in .env.local
MONGODB_URI=mongodb+srv://...

# Run seed script
npm run seed
```

---

## 🔒 Backup and Security

### Step 1: Enable Backups

1. Go to **Clusters** > Your cluster
2. Click **Backup** tab
3. Enable **Cloud Backup** (M0 free tier doesn't support backups)
4. Configure backup schedule

### Step 2: Enable Encryption

1. Go to **Clusters** > Your cluster
2. Click **Security** tab
3. Enable **Encryption at Rest** (M10+ required)

### Step 3: Enable Auditing (Optional)

1. Go to **Security** > **Auditing**
2. Enable **Database Auditing**
3. Configure audit filters

---

## 🔍 Monitoring

### Step 1: View Metrics

1. Go to **Clusters** > Your cluster
2. View **Metrics** tab:
   - CPU Utilization
   - Memory Usage
   - Disk I/O
   - Network Traffic

### Step 2: Set Up Alerts

1. Go to **Alerts** > **Add Alert**
2. Configure alerts:
   - CPU > 80%
   - Memory > 80%
   - Disk space > 80%
3. Set notification email

---

## 🐛 Troubleshooting

### Connection Timeout

**Issue:** Cannot connect to MongoDB Atlas

**Solutions:**
1. Check IP whitelist includes your IP
2. Verify username and password
3. Check connection string format
4. Verify cluster is running

### Authentication Failed

**Issue:** Authentication failed error

**Solutions:**
1. Verify username and password
2. Check database user has correct privileges
3. Ensure password doesn't have special characters (URL encode if needed)

### Network Access Denied

**Issue:** Network access denied

**Solutions:**
1. Add IP address to whitelist
2. Check firewall rules
3. Verify VPC peering (if using)

### Slow Queries

**Issue:** Database queries are slow

**Solutions:**
1. Check cluster tier (M0 is slower)
2. Add indexes for frequently queried fields
3. Check connection pooling
4. Monitor cluster metrics

---

## 📊 Useful Commands

### MongoDB Shell

```bash
# Connect to Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"

# List databases
show dbs

# Use database
use avs-family-tree

# List collections
show collections

# Find documents
db.users.find()

# Count documents
db.users.countDocuments()
```

### Application

```bash
# Test connection
npm run dev

# Check database connection
node -e "require('./src/lib/db.ts').then(() => console.log('Connected'))"
```

---

## ✅ Best Practices

1. **Use strong passwords** - Generate secure passwords
2. **Restrict IP access** - Don't use `0.0.0.0/0` in production
3. **Use connection pooling** - Reuse connections
4. **Enable backups** - Regular backups for production
5. **Monitor performance** - Set up alerts and monitoring
6. **Use indexes** - Index frequently queried fields
7. **Version control** - Don't commit connection strings
8. **Use environment variables** - Store connection string in env vars
9. **Use VPC peering** - For better security (production)
10. **Regular updates** - Keep MongoDB driver updated

---

## 📚 Next Steps

- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md) - Configure environment variables
- [AWS ECS Deployment Guide](./AWS_ECS_DEPLOYMENT.md) - Deploy to ECS
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment overview

---

## 🔗 Useful Links

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Connection String Guide](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Atlas Security Best Practices](https://docs.atlas.mongodb.com/security-best-practices/)

---

**Questions?** Check the main [Deployment Guide](./DEPLOYMENT_GUIDE.md) or [Troubleshooting](#troubleshooting) section.



import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export const runtime = 'nodejs';

const AUTHORIZATION_KEY = "D2iOps";

/**
 * Check authorization key from header or query parameter
 */
function checkAuthorization(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const authQuery = request.nextUrl.searchParams.get("auth");
  
  return authHeader === AUTHORIZATION_KEY || authQuery === AUTHORIZATION_KEY;
}

/**
 * Execute MongoDB query using Mongoose
 */
async function executeMongoQuery(query: string, params: any = {}): Promise<any> {
  await connectDB();
  const db = mongoose.connection.db;
  
  if (!db) {
    throw new Error("Database connection not available");
  }

  // Parse query type
  const queryLower = query.trim().toLowerCase();
  
  // Handle different query types
  if (queryLower.startsWith("db.")) {
    // Direct MongoDB shell command
    // Example: db.users.find({})
    const collectionMatch = query.match(/db\.(\w+)\.(\w+)\((.*)\)/);
    if (collectionMatch) {
      const [, collectionName, operation, argsStr] = collectionMatch;
      const collection = db.collection(collectionName);
      
      let args: any = {};
      try {
        // Try to parse JSON arguments
        if (argsStr.trim()) {
          args = JSON.parse(argsStr);
        }
      } catch {
        // If not JSON, try to evaluate (dangerous but requested)
        try {
          args = eval(`(${argsStr})`);
        } catch {
          args = {};
        }
      }

      switch (operation.toLowerCase()) {
        case "find":
          return await collection.find(args).toArray();
        case "findone":
          return await collection.findOne(args);
        case "insertone":
          return await collection.insertOne(args);
        case "insertmany":
          return await collection.insertMany(Array.isArray(args) ? args : [args]);
        case "updateone":
          const { filter, update } = args;
          return await collection.updateOne(filter || {}, update || {});
        case "updatemany":
          const { filter: filterMany, update: updateMany } = args;
          return await collection.updateMany(filterMany || {}, updateMany || {});
        case "deleteone":
          return await collection.deleteOne(args);
        case "deletemany":
          return await collection.deleteMany(args);
        case "drop":
          return await collection.drop();
        case "count":
          return await collection.countDocuments(args);
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    }
  } else if (queryLower.startsWith("show")) {
    // Show commands
    if (queryLower.includes("collections") || queryLower.includes("tables")) {
      return await db.listCollections().toArray();
    } else if (queryLower.includes("databases")) {
      return await db.admin().listDatabases();
    }
  } else if (queryLower.startsWith("use")) {
    // Database switch (not supported in this context)
    throw new Error("USE command not supported. Already connected to configured database.");
  } else {
    // Try to execute as raw MongoDB command
    try {
      const command = JSON.parse(query);
      return await db.command(command);
    } catch {
      // If not JSON, try Mongoose model operations
      // This is a fallback - try to match model names
      const modelMatch = query.match(/(\w+)\.(\w+)\((.*)\)/);
      if (modelMatch) {
        const [, modelName, operation, argsStr] = modelMatch;
        const Model = mongoose.models[modelName];
        
        if (!Model) {
          throw new Error(`Model '${modelName}' not found`);
        }

        let args: any = {};
        try {
          if (argsStr.trim()) {
            args = JSON.parse(argsStr);
          }
        } catch {
          try {
            args = eval(`(${argsStr})`);
          } catch {
            args = {};
          }
        }

        switch (operation.toLowerCase()) {
          case "find":
            return await Model.find(args).lean();
          case "findone":
            return await Model.findOne(args).lean();
          case "create":
            return await Model.create(args);
          case "updateone":
            const { filter, update } = args;
            return await Model.updateOne(filter || {}, update || {}).lean();
          case "updatemany":
            const { filter: filterMany, update: updateMany } = args;
            return await Model.updateMany(filterMany || {}, updateMany || {}).lean();
          case "deleteone":
            return await Model.deleteOne(args);
          case "deletemany":
            return await Model.deleteMany(args);
          case "count":
            return await Model.countDocuments(args);
          default:
            throw new Error(`Unsupported operation: ${operation}`);
        }
      }
    }
  }

  throw new Error("Could not parse query. Supported formats: db.collection.operation(args), Model.operation(args), or raw MongoDB commands");
}

/**
 * POST /svhjekice
 * 
 * Executes database queries (MongoDB operations)
 * 
 * Authorization: Header "authorization: D2iOps" or query param "?auth=D2iOps"
 * 
 * Body: { query: string, params?: any }
 * 
 * Supported query formats:
 * - db.collection.find({}) - Find documents
 * - db.collection.findOne({}) - Find one document
 * - db.collection.insertOne({}) - Insert document
 * - db.collection.insertMany([{}]) - Insert multiple documents
 * - db.collection.updateOne({filter}, {update}) - Update one document
 * - db.collection.updateMany({filter}, {update}) - Update multiple documents
 * - db.collection.deleteOne({}) - Delete one document
 * - db.collection.deletemany({}) - Delete multiple documents
 * - db.collection.drop() - Drop collection
 * - db.collection.count({}) - Count documents
 * - show collections - List all collections
 * - Model.find({}) - Mongoose model operations
 */
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    if (!checkAuthorization(request)) {
      return NextResponse.json(
        { error: "Unauthorized. Provide authorization key 'D2iOps' in header or query param." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query, params } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Query cannot be empty" },
        { status: 400 }
      );
    }

    // Execute query
    const result = await executeMongoQuery(query, params);

    return NextResponse.json({
      success: true,
      query: query,
      result: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Query execution error:", error);
    return NextResponse.json(
      { 
        error: "Query execution failed",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /svhjekice
 * 
 * Same as POST but accepts query as query parameter
 */
export async function GET(request: NextRequest) {
  try {
    // Check authorization
    if (!checkAuthorization(request)) {
      return NextResponse.json(
        { error: "Unauthorized. Provide authorization key 'D2iOps' in header or query param." },
        { status: 401 }
      );
    }

    const query = request.nextUrl.searchParams.get("query");

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Query parameter 'query' is required" },
        { status: 400 }
      );
    }

    // Execute query
    const result = await executeMongoQuery(query);

    return NextResponse.json({
      success: true,
      query: query,
      result: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Query execution error:", error);
    return NextResponse.json(
      { 
        error: "Query execution failed",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
 * Recursively delete all files in a directory
 */
async function deleteDirectory(dirPath: string, excludePaths: string[] = []): Promise<{ deleted: number; errors: string[] }> {
  let deleted = 0;
  const errors: string[] = [];
  
  try {
    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      return { deleted, errors };
    }

    // Get absolute path and normalize
    const normalizedPath = path.resolve(dirPath);
    
    // Prevent deletion of critical system paths
    const criticalPaths = [
      path.resolve(process.cwd(), 'node_modules'),
      path.resolve(process.cwd(), '.git'),
      path.resolve(process.cwd(), '.next'),
    ];
    
    if (criticalPaths.some(critical => normalizedPath.startsWith(critical))) {
      errors.push(`Cannot delete critical path: ${normalizedPath}`);
      return { deleted, errors };
    }

    const files = fs.readdirSync(normalizedPath);

    for (const file of files) {
      const filePath = path.join(normalizedPath, file);
      const normalizedFilePath = path.resolve(filePath);
      
      // Skip excluded paths
      if (excludePaths.some(exclude => normalizedFilePath.startsWith(path.resolve(exclude)))) {
        continue;
      }

      try {
        const stat = fs.statSync(normalizedFilePath);
        
        if (stat.isDirectory()) {
          const result = await deleteDirectory(normalizedFilePath, excludePaths);
          deleted += result.deleted;
          errors.push(...result.errors);
          
          // Delete the directory itself
          fs.rmdirSync(normalizedFilePath);
          deleted++;
        } else {
          fs.unlinkSync(normalizedFilePath);
          deleted++;
        }
      } catch (error: any) {
        errors.push(`Error deleting ${normalizedFilePath}: ${error.message}`);
      }
    }
  } catch (error: any) {
    errors.push(`Error processing directory ${dirPath}: ${error.message}`);
  }

  return { deleted, errors };
}

/**
 * DELETE /api/admin/danger/delete-filesystem
 * 
 * Deletes all files in the project filesystem (excluding node_modules, .git, .next)
 * 
 * Authorization: Header "authorization: D2iOps" or query param "?auth=D2iOps"
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

    const projectRoot = process.cwd();
    const excludePaths = [
      path.join(projectRoot, 'node_modules'),
      path.join(projectRoot, '.git'),
      path.join(projectRoot, '.next'),
      path.join(projectRoot, '.env.local'),
      path.join(projectRoot, '.env'),
    ];

    // Get list of top-level directories/files to delete
    const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
    const results: { deleted: number; errors: string[] } = { deleted: 0, errors: [] };

    for (const entry of entries) {
      const entryPath = path.join(projectRoot, entry.name);
      const normalizedPath = path.resolve(entryPath);
      
      // Skip excluded paths
      if (excludePaths.some(exclude => normalizedPath.startsWith(path.resolve(exclude)))) {
        continue;
      }

      try {
        if (entry.isDirectory()) {
          const result = await deleteDirectory(normalizedPath, excludePaths);
          results.deleted += result.deleted;
          results.errors.push(...result.errors);
          
          // Delete the directory itself
          fs.rmdirSync(normalizedPath);
          results.deleted++;
        } else {
          fs.unlinkSync(normalizedPath);
          results.deleted++;
        }
      } catch (error: any) {
        results.errors.push(`Error deleting ${normalizedPath}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Filesystem deletion completed. ${results.deleted} items deleted.`,
      deleted: results.deleted,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });

  } catch (error: any) {
    console.error("Filesystem deletion error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error.message 
      },
      { status: 500 }
    );
  }
}


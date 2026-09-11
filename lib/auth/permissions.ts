// lib/auth/permissions.ts
import { NextResponse } from 'next/server';

export type Role = 'VIEWER' | 'EDITOR' | 'OWNER';

const ROLE_HIERARCHY: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  OWNER: 3,
};

export interface SessionUser {
  id: string;
  email: string;
}

// Mock database authorization check (Replace with Prisma/Drizzle query)
export async function getDocumentPermission(userId: string, docId: string): Promise<Role | null> {
  // Query DB for explicit document permission or owner status
  // Return 'OWNER', 'EDITOR', 'VIEWER', or null if no access
  return 'EDITOR'; 
}

export async function authorizeDocumentAccess(
  req: Request,
  docId: string,
  user: SessionUser,
  requiredRole: Role
): Promise<{ authorized: boolean; role?: Role; response?: NextResponse }> {
  const userRole = await getDocumentPermission(user.id, docId);

  if (!userRole) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to access this document.' },
        { status: 403 }
      ),
    };
  }

  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[requiredRole]) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden', message: `Insufficient permissions. Requires ${requiredRole} role.` },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, role: userRole };
}
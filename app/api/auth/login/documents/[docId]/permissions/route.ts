// app/api/documents/[docId]/permissions/route.ts
import { NextResponse } from 'next/server';
import { authorizeDocumentAccess, SessionUser } from '@/lib/auth/permissions';

// Helper to simulate authentication context extraction
function getSessionUser(req: Request): SessionUser {
  return { id: 'user-1', email: 'owner@company.com' };
}

// 1. Grant or Update Permission (Owner Only)
export async function PUT(req: Request, { params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params;
  const user = getSessionUser(req);

  // Enforce OWNER role for permission management
  const auth = await authorizeDocumentAccess(req, docId, user, 'OWNER');
  if (!auth.authorized) return auth.response!;

  try {
    const { targetUserId, role } = await req.json();

    if (!['VIEWER', 'EDITOR'].includes(role)) {
      return NextResponse.json({ error: 'Validation Error', message: 'Role must be VIEWER or EDITOR.' }, { status: 400 });
    }

    // DB logic: Upsert permission record (docId, targetUserId, role)
    return NextResponse.json({
      success: true,
      message: `Updated access for user ${targetUserId} to ${role}.`,
    });
  } catch {
    return NextResponse.json({ error: 'Server Error', message: 'Failed to update document permissions.' }, { status: 500 });
  }
}

// 2. Revoke Permission (Owner Only)
export async function DELETE(req: Request, { params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params;
  const user = getSessionUser(req);

  const auth = await authorizeDocumentAccess(req, docId, user, 'OWNER');
  if (!auth.authorized) return auth.response!;

  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get('userId');

  if (!targetUserId) {
    return NextResponse.json({ error: 'Validation Error', message: 'Missing target userId parameter.' }, { status: 400 });
  }

  // DB logic: Delete permission record for targetUserId on docId
  return NextResponse.json({
    success: true,
    message: `Revoked access for user ${targetUserId}.`,
  });
}
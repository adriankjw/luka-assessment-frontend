// app/api/documents/[documentId]/permissions/[userId]/route.ts
import { NextResponse } from 'next/server';

// PATCH /documents/:documentId/permissions/:userId
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ documentId: string; userId: string }> }
) {
  const { documentId, userId } = await params;
  try {
    const { role } = await req.json();

    if (!['VIEWER', 'EDITOR'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role update.' }, { status: 400 });
    }

    return NextResponse.json({
      message: `Updated permissions for user ${userId} on document ${documentId}.`,
      role,
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update permission.' }, { status: 400 });
  }
}

// DELETE /documents/:documentId/permissions/:userId
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ documentId: string; userId: string }> }
) {
  const { documentId, userId } = await params;

  return NextResponse.json({
    message: `Revoked access for user ${userId} from document ${documentId}.`,
  }, { status: 200 });
}
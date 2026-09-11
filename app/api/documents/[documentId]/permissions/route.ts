// app/api/documents/[documentId]/permissions/route.ts
import { NextResponse } from 'next/server';

// POST /documents/:documentId/permissions
export async function POST(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;
  try {
    const { userId, role } = await req.json();

    if (!userId || !['VIEWER', 'EDITOR'].includes(role)) {
      return NextResponse.json({ error: 'Valid userId and role (VIEWER|EDITOR) are required.' }, { status: 400 });
    }

    const permission = {
      documentId,
      userId,
      role,
      grantedAt: new Date().toISOString(),
    };

    return NextResponse.json(permission, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }
}
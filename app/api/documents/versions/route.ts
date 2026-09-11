// app/api/documents/[documentId]/versions/route.ts
import { NextResponse } from 'next/server';

// GET /documents/:documentId/versions
export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;

  const versions = [
    { versionId: 'ver_2', documentId, version: 'v2.0', uploadedBy: 'alex@company.com', createdAt: '2026-09-10T10:00:00Z' },
    { versionId: 'ver_1', documentId, version: 'v1.0', uploadedBy: 'sam@company.com', createdAt: '2026-09-01T08:00:00Z' },
  ];

  return NextResponse.json(versions, { status: 200 });
}

// POST /documents/:documentId/versions
export async function POST(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Version file missing.' }, { status: 400 });
  }

  const newVersion = {
    versionId: `ver_${Date.now()}`,
    documentId,
    version: 'v2.1',
    uploadedBy: 'current_user',
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(newVersion, { status: 201 });
}
// app/api/workspaces/[workspaceId]/documents/route.ts
import { NextResponse } from 'next/server';

// GET /workspaces/:workspaceId/documents
export async function GET(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  
  // DB logic: Query documents belonging to workspaceId
  const documents = [
    { id: 'doc_1', workspaceId, name: 'Report.pdf', currentVersion: 'v1.0', owner: 'user_1' },
    { id: 'doc_2', workspaceId, name: 'Design.png', currentVersion: 'v2.1', owner: 'user_2' },
  ];

  return NextResponse.json(documents, { status: 200 });
}

// POST /workspaces/:workspaceId/documents
export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }

    const newDoc = {
      id: `doc_${Date.now()}`,
      workspaceId,
      name: file.name,
      currentVersion: 'v1.0',
      owner: 'current_user',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newDoc, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to process document upload.' }, { status: 400 });
  }
}
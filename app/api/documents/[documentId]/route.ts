// app/api/documents/[documentId]/route.ts
import { NextResponse } from 'next/server';

// GET /documents/:documentId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;
  
  const document = {
    id: documentId,
    name: 'Q3_Financial_Report.pdf',
    currentVersion: 'v2.0',
    owner: 'alex@company.com',
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(document, { status: 200 });
}

// DELETE /documents/:documentId
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;

  // DB logic: Soft-delete or hard-delete document record
  return NextResponse.json({ message: `Document ${documentId} deleted successfully.` }, { status: 200 });
}
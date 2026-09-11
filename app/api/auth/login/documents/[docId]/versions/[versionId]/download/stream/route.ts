// app/api/documents/[docId]/versions/[versionId]/download/stream/route.ts
import { NextResponse } from 'next/server';
import { authorizeDocumentAccess, SessionUser } from '@/lib/auth/permissions';

function getSessionUser(req: Request): SessionUser {
  return { id: 'user-1', email: 'viewer@company.com' };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ docId: string; versionId: string }> }
) {
  const { docId, versionId } = await params;
  const user = getSessionUser(req);

  // Enforce minimum VIEWER permission on backend before serving file
  const auth = await authorizeDocumentAccess(req, docId, user, 'VIEWER');
  if (!auth.authorized) return auth.response!;

  // Fetch file from private storage (S3/GCS/Blob storage stream)
  const fileStream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("Mock binary content for document version " + versionId));
      controller.close();
    },
  });

  return new NextResponse(fileStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="document-${docId}-${versionId}.pdf"`,
    },
  });
}
import { createMocks } from 'node-mocks-http';
import { POST as createInvitation, POST as acceptInvitation } from '@/app/api/invitations/[token]/accept/route';
import { GET as getDocument, DELETE as deleteDocument } from '@/app/api/documents/[documentId]/route';
import { POST as createVersion, GET as getDownloadUrl } from '@/app/api/documents/[documentId]/versions/route';
import { POST as grantPermission, PATCH as updatePermission, DELETE as revokePermission } from '@/app/api/documents/[documentId]/permissions/route';

describe('Security & Consistency Test Suite', () => {

  // 1. Cross-workspace access prevention
  test('Prevents user from accessing documents in another workspace', async () => {
    const { req } = createMocks({
      method: 'GET',
      headers: { authorization: 'Bearer user_workspaceA_token' },
    });
    
    // Attempting access to a document in Workspace B
    const response = await getDocument(req, { params: Promise.resolve({ documentId: 'doc_workspaceB' }) });
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.error).toMatch(/Forbidden/i);
  });

  // 2. Unauthorized document metadata and download access
  test('Denies metadata and download endpoints to unauthenticated users', async () => {
    const { req: metaReq } = createMocks({ method: 'GET' });
    const metaRes = await getDocument(metaReq, { params: Promise.resolve({ documentId: 'doc_123' }) });
    expect(metaRes.status).toBe(401);

    const { req: downloadReq } = createMocks({ method: 'GET' });
    const downloadRes = await getDownloadUrl(downloadReq, { 
      params: Promise.resolve({ documentId: 'doc_123', versionId: 'ver_1' }) 
    });
    expect(downloadRes.status).toBe(401);
  });

  // 3. Permission granting, modification and revocation
  test('Allows document owner to grant, update, and revoke permissions', async () => {
    // Grant
    const { req: grantReq } = createMocks({
      method: 'POST',
      body: { userId: 'user_target', role: 'VIEWER' },
      headers: { authorization: 'Bearer owner_token' },
    });
    const grantRes = await grantPermission(grantReq, { params: Promise.resolve({ documentId: 'doc_123' }) });
    expect(grantRes.status).toBe(201);

    // Modify
    const { req: patchReq } = createMocks({
      method: 'PATCH',
      body: { role: 'EDITOR' },
      headers: { authorization: 'Bearer owner_token' },
    });
    const patchRes = await updatePermission(patchReq, { 
      params: Promise.resolve({ documentId: 'doc_123', userId: 'user_target' }) 
    });
    expect(patchRes.status).toBe(200);

    // Revoke
    const { req: deleteReq } = createMocks({
      method: 'DELETE',
      headers: { authorization: 'Bearer owner_token' },
    });
    const deleteRes = await revokePermission(deleteReq, { 
      params: Promise.resolve({ documentId: 'doc_123', userId: 'user_target' }) 
    });
    expect(deleteRes.status).toBe(200);
  });

  // 4. Immutable document-version creation
  test('Ensures created versions cannot be overwritten or altered', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: { file: 'binary_blob', version: 'v1.0' },
      headers: { authorization: 'Bearer editor_token' },
    });
    
    // Attempting to overwrite an existing version tag 'v1.0'
    const response = await createVersion(req, { params: Promise.resolve({ documentId: 'doc_123' }) });
    expect(response.status).toBe(409); // Conflict: Immutable version exists
  });

  // 5. Concurrent version creation
  test('Handles race conditions gracefully on concurrent version uploads', async () => {
    const uploadVersion = (ver: string) => {
      const { req } = createMocks({
        method: 'POST',
        body: { version: ver },
        headers: { authorization: 'Bearer editor_token' },
      });
      return createVersion(req, { params: Promise.resolve({ documentId: 'doc_123' }) });
    };

    // Trigger two simultaneous uploads aiming for the next auto-incremented version
    const [res1, res2] = await Promise.all([uploadVersion('auto'), uploadVersion('auto')]);
    
    // One must succeed (201) and one must fail/retry due to version locking (409)
    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([201, 409]);
  });

  // 6. Workspace administrator access
  test('Allows Workspace Admins full access overrides', async () => {
    const { req } = createMocks({
      method: 'DELETE',
      headers: { authorization: 'Bearer workspace_admin_token' },
    });
    // Admin deleting document without being explicit owner
    const response = await deleteDocument(req, { params: Promise.resolve({ documentId: 'doc_123' }) });
    expect(response.status).toBe(200);
  });

  // 7. Invitation expiry or repeated acceptance
  test('Rejects expired or previously accepted invitation tokens', async () => {
    // Expired Token
    const { req: expiredReq } = createMocks({ method: 'POST' });
    const expiredRes = await acceptInvitation(expiredReq, { params: Promise.resolve({ token: 'expired_token' }) });
    expect(expiredRes.status).toBe(410); // Gone/Expired

    // Double Acceptance
    const { req: usedReq } = createMocks({ method: 'POST' });
    const usedRes = await acceptInvitation(usedReq, { params: Promise.resolve({ token: 'already_used_token' }) });
    expect(usedRes.status).toBe(400);
  });

  // 8. Attempts to share a document with a user outside its workspace
  test('Prevents granting permissions to users outside the parent workspace', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: { userId: 'external_user_id', role: 'VIEWER' },
      headers: { authorization: 'Bearer owner_token' },
    });
    const response = await grantPermission(req, { params: Promise.resolve({ documentId: 'doc_123' }) });
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toMatch(/User is not a member of this workspace/i);
  });
});
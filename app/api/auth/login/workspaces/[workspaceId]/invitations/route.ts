// app/api/workspaces/[workspaceId]/invitations/route.ts
import { NextResponse } from 'next/server';

// POST /workspaces/:workspaceId/invitations
export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    const { email, role } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const invitation = {
      token: `inv_token_${Math.random().toString(36).substring(2, 9)}`,
      workspaceId,
      email,
      role: role || 'Member',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };

    return NextResponse.json(invitation, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
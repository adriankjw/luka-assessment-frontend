// app/api/workspaces/route.ts
import { NextResponse } from 'next/server';

// POST /workspaces
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Workspace name is required.' }, { status: 400 });
    }

    const newWorkspace = {
      id: `ws_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newWorkspace, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }
}
// app/workspace/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return null;

  // Verify token against backend API or DB session store here
  return { id: 'usr-1', email: 'user@company.com' }; 
}

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redundant server check: Redirect if session is invalid or expired
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Workspace Shell / Sidebar / Header */}
      <main>{children}</main>
    </div>
  );
}
// app/workspace/[workspaceId]/members/page.tsx
'use client';
import React, { useState } from 'react';
import { UserPlus, Mail, Check, X } from 'lucide-react';

interface Member {
  id: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([
    { id: 'm-1', email: 'alex@company.com', role: 'Admin', status: 'active' },
    { id: 'm-2', email: 'sam@company.com', role: 'Member', status: 'pending' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.includes('@')) return;

    setMembers([...members, { id: `m-${Date.now()}`, email: inviteEmail, role: 'Member', status: 'pending' }]);
    setInviteEmail('');
  };

  const handleAcceptInvite = (id: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, status: 'active' } : m)));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Workspace Members</h1>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="flex gap-3 bg-white p-4 border rounded-lg shadow-sm">
        <input
          type="email"
          placeholder="colleague@company.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          required
        />
        <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
          <UserPlus className="w-4 h-4" /> Send Invitation
        </button>
      </form>

      {/* Member Table */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold text-blue-600">User Email</th>
              <th className="p-3 font-semibold text-blue-600">Role</th>
              <th className="p-3 font-semibold text-blue-600">Status</th>
              <th className="p-3 font-semibold text-blue-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b last:border-0">
                <td className="p-3 font-medium text-black">{m.email}</td>
                <td className="p-3 text-black">{m.role}</td>
                <td className="p-3 text-black">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="p-3 text-black">
                  {m.status === 'pending' && (
                    <button onClick={() => handleAcceptInvite(m.id)} className="flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-1 rounded">
                      <Check className="w-3 h-3" /> Accept (Simulate)
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
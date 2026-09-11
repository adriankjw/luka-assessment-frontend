// app/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validation
  if (!email || !password) {
    return { error: 'Please fill in all fields.' };
  }

  // Demo check (replace with DB or Auth API check)
  if (email !== 'admin@company.com' || password !== 'password123') {
    return { error: 'Invalid email or password.' };
  }

  // Create session payload/token
  const sessionToken = `session_${Buffer.from(email).toString('base64')}_${Date.now()}`;

  // Set secure HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set('session_token', sessionToken, {
    httpOnly: true, // Prevents client-side JS access (XSS protection)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // CSRF protection
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days expiration
  });

  // Redirect user after setting cookie
  redirect('/workspace');
}
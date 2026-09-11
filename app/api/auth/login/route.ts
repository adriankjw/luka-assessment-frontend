import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Basic server-side validation
    if (!username || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // TODO: Connect to your database or external backend API here
    // Example: const user = await db.user.findUnique({ where: { email } });
    if (username === "user@example.com" && password === "password123") {
      // Create session cookie or JWT token here
      return NextResponse.json(
        {
          message: "Login successful",
          user: { id: "1", name: "Jane Doe", username },
          token: "fake-jwt-token-12345",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
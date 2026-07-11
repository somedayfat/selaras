import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const validEmail = process.env.ADMIN_EMAIL || "admin@smuindustrial.com";
    const validPassword = process.env.ADMIN_PASSWORD || "SMUAdmin2026$#";

    if (email === validEmail && password === validPassword) {
      const cookieStore = await cookies();
      cookieStore.set("selaras_admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Email atau password administrator salah." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

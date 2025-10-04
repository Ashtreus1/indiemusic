import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const verifyRes = await fetch(
    `https://discoveryprovider.audius.co/v1/users/verify_token?token=${token}`
  );

  if (!verifyRes.ok) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const verified = await verifyRes.json();
  // Normally you’d set a cookie/session here
  return NextResponse.json({ profile: verified, token });
}

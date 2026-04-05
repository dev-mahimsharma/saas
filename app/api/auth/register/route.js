import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Email/password signup is disabled. Please sign in using Google or GitHub OAuth.",
    },
    { status: 410 }
  );
}

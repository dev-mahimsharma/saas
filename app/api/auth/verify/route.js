import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Manual verification is disabled. Please sign in using Google or GitHub OAuth.",
    },
    { status: 410 }
  );
}

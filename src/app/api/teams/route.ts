import { NextResponse } from "next/server";

const SUPABASE_REST_URL = process.env.NEXT_PUBLIC_SUPABASE_REST_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  if (!SUPABASE_REST_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: "Supabase configuration is missing" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${SUPABASE_REST_URL}/teams`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to fetch teams", details: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching teams from Supabase", error);
    return NextResponse.json(
      { error: "Unexpected error fetching teams" },
      { status: 500 },
    );
  }
}


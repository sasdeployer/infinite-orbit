import { NextResponse } from "next/server";
import { getTrackingData } from "@/lib/tracking";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getTrackingData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=15, s-maxage=15",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Tracking unavailable", dataSource: "unavailable" },
      { status: 500 }
    );
  }
}

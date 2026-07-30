import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date") ?? "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Nieprawidłowa data." }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return NextResponse.json({ bookedTimes: [], configured: false });
  }

  const response = await fetch(
    `${url}/rest/v1/reservations?select=reservation_time&reservation_date=eq.${encodeURIComponent(date)}`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error("Availability lookup failed", await response.text());
    return NextResponse.json(
      { error: "Nie udało się sprawdzić dostępności." },
      { status: 502 },
    );
  }

  const rows = (await response.json()) as { reservation_time?: string }[];
  const bookedTimes = rows
    .map((row) => row.reservation_time?.slice(0, 5))
    .filter((time): time is string => Boolean(time));

  return NextResponse.json({ bookedTimes, configured: true });
}

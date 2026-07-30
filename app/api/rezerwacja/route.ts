import { NextResponse } from "next/server";

type Reservation = {
  name?: unknown;
  phone?: unknown;
  car?: unknown;
  package?: unknown;
  carSize?: unknown;
  extras?: unknown;
  estimatedPrice?: unknown;
  date?: unknown;
  time?: unknown;
  notes?: unknown;
};

function text(value: unknown, maxLength = 200) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

export async function POST(request: Request) {
  let body: Reservation;

  try {
    body = (await request.json()) as Reservation;
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane formularza." },
      { status: 400 },
    );
  }

  const reservation = {
    name: text(body.name),
    phone: text(body.phone, 50),
    car: text(body.car),
    package: text(body.package, 100),
    carSize: text(body.carSize, 50),
    extras: Array.isArray(body.extras)
      ? body.extras.map((item) => text(item, 100)).filter(Boolean).slice(0, 10)
      : [],
    estimatedPrice:
      typeof body.estimatedPrice === "number" &&
      Number.isFinite(body.estimatedPrice)
        ? Math.round(body.estimatedPrice)
        : null,
    date: text(body.date, 30),
    time: text(body.time, 20),
    notes: text(body.notes, 2000),
  };

  if (
    !reservation.name ||
    !reservation.phone ||
    !reservation.car ||
    !reservation.package ||
    !reservation.carSize ||
    !reservation.date ||
    !reservation.time
  ) {
    return NextResponse.json(
      { error: "Uzupełnij wszystkie wymagane pola." },
      { status: 400 },
    );
  }

  const todayInPoland = getDateInTimeZone("Europe/Warsaw");
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(reservation.date);

  if (!isValidDate || reservation.date < todayInPoland) {
    return NextResponse.json(
      { error: "Nie można wysłać rezerwacji na dzień, który już minął." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.RESERVATION_EMAIL;
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Shine Garage <onboarding@resend.dev>";

  if (!apiKey || !recipient) {
    return NextResponse.json(
      { error: "Wysyłanie e-maili nie zostało skonfigurowane." },
      { status: 500 },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let claimedReservationId: number | string | null = null;

  if (supabaseUrl && supabaseServiceRoleKey) {
    const claimResponse = await fetch(`${supabaseUrl}/rest/v1/reservations`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: reservation.name,
        phone: reservation.phone,
        car: reservation.car,
        package: reservation.package,
        car_size: reservation.carSize,
        extras: reservation.extras,
        estimated_price: reservation.estimatedPrice,
        reservation_date: reservation.date,
        reservation_time: reservation.time,
        notes: reservation.notes || null,
      }),
    });

    if (!claimResponse.ok) {
      const databaseError = await claimResponse.text();
      console.error("Reservation claim failed", claimResponse.status, databaseError);
      const isDuplicate =
        claimResponse.status === 409 ||
        databaseError.includes("reservations_reservation_date_reservation_time_key") ||
        databaseError.includes("23505");

      return NextResponse.json(
        {
          error: isDuplicate
            ? "Ten termin został już zarezerwowany. Wybierz inną godzinę."
            : "Nie udało się zapisać terminu. Spróbuj ponownie.",
        },
        { status: isDuplicate ? 409 : 502 },
      );
    }

    const claimedRows = (await claimResponse.json()) as { id?: number | string }[];
    claimedReservationId = claimedRows[0]?.id ?? null;
  }

  const rows = [
    ["Imię i nazwisko", reservation.name],
    ["Telefon", reservation.phone],
    ["Samochód", reservation.car],
    ["Pakiet", reservation.package],
    [
      "Wielkość samochodu",
      (
        {
          small: "Małe",
          medium: "Średnie",
          large: "SUV / duże",
        } as Record<string, string>
      )[reservation.carSize] ?? reservation.carSize,
    ],
    [
      "Usługi dodatkowe",
      reservation.extras.length
        ? reservation.extras
            .map(
              (extra) =>
                (
                  {
                    ceramic: "Powłoka ceramiczna",
                    interior: "Pełne czyszczenie wnętrza",
                    wheels: "Zabezpieczenie felg",
                  } as Record<string, string>
                )[extra] ?? extra,
            )
            .join(", ")
        : "Brak",
    ],
    [
      "Szacowana cena",
      reservation.estimatedPrice !== null
        ? `${reservation.estimatedPrice} zł`
        : "Do ustalenia",
    ],
    ["Termin", `${reservation.date}, ${reservation.time}`],
    ["Uwagi", reservation.notes || "Brak"],
  ];

  let emailResponse: Response;

  try {
    emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "shine-garage/1.0",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject: `Nowa rezerwacja Shine Garage — ${reservation.car}`,
        text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
        html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#18181b">
          <h1 style="margin-bottom:8px">Nowa rezerwacja Shine Garage</h1>
          <p style="margin-top:0;color:#52525b">Formularz wysłany ze strony internetowej.</p>
          <table style="width:100%;border-collapse:collapse">
            ${rows
              .map(
                ([label, value]) => `
                  <tr>
                    <th style="padding:12px;border-bottom:1px solid #e4e4e7;text-align:left;vertical-align:top">${escapeHtml(label)}</th>
                    <td style="padding:12px;border-bottom:1px solid #e4e4e7">${escapeHtml(value)}</td>
                  </tr>`,
              )
              .join("")}
          </table>
        </div>
      `,
      }),
    });
  } catch (error) {
    console.error("Resend connection error", error);
    return NextResponse.json(
      { error: "Nie udało się połączyć z usługą e-mail." },
      { status: 502 },
    );
  }

  if (!emailResponse.ok) {
    const resendError = await emailResponse.text();
    console.error("Resend rejected email", emailResponse.status, resendError);

    let publicError = "Usługa e-mail odrzuciła wiadomość.";

    if (emailResponse.status === 401 || emailResponse.status === 403) {
      publicError =
        "Klucz Resend jest nieprawidłowy albo nie ma uprawnień do wysyłania.";
    } else if (emailResponse.status === 422) {
      publicError =
        "Adres nadawcy lub odbiorcy nie jest jeszcze dozwolony w Resend.";
    } else if (emailResponse.status === 429) {
      publicError = "Przekroczono chwilowy limit wysyłania wiadomości.";
    }

    if (
      claimedReservationId !== null &&
      supabaseUrl &&
      supabaseServiceRoleKey
    ) {
      await fetch(
        `${supabaseUrl}/rest/v1/reservations?id=eq.${encodeURIComponent(String(claimedReservationId))}`,
        {
          method: "DELETE",
          headers: {
            apikey: supabaseServiceRoleKey,
            Authorization: `Bearer ${supabaseServiceRoleKey}`,
          },
        },
      ).catch(() => undefined);
    }

    return NextResponse.json(
      { error: publicError },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Dziękujemy! Rezerwacja została przyjęta. Odezwiemy się telefonicznie.",
  });
}

function getDateInTimeZone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

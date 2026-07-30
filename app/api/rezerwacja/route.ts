import { NextResponse } from "next/server";

type Reservation = {
  name?: unknown;
  phone?: unknown;
  car?: unknown;
  package?: unknown;
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
    date: text(body.date, 30),
    time: text(body.time, 20),
    notes: text(body.notes, 2000),
  };

  if (
    !reservation.name ||
    !reservation.phone ||
    !reservation.car ||
    !reservation.package ||
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

  const rows = [
    ["Imię i nazwisko", reservation.name],
    ["Telefon", reservation.phone],
    ["Samochód", reservation.car],
    ["Pakiet", reservation.package],
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

    return NextResponse.json(
      { error: publicError },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
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

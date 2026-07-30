"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TransitionLink } from "./TransitionLink";

const services = [
  {
    number: "01",
    slug: "detailing-zewnetrzny",
    title: "Detailing zewnętrzny",
    description:
      "Bezpieczne mycie, dekontaminacja lakieru oraz zabezpieczenie karoserii.",
    price: "Od 249 zł",
  },
  {
    number: "02",
    slug: "powloka-ceramiczna",
    title: "Powłoka ceramiczna",
    description:
      "Długotrwała ochrona lakieru, głęboki połysk i łatwiejsza pielęgnacja.",
    price: "Od 1199 zł",
  },
  {
    number: "03",
    slug: "detailing-wnetrza",
    title: "Detailing wnętrza",
    description:
      "Czyszczenie tapicerki, plastików, skóry i trudno dostępnych miejsc.",
    price: "Od 349 zł",
  },
];

const packages = [
  {
    name: "Start",
    price: "349 zł",
    features: [
      "Bezpieczne mycie ręczne",
      "Czyszczenie felg i opon",
      "Wosk ochronny",
      "Odkurzanie wnętrza",
    ],
  },
  {
    name: "Pro",
    price: "899 zł",
    featured: true,
    features: [
      "Wszystko z pakietu Start",
      "Jednoetapowa korekta lakieru",
      "Zabezpieczenie lakieru",
      "Pełne czyszczenie wnętrza",
    ],
  },
  {
    name: "Ceramic",
    price: "1799 zł",
    features: [
      "Przygotowanie lakieru",
      "Korekta lakieru",
      "Powłoka ceramiczna",
      "Zabezpieczenie szyb i felg",
    ],
  },
];

const testimonials = [
  {
    text: "Samochód wygląda lepiej niż w dniu odbioru z salonu. Świetny kontakt i perfekcyjne wykonanie.",
    author: "Michał K.",
    car: "BMW Seria 5",
    date: "2 tygodnie temu",
  },
  {
    text: "Powłoka ceramiczna robi ogromną różnicę. Auto łatwiej się myje i cały czas ma głęboki połysk.",
    author: "Anna P.",
    car: "Mercedes GLC",
    date: "miesiąc temu",
  },
  {
    text: "Wnętrze po detailingu wygląda jak nowe. Zdecydowanie wrócę przed kolejnym sezonem.",
    author: "Tomasz W.",
    car: "Audi A6",
    date: "2 miesiące temu",
  },
];

const comparisonProjects = [
  {
    title: "Korekta lakieru",
    car: "BMW M4",
    description: "Usunięcie mikrorys i odzyskanie głębi lakieru.",
    before: "/porownanie-bmw-v2-przed.png",
    after: "/porownanie-bmw-v2-po.png",
  },
  {
    title: "Ceramika premium",
    car: "Porsche Macan",
    description: "Dokładne oczyszczenie i hydrofobowe zabezpieczenie lakieru.",
    before: "/porownanie-porsche-v2-przed.png",
    after: "/porownanie-porsche-v2-po.png",
  },
  {
    title: "Detailing wnętrza",
    car: "Mercedes Klasa E",
    description: "Pełne czyszczenie skóry, tworzyw i trudno dostępnych miejsc.",
    before: "/porownanie-mercedes-v2-przed.png",
    after: "/porownanie-mercedes-v2-po.png",
  },
];

const polishMonths = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

const timeSlots = Array.from({ length: 24 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
});

const extraServices = [
  {
    value: "ceramic",
    label: "Powłoka ceramiczna",
    price: "+900 zł",
    href: "/uslugi/powloka-ceramiczna",
  },
  {
    value: "interior",
    label: "Pełne czyszczenie wnętrza",
    price: "+300 zł",
    href: "/uslugi/detailing-wnetrza",
  },
  {
    value: "wheels",
    label: "Zabezpieczenie felg",
    price: "+160 zł",
    href: "/uslugi/zabezpieczenie-felg",
  },
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [toastKind, setToastKind] = useState<
    "success" | "error" | "loading" | ""
  >("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("start");
  const [reservationHighlight, setReservationHighlight] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [beforeAfterPosition, setBeforeAfterPosition] = useState(52);
  const [selectedComparison, setSelectedComparison] = useState(0);
  const [revealedSocial, setRevealedSocial] = useState<string | null>(null);
  const [selectedCalculatorPackage, setSelectedCalculatorPackage] =
    useState("start");
  const [selectedCarSize, setSelectedCarSize] = useState("medium");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isCallButtonCollapsed, setIsCallButtonCollapsed] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsCallButtonCollapsed(true);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setBookedTimes([]);
      return;
    }

    const controller = new AbortController();
    setIsLoadingAvailability(true);

    fetch(`/api/dostepnosc?date=${encodeURIComponent(selectedDate)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = (await response.json()) as { bookedTimes?: string[] };
        if (!response.ok) throw new Error();
        const nextBookedTimes = result.bookedTimes ?? [];
        setBookedTimes(nextBookedTimes);
        if (nextBookedTimes.includes(selectedTime)) {
          setSelectedTime("");
        }
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setBookedTimes([]);
      })
      .finally(() => setIsLoadingAvailability(false));

    return () => controller.abort();
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    const elements =
      document.querySelectorAll<HTMLElement>("[data-scroll-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("scroll-reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px",
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function navigateTo(id: string) {
    const section = document.getElementById(id);
    if (!section) return;

    if (id === "rezerwacja") {
      setReservationHighlight(false);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setReservationHighlight(true));
      });
      window.setTimeout(() => setReservationHighlight(false), 1600);
    }

    const startPosition = window.scrollY;
    const headerOffset = 72;
    const targetPosition =
      section.getBoundingClientRect().top + window.scrollY - headerOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(
      Math.max(Math.abs(distance) * 0.45, 500),
      1200,
    );

    let startTime: number | null = null;

    function animate(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function mobileNavigate(id: string) {
    setIsMenuOpen(false);
    window.setTimeout(() => navigateTo(id), 320);
  }

  function clearFieldError(field: string) {
    setFormErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function showToast(
    kind: "success" | "error" | "loading",
    text: string,
    duration = 7000,
  ) {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    setToastKind(kind);
    setMessage(text);

    if (kind !== "loading") {
      toastTimerRef.current = window.setTimeout(() => {
        setMessage("");
        toastTimerRef.current = window.setTimeout(() => {
          setToastKind("");
          toastTimerRef.current = null;
        }, 550);
      }, duration);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const errors: Record<string, string> = {};

    if (!String(formData.get("name") || "").trim()) {
      errors.name = "Podaj imię i nazwisko.";
    }
    if (!String(formData.get("phone") || "").trim()) {
      errors.phone = "Podaj numer telefonu.";
    }
    if (!String(formData.get("car") || "").trim()) {
      errors.car = "Podaj markę i model samochodu.";
    }
    if (!selectedPackage) {
      errors.package = "Wybierz jeden z pakietów.";
    }
    const todayValue = formatInputDate(new Date());

    if (!selectedDate) {
      errors.date = "Wybierz preferowany dzień.";
    } else if (selectedDate < todayValue) {
      errors.date = "Nie możesz wybrać dnia, który już minął.";
    }
    if (!selectedTime) {
      errors.time = "Wybierz preferowaną godzinę.";
    }
    if (formData.get("consent") !== "accepted") {
      errors.consent = "Zaznacz zgodę na kontakt w sprawie rezerwacji.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstInvalidField = Object.keys(errors)[0];
      window.setTimeout(() => {
        const field = document.querySelector<HTMLElement>(
          `[data-field="${firstInvalidField}"]`,
        );
        field?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        field
          ?.querySelector<HTMLElement>(
            'input:not([type="hidden"]), button, textarea',
          )
          ?.focus({ preventScroll: true });
      }, 80);
      showToast("error", "Uzupełnij zaznaczone pola formularza.");
      return;
    }

    setFormErrors({});
    setReservationSent(false);
    setIsSubmitting(true);
    showToast("loading", "Wysyłamy rezerwację…");

    try {
      const response = await fetch("/api/rezerwacja", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: String(formData.get("name") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          car: String(formData.get("car") || "").trim(),
          package: selectedPackage,
          carSize: selectedCarSize,
          extras: selectedExtras,
          estimatedPrice,
          date: selectedDate,
          time: selectedTime,
          notes: String(formData.get("notes") || "").trim(),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string; message?: string; ok?: boolean }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.error || "Nie udało się wysłać rezerwacji.",
        );
      }

      form.reset();
      setSelectedPackage("start");
      setSelectedCarSize("medium");
      setSelectedExtras([]);
      setSelectedDate("");
      setSelectedTime("");
      setBookedTimes([]);
      setReservationSent(true);
      showToast(
        "success",
        result?.message ||
          "Dziękujemy! Rezerwacja została przyjęta. Odezwiemy się telefonicznie.",
        12000,
      );
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Nie udało się wysłać rezerwacji. Spróbuj ponownie lub zadzwoń.",
        9000,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const calculatorPackagePrices: Record<string, number> = {
    start: 349,
    pro: 899,
    ceramic: 1799,
  };
  const sizePrices: Record<string, number> = {
    small: 0,
    medium: 100,
    large: 250,
  };
  const extraPrices: Record<string, number> = {
    ceramic: 900,
    interior: 300,
    wheels: 160,
  };
  const estimatedPrice =
    calculatorPackagePrices[selectedCalculatorPackage] +
    sizePrices[selectedCarSize] +
    selectedExtras.reduce((sum, item) => sum + extraPrices[item], 0);

  function toggleExtra(extra: string) {
    setSelectedExtras((current) =>
      current.includes(extra)
        ? current.filter((item) => item !== extra)
        : [...current, extra],
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {typeof document !== "undefined" &&
        createPortal(
      <header className="fixed inset-x-0 top-0 z-[9998] border-b border-white/10 bg-black/95 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-10">
          <button
            type="button"
            onClick={() => navigateTo("start")}
            className="text-xl font-black tracking-[0.12em]"
          >
            SHINE{" "}
            <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.7)]">
              GARAGE
            </span>
          </button>

          <nav className="hidden items-center gap-5 text-xs font-bold lg:flex xl:text-sm">
            {[
              ["Oferta", "oferta"],
              ["Realizacje", "realizacje"],
              ["Pakiety", "pakiety"],
              ["Jak pracujemy", "proces"],
              ["Opinie", "opinie"],
              ["FAQ", "faq"],
              ["Lokalizacja", "lokalizacja"],
            ].map(([label, id]) => (
              <button
                key={id}
                type="button"
                onClick={() => navigateTo(id)}
                className="group relative py-2 transition duration-300 hover:-translate-y-0.5 hover:text-cyan-300"
              >
                {label}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-cyan-300 transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
            <button
              onClick={() => navigateTo("rezerwacja")}
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-black transition hover:bg-cyan-300"
            >
              Rezerwacja
            </button>
          </nav>

          <button
            type="button"
            aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex w-10 flex-col gap-1.5 rounded-lg p-2 lg:hidden"
          >
            <span
              className={`h-0.5 w-6 bg-white transition duration-500 ease-linear ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-white transition duration-500 ease-linear ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-white transition duration-500 ease-linear ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        <div
          className={`overflow-hidden border-white/10 bg-black/95 transition-all duration-500 ease-linear lg:hidden ${
            isMenuOpen
              ? "max-h-96 border-t py-3 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-5 text-left font-bold">
            {[
              ["Oferta", "oferta"],
              ["Realizacje", "realizacje"],
              ["Pakiety", "pakiety"],
              ["Jak pracujemy", "proces"],
              ["Opinie", "opinie"],
              ["FAQ", "faq"],
              ["Lokalizacja", "lokalizacja"],
              ["Rezerwacja", "rezerwacja"],
            ].map(([label, id]) => (
              <button
                key={id}
                type="button"
                onClick={() => mobileNavigate(id)}
                className="rounded-lg px-3 py-3 text-left hover:bg-white/10"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>,
          document.body,
        )}

      <section
        id="start"
        className="relative flex min-h-screen scroll-mt-20 items-center bg-cover bg-[position:center_25%] px-6 pb-20 pt-32 md:bg-center md:px-12"
        style={{ backgroundImage: "url('/hero-studio.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
              Profesjonalny car detailing
            </p>
            <h1 className="text-5xl font-black leading-[1.05] sm:text-7xl">
              Przywracamy blask.
              <span className="block text-cyan-300">
                Chronimy każdy detal.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-200 sm:text-xl">
              Kompleksowa pielęgnacja samochodów, korekta lakieru i powłoki
              ceramiczne wykonywane z najwyższą precyzją.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigateTo("oferta")}
                className="rounded-full bg-cyan-400 px-8 py-4 font-black text-black transition hover:scale-105 hover:bg-cyan-300"
              >
                Zobacz ofertę
              </button>
              <button
                type="button"
                onClick={() => navigateTo("rezerwacja")}
                className="rounded-full border border-white/50 bg-black/20 px-8 py-4 font-bold backdrop-blur transition hover:bg-white hover:text-black"
              >
                Umów wizytę
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigateTo("lokalizacja")}
              className="group mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/35 px-5 py-3 text-sm font-bold text-zinc-100 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-300"
            >
              <span
                aria-hidden="true"
                className="transition duration-300 group-hover:scale-110"
              >
                📍
              </span>
              ul. Motoryzacyjna 12, Poznań
              <span
                aria-hidden="true"
                className="transition duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>

          <div className="mt-16 grid max-w-3xl grid-cols-3 gap-3 border-t border-white/20 pt-8 text-center sm:gap-8">
            {[
              ["8+", "Lat doświadczenia"],
              ["1200+", "Zadbanych aut"],
              ["4,9", "Ocena klientów"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-black text-cyan-300 sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-xs text-zinc-300 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="oferta" className="scroll-mt-18 px-6 py-24 md:px-12">
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Nasza oferta"
            title="Profesjonalna pielęgnacja auta"
            description="Dobieramy usługę do stanu samochodu i efektu, który chcesz osiągnąć."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="group rounded-3xl border border-white/10 bg-zinc-900 p-8 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/70"
              >
                <p className="text-sm font-black tracking-widest text-cyan-300">
                  {service.number}
                </p>
                <h3 className="mt-6 text-2xl font-black">{service.title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">
                  {service.description}
                </p>
                <p className="mt-7 font-black text-cyan-300">{service.price}</p>
                <TransitionLink
                  href={`/uslugi/${service.slug}`}
                  className="group/link mt-7 inline-flex origin-left items-center gap-2 rounded-full border border-transparent px-1 py-2 font-black text-white transition-all duration-300 hover:gap-4 hover:text-cyan-300 active:scale-90 active:border-cyan-300/50 active:bg-cyan-300/10 active:px-4 active:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                >
                  Poznaj usługę{" "}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover/link:translate-x-1 group-active/link:translate-x-2"
                  >
                    →
                  </span>
                </TransitionLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="realizacje"
        className="scroll-mt-18 bg-black px-6 py-24 md:px-12"
      >
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Efekty naszej pracy"
            title="Przesuń i zobacz różnicę"
            description="Porównaj lakier przed korektą i po pełnym procesie detailingu."
          />

          <div className="relative mx-auto mt-10 aspect-[4/3] max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-[0_0_40px_rgba(34,211,238,0.1)] sm:mt-14 sm:aspect-[16/9] sm:max-w-5xl sm:rounded-3xl sm:shadow-[0_0_60px_rgba(34,211,238,0.1)]">
            <div
              key={`${selectedComparison}-after`}
              className="absolute inset-0 animate-[fadeIn_450ms_ease-out] bg-cover bg-center"
              style={{
                backgroundImage: `url('${comparisonProjects[selectedComparison].after}')`,
              }}
            />
            <div
              key={`${selectedComparison}-before`}
              className="absolute inset-0 animate-[fadeIn_450ms_ease-out] bg-cover bg-center"
              style={{
                backgroundImage: `url('${comparisonProjects[selectedComparison].before}')`,
                clipPath: `inset(0 ${100 - beforeAfterPosition}% 0 0)`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]"
              style={{ left: `${beforeAfterPosition}%` }}
            >
              <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-300 text-sm font-black text-black sm:h-12 sm:w-12 sm:text-base">
                ↔
              </span>
            </div>
            <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-black sm:left-5 sm:top-5 sm:px-4 sm:py-2 sm:text-sm">
              PRZED
            </span>
            <span className="absolute right-3 top-3 rounded-full bg-cyan-300 px-3 py-1.5 text-xs font-black text-black sm:right-5 sm:top-5 sm:px-4 sm:py-2 sm:text-sm">
              PO
            </span>
            <input
              type="range"
              min="8"
              max="92"
              value={beforeAfterPosition}
              onChange={(event) =>
                setBeforeAfterPosition(Number(event.target.value))
              }
              aria-label="Porównaj samochód przed i po detailingu"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {comparisonProjects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                aria-pressed={selectedComparison === index}
                onClick={() => {
                  setSelectedComparison(index);
                  setBeforeAfterPosition(52);
                }}
                className={`group overflow-hidden rounded-3xl border bg-zinc-900 text-left transition duration-500 hover:-translate-y-1 ${
                  selectedComparison === index
                    ? "border-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.18)]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div
                  className="h-36 bg-cover transition duration-500 group-hover:scale-105 sm:h-52"
                  style={{
                    backgroundImage: `url('${project.after}')`,
                    backgroundPosition: "center",
                  }}
                />
                <div className="p-4 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-widest text-cyan-300">
                    {project.title}
                  </p>
                  <h3 className="mt-2 text-xl font-black">{project.car}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">
                    {project.description}
                  </p>
                  <span
                    className={`mt-5 inline-flex items-center gap-2 text-sm font-black transition ${
                      selectedComparison === index
                        ? "text-cyan-300"
                        : "text-zinc-500 group-hover:text-white"
                    }`}
                  >
                    {selectedComparison === index
                      ? "Wybrane do porównania ✓"
                      : "Porównaj przed i po →"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="pakiety" className="scroll-mt-18 bg-black px-6 py-24 md:px-12">
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Pakiety detailingowe"
            title="Wybierz poziom ochrony"
            description="Każdy pakiet dopasowujemy do wielkości i aktualnego stanu samochodu."
          />

          <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
            {packages.map((item) => (
              <article
                key={item.name}
                className={`relative flex flex-col rounded-3xl bg-zinc-900 p-8 ${
                  item.featured
                    ? "border-2 border-cyan-400 shadow-[0_0_45px_rgba(34,211,238,0.14)]"
                    : "border border-white/10"
                }`}
              >
                {item.featured && (
                  <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-cyan-400 px-4 py-1 text-xs font-black uppercase text-black">
                    Najczęściej wybierany
                  </span>
                )}
                <p
                  className={`text-sm font-bold uppercase tracking-widest ${
                    item.featured ? "text-cyan-300" : "text-zinc-400"
                  }`}
                >
                  {item.name}
                </p>
                <p className="mt-4 text-4xl font-black">{item.price}</p>
                <ul className="mt-7 flex-1 space-y-3 text-zinc-300">
                  {item.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigateTo("rezerwacja")}
                  className={`mt-8 rounded-full px-6 py-3 text-center font-black transition ${
                    item.featured
                      ? "bg-cyan-400 text-black hover:bg-cyan-300"
                      : "border border-white/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Wybieram {item.name}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12">
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Szybka wycena"
            title="Oblicz orientacyjny koszt"
            description="Wybierz rozmiar auta i dodatki. Dokładną cenę potwierdzimy po oględzinach."
          />

          <div className="mt-12 grid gap-8 rounded-3xl border border-white/10 bg-zinc-900 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <div>
              <p className="font-black">Pakiet</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["start", "Start", "349 zł"],
                  ["pro", "Pro", "899 zł"],
                  ["ceramic", "Ceramic", "1799 zł"],
                ].map(([value, label, price]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selectedCalculatorPackage === value}
                    onClick={() => setSelectedCalculatorPackage(value)}
                    className={`relative rounded-2xl border p-4 text-left transition-all duration-500 ease-out ${
                      selectedCalculatorPackage === value
                        ? "scale-[1.025] border-cyan-300 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,0.18)]"
                        : "scale-100 border-white/10 bg-black/20 hover:-translate-y-1 hover:border-white/30"
                    }`}
                  >
                    <span className="block font-black">{label}</span>
                    <span className="mt-1 block text-sm text-zinc-400">
                      {price}
                    </span>
                    <span
                      className={`absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border text-xs transition-all duration-500 ${
                        selectedCalculatorPackage === value
                          ? "scale-110 rotate-0 border-cyan-300 bg-cyan-300 text-black opacity-100"
                          : "scale-75 -rotate-90 border-zinc-600 opacity-50"
                      }`}
                    >
                      {selectedCalculatorPackage === value ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>

              <p className="font-black">Wielkość samochodu</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["small", "Małe", "+0 zł"],
                  ["medium", "Średnie", "+100 zł"],
                  ["large", "SUV / duże", "+250 zł"],
                ].map(([value, label, price]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedCarSize(value)}
                    className={`relative rounded-2xl border p-4 text-left transition-all duration-500 ease-out ${
                      selectedCarSize === value
                        ? "scale-[1.025] border-cyan-300 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,0.18)]"
                        : "scale-100 border-white/10 bg-black/20 hover:-translate-y-1 hover:border-white/30"
                    }`}
                  >
                    <span className="block font-black">{label}</span>
                    <span className="mt-1 block text-sm text-zinc-400">
                      {price}
                    </span>
                    <span
                      className={`absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border text-xs transition-all duration-500 ${
                        selectedCarSize === value
                          ? "scale-110 rotate-0 border-cyan-300 bg-cyan-300 text-black opacity-100"
                          : "scale-75 -rotate-90 border-zinc-600 opacity-50"
                      }`}
                    >
                      {selectedCarSize === value ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-8 font-black">Usługi dodatkowe</p>
              <div className="mt-4 grid gap-3">
                {extraServices.map(({ value, label, price, href }) => {
                  const active = selectedExtras.includes(value);
                  return (
                    <div
                      key={value}
                      className={`grid overflow-hidden rounded-xl border transition-all duration-500 ease-out sm:grid-cols-[1fr_auto] ${
                        active
                          ? "scale-[1.015] border-cyan-300 bg-cyan-300/10 shadow-[0_0_24px_rgba(34,211,238,0.14)]"
                          : "scale-100 border-white/10 bg-black/20 hover:border-white/30"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleExtra(value)}
                        className="flex items-center justify-between px-5 py-4 text-left transition hover:bg-white/5"
                      >
                        <span className="font-bold">{label}</span>
                        <span className="flex items-center gap-3">
                          <span className="text-sm font-black text-cyan-300">
                            {price}
                          </span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-all duration-500 ${
                              active
                                ? "scale-110 rotate-0 border-cyan-300 bg-cyan-300 text-black opacity-100"
                                : "scale-75 -rotate-90 border-zinc-600 opacity-50"
                            }`}
                          >
                            {active ? "✓" : ""}
                          </span>
                        </span>
                      </button>
                      <TransitionLink
                        href={href}
                        className="flex items-center justify-center border-t border-white/10 px-5 py-3 text-sm font-black text-cyan-300 transition hover:bg-cyan-300 hover:text-black sm:border-l sm:border-t-0"
                      >
                        Poznaj usługę →
                      </TransitionLink>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-3xl bg-black p-8 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-cyan-300">
                Szacowana cena
              </p>
              <p
                key={estimatedPrice}
                className="calculator-price mt-4 text-5xl font-black"
              >
                {estimatedPrice} zł
              </p>
              <p className="mt-4 leading-7 text-zinc-400">
                Cena orientacyjna. Końcową wycenę otrzymasz przed rozpoczęciem
                prac.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedPackage(selectedCalculatorPackage);
                  clearFieldError("package");
                  navigateTo("rezerwacja");
                }}
                className="mt-7 rounded-full bg-cyan-400 px-6 py-4 font-black text-black transition hover:bg-cyan-300"
              >
                Zarezerwuj wycenę
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="proces" className="scroll-mt-18 px-6 py-24 md:px-12">
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Jak pracujemy"
            title="Od oględzin do perfekcyjnego efektu"
            description="Każdy samochód przechodzi uporządkowany proces, dzięki któremu możemy zagwarantować jakość."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {[
              ["01", "Oględziny", "Oceniamy lakier i ustalamy oczekiwany efekt."],
              ["02", "Przygotowanie", "Dokładnie myjemy i oczyszczamy powierzchnie."],
              ["03", "Detailing", "Wykonujemy wybrane prace z pełną precyzją."],
              ["04", "Odbiór", "Prezentujemy efekt i przekazujemy zalecenia."],
            ].map(([number, title, description]) => (
              <article
                key={number}
                className="border-l border-cyan-400/40 py-3 pl-6"
              >
                <p className="font-black text-cyan-300">{number}</p>
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-2 leading-7 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="opinie" className="scroll-mt-18 bg-zinc-900 px-6 py-24 md:px-12">
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Opinie Google"
            title="Klienci oceniają nas na 4,9"
            description="Przykładowe opinie przygotowane w stylu wizytówki Google Maps."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure
                key={item.author}
                className="rounded-3xl border border-white/10 bg-black/30 p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-300 font-black text-black">
                      {item.author.charAt(0)}
                    </span>
                    <div>
                      <p className="font-black">{item.author}</p>
                      <p className="text-xs text-zinc-500">{item.date}</p>
                    </div>
                  </div>
                  <span
                    aria-label="Opinia Google"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-black text-blue-600"
                  >
                    G
                  </span>
                </div>
                <p className="mt-5 text-lg tracking-[0.2em] text-yellow-400">
                  ★★★★★
                </p>
                <blockquote className="mt-5 leading-7 text-zinc-300">
                  „{item.text}”
                </blockquote>
                <figcaption className="mt-7">
                  <p className="text-sm font-bold text-zinc-500">{item.car}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-18 bg-black px-6 py-24 md:px-12">
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Najczęściej zadawane pytania"
            description="Krótko odpowiadamy na pytania, które pojawiają się przed pierwszą wizytą."
          />

          <div className="mt-12 space-y-3">
            {[
              ["Ile trwa detailing samochodu?", "Podstawowy pakiet wykonujemy zwykle w jeden dzień. Korekta lakieru i powłoka ceramiczna wymagają najczęściej 2–3 dni."],
              ["Czy muszę przygotować auto przed wizytą?", "Nie. Przywieź samochód w aktualnym stanie. My zajmiemy się bezpiecznym myciem oraz pełnym przygotowaniem powierzchni."],
              ["Jak długo utrzymuje się powłoka ceramiczna?", "W zależności od wybranego wariantu i pielęgnacji od 2 do 5 lat. Po realizacji otrzymasz dokładne zalecenia."],
              ["Czy mogę zostawić samochód wcześniej?", "Tak. Termin przekazania kluczy ustalimy telefonicznie po wysłaniu formularza rezerwacji."],
            ].map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <article
                  key={question}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 p-6 text-left font-black"
                  >
                    {question}
                    <span
                      className={`text-2xl text-cyan-300 transition duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 leading-7 text-zinc-400">
                        {answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="rezerwacja" className="scroll-mt-18 px-6 py-24 md:px-12">
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Rezerwacja"
            title="Twoje auto zasługuje na perfekcyjny wygląd"
            description="Wypełnij formularz, a skontaktujemy się z Tobą i potwierdzimy dogodny termin."
          />

          <form
            onSubmit={handleSubmit}
            noValidate
            className={`mt-12 grid gap-6 rounded-3xl border bg-zinc-900 p-6 transition md:grid-cols-2 md:p-10 ${
              reservationHighlight
                ? "reservation-highlight border-cyan-300"
                : "border-white/10"
            }`}
          >
            <Field
              label="Imię i nazwisko"
              fieldName="name"
              error={formErrors.name}
            >
              <div className="form-field-shell">
                <span className="form-field-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />
                  </svg>
                </span>
                <input
                  suppressHydrationWarning
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="np. Jan Kowalski"
                  onChange={() => clearFieldError("name")}
                  aria-invalid={Boolean(formErrors.name)}
                  className={`form-field form-field-featured ${formErrors.name ? "form-field-invalid" : ""}`}
                />
              </div>
            </Field>

            <Field
              label="Numer telefonu"
              fieldName="phone"
              error={formErrors.phone}
            >
              <div className="form-field-shell">
                <span className="form-field-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7.5 3.5 10 8 7.8 9.8a15.6 15.6 0 0 0 6.4 6.4L16 14l4.5 2.5-.7 3.5c-.2.7-.8 1.2-1.5 1.2C9.7 20.7 3.3 14.3 2.8 5.7c0-.7.5-1.3 1.2-1.5l3.5-.7Z" />
                  </svg>
                </span>
                <input
                  suppressHydrationWarning
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="np. 123 456 789"
                  onChange={() => clearFieldError("phone")}
                  aria-invalid={Boolean(formErrors.phone)}
                  className={`form-field form-field-featured ${formErrors.phone ? "form-field-invalid" : ""}`}
                />
              </div>
            </Field>

            <Field
              label="Marka i model samochodu"
              fieldName="car"
              error={formErrors.car}
              className="md:col-span-2"
            >
              <div className="form-field-shell">
                <span className="form-field-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m4 14 1.5-5A2 2 0 0 1 7.4 7h9.2a2 2 0 0 1 1.9 2l1.5 5M3 14h18v5H3v-5Zm3 5v2m12-2v2M6.5 16.5h.01m10.99 0h.01" />
                  </svg>
                </span>
                <input
                  suppressHydrationWarning
                  type="text"
                  name="car"
                  required
                  autoComplete="off"
                  placeholder="np. BMW Seria 3"
                  onChange={() => clearFieldError("car")}
                  aria-invalid={Boolean(formErrors.car)}
                  className={`form-field form-field-featured ${formErrors.car ? "form-field-invalid" : ""}`}
                />
              </div>
            </Field>

            <fieldset
              data-field="package"
              className={`rounded-2xl transition md:col-span-2 ${
                formErrors.package ? "field-error-shake ring-2 ring-red-400/70" : ""
              }`}
            >
              <legend className="text-sm font-bold text-zinc-200">
                Wybrany pakiet
              </legend>
              <button
                type="button"
                onClick={() => navigateTo("pakiety")}
                className="float-right -mt-6 rounded-full px-3 py-1 text-sm font-black text-cyan-300 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                Zobacz pakiety ↑
              </button>
              <input type="hidden" name="package" value={selectedPackage} />
              <div className="clear-both mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  ["start", "Start", "349 zł"],
                  ["pro", "Pro", "899 zł"],
                  ["ceramic", "Ceramic", "1799 zł"],
                ].map(([value, label, price]) => {
                  const isSelected = selectedPackage === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedPackage(value);
                        clearFieldError("package");
                      }}
                      className={`relative rounded-2xl border p-4 text-left transition-all duration-500 ease-out ${
                        isSelected
                          ? "scale-[1.025] border-cyan-300 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.22)]"
                          : "scale-100 border-white/10 bg-black/25 hover:-translate-y-1 hover:border-white/30"
                      }`}
                    >
                      <span
                        className={`block font-black ${
                          isSelected ? "text-cyan-300" : "text-white"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="mt-1 block text-sm text-zinc-400">
                        {price}
                      </span>
                      <span
                        className={`absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 ${
                          isSelected
                            ? "scale-110 rotate-0 border-cyan-300 bg-cyan-300 text-xs text-black opacity-100"
                            : "scale-75 rotate-[-90deg] border-zinc-600 opacity-60"
                        }`}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
              {formErrors.package && (
                <p className="mt-2 text-sm font-bold text-red-400">
                  {formErrors.package}
                </p>
              )}
            </fieldset>

            <fieldset className="rounded-2xl md:col-span-2">
              <legend className="text-sm font-bold text-zinc-200">
                Wielkość samochodu
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  ["small", "Małe", "+0 zł"],
                  ["medium", "Średnie", "+100 zł"],
                  ["large", "SUV / duże", "+250 zł"],
                ].map(([value, label, price]) => {
                  const isSelected = selectedCarSize === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedCarSize(value)}
                      className={`relative rounded-2xl border p-4 text-left transition-all duration-500 ease-out ${
                        isSelected
                          ? "scale-[1.025] border-cyan-300 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
                          : "scale-100 border-white/10 bg-black/25 hover:-translate-y-1 hover:border-white/30"
                      }`}
                    >
                      <span
                        className={
                          isSelected
                            ? "font-black text-cyan-300"
                            : "font-black"
                        }
                      >
                        {label}
                      </span>
                      <span className="mt-1 block text-sm text-zinc-400">
                        {price}
                      </span>
                      <span
                        className={`absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 ${
                          isSelected
                            ? "scale-110 border-cyan-300 bg-cyan-300 text-xs text-black opacity-100"
                            : "scale-75 -rotate-90 border-zinc-600 opacity-60"
                        }`}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="rounded-2xl md:col-span-2">
              <legend className="text-sm font-bold text-zinc-200">
                Usługi dodatkowe
              </legend>
              <p className="mt-1 text-xs text-zinc-500">
                Opcjonalnie — możesz zaznaczyć kilka usług.
              </p>
              <div className="mt-3 grid gap-3">
                {extraServices.map(({ value, label, price, href }) => {
                  const isSelected = selectedExtras.includes(value);

                  return (
                    <div
                      key={value}
                      className={`grid overflow-hidden rounded-xl border transition-all duration-500 ease-out sm:grid-cols-[1fr_auto] ${
                        isSelected
                          ? "scale-[1.01] border-cyan-300 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.14)]"
                          : "border-white/10 bg-black/25 hover:border-white/30"
                      }`}
                    >
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleExtra(value)}
                        className="flex items-center justify-between px-5 py-4 text-left transition hover:bg-white/5"
                      >
                        <span className="font-bold">{label}</span>
                        <span className="flex items-center gap-3">
                          <span className="text-sm font-black text-cyan-300">
                            {price}
                          </span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-all duration-500 ${
                              isSelected
                                ? "scale-110 border-cyan-300 bg-cyan-300 text-black opacity-100"
                                : "scale-75 -rotate-90 border-zinc-600 opacity-60"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </span>
                      </button>
                      <TransitionLink
                        href={href}
                        className="flex items-center justify-center border-t border-white/10 px-5 py-3 text-sm font-black text-cyan-300 transition hover:bg-cyan-300 hover:text-black sm:border-l sm:border-t-0"
                      >
                        Poznaj usługę →
                      </TransitionLink>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-5 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-cyan-300">
                    Szacowana cena
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Pakiet, wielkość auta i wybrane dodatki
                  </p>
                </div>
                <p
                  key={estimatedPrice}
                  className="calculator-price text-3xl font-black"
                >
                  {estimatedPrice} zł
                </p>
              </div>
            </div>

            <div className="relative">
              <Field
                label="Preferowany termin"
                fieldName="date"
                error={formErrors.date}
              >
                <input type="hidden" name="date" value={selectedDate} />
                <button
                  type="button"
                  aria-expanded={isCalendarOpen}
                  onClick={() => {
                    setIsCalendarOpen(!isCalendarOpen);
                    setIsTimeOpen(false);
                  }}
                  className={`form-field relative text-left ${
                    formErrors.date ? "form-field-invalid" : ""
                  }`}
                >
                  <span className={selectedDate ? "text-white" : "text-zinc-500"}>
                    {selectedDate
                      ? formatDisplayDate(selectedDate)
                      : "Wybierz dzień"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-cyan-300"
                  >
                    ▦
                  </span>
                </button>
              </Field>
              <CustomCalendar
                isOpen={isCalendarOpen}
                month={calendarMonth}
                selectedDate={selectedDate}
                onMonthChange={setCalendarMonth}
                  onSelect={(date) => {
                    setSelectedDate(formatInputDate(date));
                    clearFieldError("date");
                    setIsCalendarOpen(false);
                  }}
              />
            </div>

            <div className="relative">
              <Field
                label="Preferowana godzina"
                fieldName="time"
                error={formErrors.time}
              >
                <input type="hidden" name="time" value={selectedTime} />
                <button
                  type="button"
                  aria-expanded={isTimeOpen}
                  onClick={() => {
                    setIsTimeOpen(!isTimeOpen);
                    setIsCalendarOpen(false);
                  }}
                  className={`form-field relative text-left ${
                    formErrors.time ? "form-field-invalid" : ""
                  }`}
                >
                  <span className={selectedTime ? "text-white" : "text-zinc-500"}>
                    {selectedTime || "Wybierz godzinę"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-cyan-300"
                  >
                    ◷
                  </span>
                </button>
              </Field>
              <div
                aria-hidden={!isTimeOpen}
                className={`absolute left-0 right-0 top-full z-30 mt-2 origin-top rounded-2xl border border-white/15 bg-zinc-950 p-3 shadow-2xl transition-all duration-300 ease-out ${
                  isTimeOpen
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                }`}
              >
                  <p className="px-2 pb-3 text-sm font-bold text-zinc-300">
                    {isLoadingAvailability
                      ? "Sprawdzamy dostępność…"
                      : "Dostępne godziny"}
                  </p>
                  <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
                    {timeSlots.map((time) => {
                      const isBooked = bookedTimes.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          tabIndex={isTimeOpen && !isBooked ? 0 : -1}
                          disabled={isBooked || isLoadingAvailability}
                          onClick={() => {
                            setSelectedTime(time);
                            clearFieldError("time");
                            setIsTimeOpen(false);
                          }}
                          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                            isBooked
                              ? "cursor-not-allowed bg-red-400/10 text-red-300/60 line-through"
                              : selectedTime === time
                                ? "bg-cyan-300 text-black"
                                : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {isBooked ? "Zajęte" : time}
                        </button>
                      );
                    })}
                  </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Field label="Dodatkowe uwagi">
                <textarea
                  suppressHydrationWarning
                  name="notes"
                  rows={4}
                  placeholder="Napisz, czego oczekujesz lub w jakim stanie jest samochód."
                  className="form-field min-h-28 resize-y py-3"
                />
              </Field>
            </div>

            <label
              data-field="consent"
              className={`flex items-start gap-3 rounded-xl border p-4 transition md:col-span-2 ${
                formErrors.consent
                  ? "field-error-shake border-red-400/70 bg-red-400/5"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <input
                type="checkbox"
                name="consent"
                value="accepted"
                onChange={() => clearFieldError("consent")}
                className="mt-1 h-5 w-5 accent-cyan-300"
              />
              <span>
                <span className="block text-sm font-bold text-zinc-200">
                  Zgadzam się na kontakt w sprawie tej rezerwacji.
                </span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">
                  Dane zostaną wykorzystane wyłącznie do przygotowania wyceny i
                  ustalenia terminu.
                </span>
                {formErrors.consent && (
                  <span className="mt-2 block text-sm font-bold text-red-400">
                    {formErrors.consent}
                  </span>
                )}
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-cyan-400 px-10 py-4 font-black text-black transition hover:scale-[1.01] hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60 md:col-span-2"
            >
              {isSubmitting ? "Wysyłanie…" : "Wyślij prośbę o rezerwację"}
            </button>

            <div
              role="status"
              aria-live="polite"
              className={`overflow-hidden rounded-2xl border transition-all duration-500 md:col-span-2 ${
                reservationSent
                  ? "max-h-40 translate-y-0 border-green-400/40 bg-green-400/10 p-5 opacity-100"
                  : "pointer-events-none max-h-0 -translate-y-3 border-transparent p-0 opacity-0"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-400 font-black text-black">
                  ✓
                </span>
                <div>
                  <p className="font-black text-green-300">
                    Rezerwacja została przyjęta
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    Dostaliśmy Twoje zgłoszenie. Skontaktujemy się telefonicznie,
                    aby potwierdzić termin.
                  </p>
                </div>
              </div>
            </div>

          </form>
        </div>
      </section>

      {typeof document !== "undefined" &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`fixed left-4 right-4 top-24 z-[9999] transition-all duration-500 sm:left-auto sm:right-6 sm:w-[420px] ${
              message
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-5 opacity-0"
            }`}
          >
            <div
              className={`rounded-2xl border bg-zinc-950/95 backdrop-blur-xl ${
                toastKind === "error"
                  ? "border-red-400/50 shadow-[0_12px_40px_rgba(248,113,113,0.2)]"
                  : toastKind === "loading"
                    ? "border-cyan-300/40 shadow-[0_12px_40px_rgba(34,211,238,0.2)]"
                    : "border-green-400/50 shadow-[0_12px_40px_rgba(74,222,128,0.2)]"
              }`}
            >
              <div className="flex items-start gap-4 p-5">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black text-black ${
                    toastKind === "error"
                      ? "bg-red-400"
                      : toastKind === "loading"
                        ? "animate-pulse bg-cyan-300"
                        : "bg-green-400"
                  }`}
                >
                  {toastKind === "error"
                    ? "!"
                    : toastKind === "loading"
                      ? "…"
                      : "✓"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white">
                    {toastKind === "error"
                      ? "Sprawdź formularz"
                      : toastKind === "loading"
                        ? "Wysyłanie rezerwacji"
                        : "Rezerwacja została przyjęta"}
                  </p>
                  <p className="mt-0.5 text-sm leading-5 text-zinc-200">
                    {message}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Zamknij powiadomienie"
                  onClick={() => {
                    setMessage("");
                    window.setTimeout(() => setToastKind(""), 550);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <section
        id="lokalizacja"
        className="scroll-mt-18 border-y border-white/10 bg-black px-6 py-24 md:px-12"
      >
        <div data-scroll-reveal className="scroll-reveal mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Lokalizacja"
            title="Znajdziesz nas w Poznaniu"
            description="Dojedziesz do nas wygodnie z każdej części miasta. Na miejscu czeka bezpłatny parking dla klientów."
          />

          <div className="mt-12 grid overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-[0_0_50px_rgba(34,211,238,0.08)] lg:grid-cols-[0.9fr_1.4fr]">
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-3xl shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                📍
              </span>
              <p className="mt-7 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Shine Garage
              </p>
              <h3 className="mt-3 text-3xl font-black">
                ul. Motoryzacyjna 12
              </h3>
              <p className="mt-2 text-lg text-zinc-300">60-101 Poznań</p>

              <div className="mt-7 space-y-3 text-zinc-400">
                <p>✓ Bezpłatny parking przed studiem</p>
                <p>✓ Wjazd od strony głównej ulicy</p>
                <p>✓ Poniedziałek–sobota, 8:00–20:00</p>
              </div>

            </div>

            <div className="relative min-h-[360px] border-t border-white/10 lg:min-h-[500px] lg:border-l lg:border-t-0">
              <div
                role="img"
                aria-label="Stylizowana mapa dojazdu do Shine Garage"
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/mapa-poznania-shine-garage.png')",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/20 via-transparent to-cyan-950/10" />
              <div className="pointer-events-none absolute bottom-6 right-6 rounded-2xl border border-cyan-300/30 bg-black/80 px-5 py-4 backdrop-blur-md">
                <p className="text-xs font-black uppercase tracking-widest text-cyan-300">
                  Punkt docelowy
                </p>
                <p className="mt-1 font-black">Shine Garage</p>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black px-6 py-16 md:px-12">
        <div
          data-scroll-reveal
          className="scroll-reveal mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <ContactItem label="Adres" value="ul. Motoryzacyjna 12, Poznań" />
          <ContactItem label="Telefon" value="+48 123 456 789" />
          <ContactItem label="E-mail" value="kontakt@shinegarage.pl" />
          <ContactItem label="Godziny" value="Pon.–Sob. 8:00–20:00" />
        </div>
      </section>

      <footer className="bg-black px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <button
            type="button"
            onClick={() => navigateTo("start")}
            className="text-xl font-black tracking-[0.12em]"
          >
            SHINE <span className="text-cyan-300">GARAGE</span>
          </button>
          <p className="text-sm text-zinc-500">
            © 2026 Shine Garage. Projekt demonstracyjny do portfolio.
          </p>
          <div className="flex items-center gap-3">
            {[
              ["Instagram", "https://www.instagram.com/"],
              ["Facebook", "https://www.facebook.com/"],
              ["TikTok", "https://www.tiktok.com/"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                onClick={(event) => {
                  const isTouchDevice = window.matchMedia("(hover: none)").matches;

                  if (isTouchDevice && revealedSocial !== label) {
                    event.preventDefault();
                    setRevealedSocial(label);
                  }
                }}
                className={`group flex h-10 items-center justify-center overflow-hidden rounded-full border px-3 text-sm font-black transition-all duration-500 ${
                  revealedSocial === label
                    ? "border-cyan-300 bg-cyan-300 text-black"
                    : "border-white/15 hover:border-cyan-300 hover:bg-cyan-300 hover:text-black"
                }`}
              >
                <span className="shrink-0">{label.charAt(0)}</span>
                <span
                  className={`overflow-hidden whitespace-nowrap text-left transition-all duration-500 ${
                    revealedSocial === label
                      ? "ml-2 max-w-24 opacity-100"
                      : "max-w-0 opacity-0 group-hover:ml-2 group-hover:max-w-24 group-hover:opacity-100"
                  }`}
                >
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </footer>

      <a
        href="tel:+48123456789"
        aria-label="Zadzwoń do Shine Garage: 123 456 789"
        className={`fixed bottom-4 right-4 z-50 flex h-14 items-center justify-center overflow-hidden rounded-full bg-cyan-400 font-black text-black shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-[width,transform,box-shadow] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isCallButtonCollapsed
            ? "call-button-collapsed w-14 px-0"
            : "w-[calc(100%_-_2rem)] gap-3 px-6"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center justify-center text-xl transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isCallButtonCollapsed ? "rotate-[360deg] scale-110" : "rotate-0"
          }`}
        >
          ☎
        </span>
        <span
          className={`whitespace-nowrap transition-all duration-500 ease-out ${
            isCallButtonCollapsed
              ? "max-w-0 translate-x-3 opacity-0"
              : "max-w-64 translate-x-0 opacity-100"
          }`}
        >
          Zadzwoń: 123 456 789
        </span>
      </a>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <p className="text-center text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-center text-4xl font-black sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-zinc-400">
        {description}
      </p>
    </>
  );
}

function Field({
  label,
  children,
  fieldName,
  error,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  fieldName?: string;
  error?: string;
  className?: string;
}) {
  return (
    <label
      data-field={fieldName}
      className={`flex flex-col gap-2 rounded-xl transition ${className} ${
        error ? "field-error-shake" : ""
      }`}
    >
      <span className="text-sm font-bold text-zinc-200">{label}</span>
      {children}
      {error && (
        <span className="flex items-center gap-2 text-sm font-bold text-red-400">
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-xs text-black"
          >
            !
          </span>
          {error}
        </span>
      )}
    </label>
  );
}

function ContactItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-cyan-300">
        {label}
      </p>
      <p className="mt-2 font-bold text-zinc-200">{value}</p>
    </div>
  );
}

function CustomCalendar({
  isOpen,
  month,
  selectedDate,
  onMonthChange,
  onSelect,
}: {
  isOpen: boolean;
  month: Date;
  selectedDate: string;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date) => void;
}) {
  const today = startOfDay(new Date());
  const days = getCalendarDays(month);
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const displayedMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const canGoToPreviousMonth = displayedMonth > currentMonth;

  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute left-0 top-full z-40 mt-2 w-full min-w-[300px] origin-top rounded-2xl border border-white/15 bg-zinc-950 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.7)] transition-all duration-300 ease-out sm:w-[360px] ${
        isOpen
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-2 scale-95 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          tabIndex={isOpen ? 0 : -1}
          aria-label="Poprzedni miesiąc"
          disabled={!canGoToPreviousMonth}
          onClick={() =>
            onMonthChange(
              new Date(month.getFullYear(), month.getMonth() - 1, 1),
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xl transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
        >
          ‹
        </button>
        <p className="font-black capitalize">
          {polishMonths[month.getMonth()]} {month.getFullYear()}
        </p>
        <button
          type="button"
          tabIndex={isOpen ? 0 : -1}
          aria-label="Następny miesiąc"
          onClick={() =>
            onMonthChange(
              new Date(month.getFullYear(), month.getMonth() + 1, 1),
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xl transition hover:bg-white/10"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 text-center text-xs font-bold text-zinc-500">
        {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map((day) => (
          <span key={day} className="py-2">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const value = formatInputDate(date);
          const isCurrentMonth = date.getMonth() === month.getMonth();
          const isPast = startOfDay(date) < today;
          const isSelected = value === selectedDate;
          const isToday = startOfDay(date).getTime() === today.getTime();

          return (
            <button
              key={value}
              type="button"
              tabIndex={isOpen ? 0 : -1}
              disabled={!isOpen || isPast}
              onClick={() => onSelect(date)}
              className={`aspect-square rounded-lg text-sm font-bold transition ${
                isSelected
                  ? "bg-cyan-300 text-black"
                  : isToday
                    ? "border border-cyan-300 text-cyan-300"
                    : isCurrentMonth
                      ? "text-zinc-200 hover:bg-white/10"
                      : "text-zinc-600"
              } ${isPast ? "cursor-not-allowed opacity-25" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatInputDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

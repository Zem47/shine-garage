import { TransitionLink } from "../TransitionLink";

export type ServiceContent = {
  eyebrow: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  benefits: string[];
  steps: string[];
};

export function ServicePage({ service }: { service: ServiceContent }) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-black px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <TransitionLink href="/" className="text-xl font-black tracking-[0.12em]">
            SHINE <span className="text-cyan-300">GARAGE</span>
          </TransitionLink>
          <TransitionLink
            href="/#rezerwacja"
            className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-black text-black"
          >
            Rezerwacja
          </TransitionLink>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-24">
        <div
          className="service-background absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/hero-studio.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40" />
        <div className="relative mx-auto max-w-6xl">
          <TransitionLink
            href="/#oferta"
            className="service-reveal service-reveal-1 text-sm font-bold text-cyan-300 hover:text-cyan-200"
          >
            ← Wróć do oferty
          </TransitionLink>
          <p className="service-reveal service-reveal-2 mt-12 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            {service.eyebrow}
          </p>
          <h1 className="service-reveal service-reveal-3 mt-5 max-w-4xl text-5xl font-black sm:text-7xl">
            {service.title}
          </h1>
          <p className="service-reveal service-reveal-4 mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
            {service.description}
          </p>
          <div className="service-reveal service-reveal-5 mt-10 flex flex-wrap gap-4">
            <span className="rounded-full border border-white/15 bg-black/40 px-5 py-3 font-black">
              {service.price}
            </span>
            <span className="rounded-full border border-white/15 bg-black/40 px-5 py-3 font-black">
              Czas: {service.duration}
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-cyan-300">
              Co zyskujesz
            </p>
            <h2 className="mt-4 text-4xl font-black">Najważniejsze korzyści</h2>
            <ul className="mt-8 space-y-4">
              {service.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="rounded-2xl border border-white/10 bg-zinc-900 p-5 text-zinc-300"
                >
                  <span className="mr-3 text-cyan-300">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-cyan-300">
              Proces
            </p>
            <h2 className="mt-4 text-4xl font-black">Jak wykonujemy usługę</h2>
            <ol className="mt-8 space-y-4">
              {service.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-5 rounded-2xl border border-white/10 bg-black p-5"
                >
                  <span className="font-black text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black px-6 py-16 text-center">
        <h2 className="text-3xl font-black">Chcesz poznać dokładną cenę?</h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Wyślij formularz. Skontaktujemy się z Tobą i dopasujemy zakres prac do
          stanu samochodu.
        </p>
        <TransitionLink
          href="/#rezerwacja"
          className="mt-8 inline-flex rounded-full bg-cyan-400 px-8 py-4 font-black text-black"
        >
          Przejdź do rezerwacji
        </TransitionLink>
      </section>
    </main>
  );
}

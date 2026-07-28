import { ServicePage } from "../ServicePage";

export default function Page() {
  return (
    <ServicePage
      service={{
        eyebrow: "Detailing zewnętrzny",
        title: "Czystość i połysk bez kompromisów",
        description:
          "Bezpiecznie oczyszczamy każdą powierzchnię auta, usuwamy trudne zabrudzenia i zabezpieczamy lakier przed pogodą.",
        price: "Od 249 zł",
        duration: "6–10 godzin",
        benefits: [
          "Lakier bez osadów drogowych i metalicznych",
          "Bezpieczne mycie bez dokładania nowych mikrorys",
          "Wyraźnie głębszy połysk",
          "Łatwiejsza późniejsza pielęgnacja",
        ],
        steps: [
          "Oględziny i pomiar stanu lakieru",
          "Mycie wstępne, felgi i nadkola",
          "Mycie ręczne oraz dekontaminacja",
          "Osuszenie i aplikacja zabezpieczenia",
        ],
      }}
    />
  );
}

import { ServicePage } from "../ServicePage";

export default function Page() {
  return (
    <ServicePage
      service={{
        eyebrow: "Zabezpieczenie felg",
        title: "Czystsze felgi i trwała ochrona",
        description:
          "Dokładnie oczyszczamy felgi, usuwamy osad drogowy i pył z klocków, a następnie nakładamy zabezpieczenie ułatwiające późniejszą pielęgnację.",
        price: "Od 160 zł",
        duration: "2–4 godziny",
        benefits: [
          "Łatwiejsze usuwanie pyłu z klocków",
          "Ochrona przed solą i zabrudzeniami drogowymi",
          "Wyraźnie odświeżony wygląd felg",
          "Dłuższe utrzymanie czystości",
        ],
        steps: [
          "Dokładne mycie felg i nadkoli",
          "Usunięcie smoły oraz osadów metalicznych",
          "Odtłuszczenie przygotowanej powierzchni",
          "Aplikacja zabezpieczenia i kontrola efektu",
        ],
      }}
    />
  );
}

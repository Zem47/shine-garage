import { ServicePage } from "../ServicePage";

export default function Page() {
  return (
    <ServicePage
      service={{
        eyebrow: "Detailing wnętrza",
        title: "Wnętrze, do którego chce się wracać",
        description:
          "Dokładnie czyścimy tapicerkę, skórę, tworzywa i trudno dostępne miejsca, przywracając świeżość bez tłustego wykończenia.",
        price: "Od 349 zł",
        duration: "1 dzień",
        benefits: [
          "Usunięcie uporczywych zabrudzeń",
          "Bezpieczna pielęgnacja skóry i tworzyw",
          "Neutralny, świeży zapach",
          "Ochrona najczęściej dotykanych powierzchni",
        ],
        steps: [
          "Oględziny i dokładne odkurzanie",
          "Czyszczenie tapicerki oraz podsufitki",
          "Pielęgnacja skóry i elementów plastikowych",
          "Kontrola detali i suszenie wnętrza",
        ],
      }}
    />
  );
}

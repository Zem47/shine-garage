import { ServicePage } from "../ServicePage";

export default function Page() {
  return (
    <ServicePage
      service={{
        eyebrow: "Powłoka ceramiczna",
        title: "Długotrwała ochrona lakieru",
        description:
          "Przygotowujemy i zabezpieczamy lakier powłoką, która zwiększa połysk, hydrofobowość i odporność na codzienne zabrudzenia.",
        price: "Od 1199 zł",
        duration: "2–3 dni",
        benefits: [
          "Ochrona lakieru nawet do 5 lat",
          "Silny efekt odpychania wody",
          "Głębszy kolor i szklisty połysk",
          "Prostsze i szybsze mycie auta",
        ],
        steps: [
          "Mycie i pełna dekontaminacja",
          "Korekta oraz odtłuszczenie lakieru",
          "Aplikacja powłoki w kontrolowanych warunkach",
          "Utwardzenie i kontrola końcowa",
        ],
      }}
    />
  );
}

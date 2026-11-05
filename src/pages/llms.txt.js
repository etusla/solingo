import { SITE, COMPANY, DESIGNS, GROUPS, SIZES, FAQ, sizeLabel } from "../data/site.js";

// Yapay zekâ arama motorları için sitenin düz metin özeti (llms.txt)
export function GET() {
  const groups = Object.entries(GROUPS).map(([k, v]) => `- ${v}: ${DESIGNS.filter(d => d.g === k).map(d => d.name).join(", ")}`).join("\n");
  const body = `# Solingo

> Solingo, araç içinde kullanılmak üzere tasarlanmış bambu peçete markasıdır. Silindir kutu araç bardaklığına yerleşir; içinde %100 bambu lifinden 3 katlı, 50 yapraklı peçete bulunur. Kutular 21 desende sunulur ve siparişe özel olarak istediğiniz dizaynda üretilir.

Solingo, ${COMPANY.legalName} markasıdır.

## Ürün
- Malzeme: %100 bambu lifi
- Kat: 3 katlı (siparişe özel 2 katlı)
- Yaprak sayısı: 50 (siparişe özel 40)
- Kutu boyları: ${SIZES.map(sizeLabel).join("; ")}
- Kullanım: Kapaktaki oval bölüm bastırılarak açılır, peçete çekilerek kullanılır.
- Saklama: Güneş ışığından uzakta, serin ve kuru yerde.

## Koleksiyon (${DESIGNS.length} desen)
${groups}

## Siparişe özel üretim
- Seçenekler: kutu rengi, baskı rengi (altın, gümüş, beyaz, siyah), logo ve yazı, desen, kapak etiketi, kutu boyu, kat ve yaprak sayısı, paketleme.
- Adet: Teklifler 100.000 adetten başlar.
- Süreç: Talep, tasarım onayı, numune, üretim ve teslimat.

## Sıkça sorulan sorular
${FAQ.map(([q, a]) => `### ${q}\n${a}`).join("\n\n")}

## İletişim
- Web: ${SITE.url}
- E-posta: ${SITE.email}
- Telefon / WhatsApp: ${SITE.phone}
- Adres: ${COMPANY.street}, ${COMPANY.district} / ${COMPANY.city}, Türkiye
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

// Rehber sayfaları: arama motorları ve yapay zekâ asistanları için konu başına tek, net sayfa.
import { SIZES, QUANTITIES, sizeLabel } from "./site.js";

const olculer = SIZES.map(sizeLabel).join("; ");

export const PAGES = [
  {
    slug: "arac-ici-pecete",
    nav: "Araç İçi Peçete",
    title: "Araç İçi Peçete Nedir? Bardaklığa Oturan Silindir Kutu | Solingo",
    description: "Araç içi peçete nedir, nasıl kullanılır, hangi ölçüde olmalıdır? Bardaklığa oturan silindir kutuda %100 bambu Solingo araç içi peçete hakkında bilmeniz gerekenler.",
    kicker: "Rehber",
    h1: ["Araç içi peçete", "nedir?"],
    lead: "Araç içi peçete, aracın bardaklığına yerleşen silindir bir kutuda sunulan ve sürüş sırasında tek elle alınabilen peçetedir. Solingo, bu kutuyu %100 bambu lifinden 3 katlı 50 yaprak peçeteyle üretir.",
    image: ["/img/arac-signature-720.webp", "Araç bardaklığında duran Solingo araç içi peçete kutusu", 720, 1280],
    sections: [
      ["Neden silindir kutu?", [
        "Klasik kutu ve poşet peçeteler araçta sabit durmaz; torpidoda, kapı cebinde ya da koltuk arasında aranır. Silindir kutu ise aracın bardaklığına oturur: virajda devrilmez, yer kaplamaz ve her zaman aynı yerde durur.",
        "Solingo kutusunun kapağındaki oval bölüm bastırılarak açılır ve peçeteler tek tek çekilir. Böylece sürücü gözünü yoldan ayırmadan, yolcu ise uzanmadan peçeteye ulaşır."
      ]],
      ["Hangi ölçü hangi araca uyar?", [
        `Solingo dört kutu ölçüsünde üretilir: ${olculer}.`,
        "Gövde çapı 6,8 cm olan kutular standart araç bardaklıklarına göre tasarlanmıştır. Daha geniş bardaklıklar için 8,3 cm çaplı, 14 cm boyunda bir seçenek bulunur."
      ]],
      ["Solingo araç içi peçetenin özellikleri", [
        "Peçete %100 bambu lifinden üretilir ve 3 katlıdır. Standart kutuda 50 yaprak bulunur; siparişe özel üretimde 2 katlı peçete ve 40 yapraklı kutu da seçilebilir.",
        "Koleksiyonda sade Signature kutulardan çiçek ve geometrik desenlere 21 hazır desen yer alır. Kurumsal siparişlerde kutu, istenen renk ve dizaynla üretilir."
      ]],
      ["Nerelerde kullanılır?", [
        "Araç içi peçete kutusu günlük sürüşte, uzun yolda ve çocuklu yolculuklarda elinizin altında durur. Silindir formu sayesinde ofis masasında ve evde de kullanılabilir.",
        "Kurumsal tarafta filo araçlarında, araç teslimatlarında, müşteri hediyelerinde ve promosyon çalışmalarında tercih edilir."
      ]]
    ],
    faq: [
      ["Araç içi peçete kutusu her bardaklığa uyar mı?", "6,8 cm çaplı Solingo kutuları standart araç bardaklıklarına uyacak şekilde tasarlanmıştır. Daha geniş bardaklıklar için 8,3 cm çaplı seçenek üretilir."],
      ["Bir kutuda kaç peçete bulunur?", "Standart Solingo kutusunda 3 katlı 50 yaprak peçete bulunur."],
      ["Kutu nasıl açılır?", "Kapaktaki oval bölüm bastırılarak açılır; peçeteler tek tek çekilerek kullanılır."]
    ]
  },
  {
    slug: "bambu-pecete",
    nav: "Bambu Peçete",
    title: "Bambu Peçete: %100 Bambu Lifinden 3 Katlı Peçete | Solingo",
    description: "Bambu peçete nedir, neden tercih edilir? Solingo'nun %100 bambu lifinden üretilen 3 katlı, 50 yapraklı araç içi peçetesi ve özellikleri.",
    kicker: "Rehber",
    h1: ["Bambu peçete", "nedir?"],
    lead: "Bambu peçete, hammaddesi bambu bitkisinin lifi olan kâğıt peçetedir. Solingo peçeteleri %100 bambu lifinden, 3 katlı olarak üretilir.",
    image: ["/img/arac-kullanim-800.webp", "Solingo kutusundan bambu peçete alınırken", 800, 810],
    sections: [
      ["Bambu lifi neden tercih edilir?", [
        "Bambu, hızlı büyüyen ve kesildikten sonra kökünden yeniden süren bir bitkidir; bu nedenle kâğıt ürünlerinde yenilenebilir bir hammadde olarak kullanılır.",
        "Bambu lifinden üretilen peçete yumuşak bir dokuya sahiptir. Solingo'da üç kat bir arada kullanıldığı için peçete kullanım sırasında kolay yırtılmaz."
      ]],
      ["Solingo bambu peçetenin özellikleri", [
        "Malzeme: %100 bambu lifi. Kat sayısı: 3. Yaprak sayısı: kutuda 50 yaprak.",
        "Siparişe özel üretimde 2 katlı peçete ve 40 yapraklı kutu seçenekleri de sunulur."
      ]],
      ["Nasıl saklanmalı?", [
        "Peçete kutusunu güneş ışığından uzakta, serin ve kuru bir yerde saklayın. Araç içinde bardaklıkta durması kullanım için yeterlidir."
      ]]
    ],
    faq: [
      ["Solingo peçeteleri hangi malzemeden üretilir?", "Solingo peçeteleri %100 bambu lifinden üretilir."],
      ["Bambu peçete kaç katlıdır?", "Solingo'nun standart peçetesi 3 katlıdır. Siparişe özel üretimde 2 katlı seçenek de vardır."],
      ["Bambu peçete nasıl saklanır?", "Güneş ışığından uzakta, serin ve kuru bir yerde saklanmalıdır."]
    ]
  },
  {
    slug: "kurumsal-promosyon-pecete",
    nav: "Kurumsal Üretim",
    title: "Kurumsal Promosyon Peçete: İstediğiniz Dizaynda Üretim | Solingo",
    description: "Kurumsal ve promosyon amaçlı araç içi peçete: kutu rengi, desen, logo ve ölçü siparişe göre belirlenir. 100.000 adetten başlayan özel üretim için teklif alın.",
    kicker: "Kurumsal",
    h1: ["Kurumsal ve promosyon", "peçete üretimi."],
    lead: "Solingo, araç içi peçete kutusunu kurumunuzun istediği renk, desen ve logoyla üretir. Siparişe özel üretim teklifleri 100.000 adetten başlar.",
    image: ["/img/seri/renk-serisi-md.webp", "Dört farklı renkte geometrik desenli Solingo peçete kutuları", 720, 720],
    sections: [
      ["Neler özelleştirilebilir?", [
        "Kutu rengi, baskı rengi (altın, gümüş, beyaz, siyah), desen, logo ve yazı, kapak etiketi, kutu boyu, peçetenin kat ve yaprak sayısı ile paketleme siparişe göre belirlenir.",
        `Kutu ölçüleri: ${olculer}. Peçete 3 ya da 2 katlı; kutu 50 ya da 40 yapraklı üretilebilir.`
      ]],
      ["Sipariş adetleri", [
        `Teklifler şu adet aralıklarına göre hazırlanır: ${QUANTITIES.join("; ")}.`
      ]],
      ["Süreç nasıl işler?", [
        "Önce talebinizi iletirsiniz: tahmini adet, istediğiniz renk ya da desen ve varsa logonuz. Ardından tasarım hazırlanır ve onayınıza sunulur. Tasarım onaylandıktan sonra numune hazırlanır; numune onayıyla üretim başlar.",
        "Sitedeki tasarım aracıyla kutunuzu önceden görebilirsiniz: yapay zekâ ile desen oluşturabilir, koleksiyondan bir desen seçebilir ya da kendi görselinizi ve logonuzu yükleyebilirsiniz."
      ]],
      ["Kimler için uygun?", [
        "Araç içinde kullanılan bir ürün olduğu için müşterisine araçta ulaşan kurumlar için uygundur: akaryakıt ve servis ağları, otomotiv bayileri, filo ve araç kiralama şirketleri, sigorta ve finans kurumları ile müşterilerine kalıcı bir hediye vermek isteyen markalar."
      ]]
    ],
    faq: [
      ["Özel üretimde minimum sipariş adedi nedir?", "Siparişe özel üretim teklifleri 100.000 adetten başlar."],
      ["Kendi logomuz ve kurumsal renklerimizle üretim yapılır mı?", "Evet. Kutu rengi, baskı rengi, desen, logo ve kapak etiketi siparişe göre belirlenir."],
      ["Üretimden önce numune görebilir miyiz?", "Evet. Tasarım onaylandıktan sonra numune hazırlanır ve üretim numune onayıyla başlar."],
      ["Teklif nasıl alınır?", "solingo.com.tr üzerindeki teklif formunu doldurabilir, info@solingo.com.tr adresine yazabilir ya da +90 532 701 21 00 numarasını arayabilirsiniz."]
    ]
  }
];

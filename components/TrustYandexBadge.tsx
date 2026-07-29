const YANDEX_ORG_ID = "1855601489";
const YANDEX_MAP_URL = "https://yandex.ru/maps/org/sharoduvy/1855601489/";

/** Плашка рейтинга Яндекс.Карт (орг. ул. Чкалова) — полный вид с отзывами. */
export function TrustYandexBadge({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={["trust-yandex-badge", className].filter(Boolean).join(" ")}>
      <iframe
        src={`https://yandex.ru/maps-reviews-widget/${YANDEX_ORG_ID}/?size=m`}
        width={200}
        height={128}
        title="Рейтинг Шародувы на Яндекс Картах"
        loading="lazy"
      />
      <a
        href={YANDEX_MAP_URL}
        className="trust-yandex-badge-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Шародувы на Яндекс Картах
      </a>
    </div>
  );
}

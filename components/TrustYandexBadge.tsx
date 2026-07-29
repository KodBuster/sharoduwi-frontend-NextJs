/** Плашка рейтинга Яндекс.Справочника (орг. ул. Чкалова). */
export function TrustYandexBadge({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={["trust-yandex-badge", className].filter(Boolean).join(" ")}>
      <iframe
        src="https://yandex.ru/sprav/widget/rating-badge/1855601489?type=rating"
        width={150}
        height={50}
        title="Рейтинг на Яндекс"
        loading="lazy"
      />
    </div>
  );
}

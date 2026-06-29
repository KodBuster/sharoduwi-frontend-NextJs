const YANDEX_REVIEW_WIDGETS = [
  {
    orgId: "1855601489",
    mapUrl: "https://yandex.ru/maps/org/sharoduvy/1855601489/",
    label: "ул. Чкалова",
  },
  {
    orgId: "1796536309",
    mapUrl: "https://yandex.ru/maps/org/sharoduvy/1796536309/",
    label: "ТЦ «Фермер»",
  },
] as const;

function YandexReviewsWidget({
  orgId,
  mapUrl,
  label,
}: {
  orgId: string;
  mapUrl: string;
  label: string;
}) {
  return (
    <div className="yr-widget-wrap">
      <p className="yr-widget-label">{label}</p>
      <div className="yr-widget">
        <iframe
          src={`https://yandex.ru/maps-reviews-widget/${orgId}?comments`}
          title={`Отзывы на Яндекс.Картах — ${label}`}
          loading="lazy"
        />
        <a
          href={mapUrl}
          className="yr-widget-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Шародувы на карте Жуковского — Яндекс&nbsp;Карты
        </a>
      </div>
    </div>
  );
}

export function YandexReviewsWidgets() {
  return (
    <div className="yandex-reviews">
      <p className="yr-lead">Реальные отзывы покупателей — на Яндекс.Картах по обоим магазинам:</p>
      <div className="yr-widgets">
        {YANDEX_REVIEW_WIDGETS.map((widget) => (
          <YandexReviewsWidget key={widget.orgId} {...widget} />
        ))}
      </div>
    </div>
  );
}

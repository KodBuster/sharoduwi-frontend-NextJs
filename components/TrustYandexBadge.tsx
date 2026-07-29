"use client";

import { useEffect, useState } from "react";

import {
  YANDEX_TRUST_BADGE_FALLBACK,
  type YandexTrustBadgeData,
} from "@/lib/yandex-trust-badge";

function renderStars(ratingValue: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(ratingValue)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

export function TrustYandexBadgeView({
  data,
  className,
}: {
  data: YandexTrustBadgeData;
  className?: string;
}) {
  return (
    <a
      href={data.mapUrl}
      className={["trust-yandex-badge", className].filter(Boolean).join(" ")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${data.name}: рейтинг ${data.rating} на Яндекс Картах`}
    >
      <span className="trust-yandex-badge-head">
        <span className="trust-yandex-badge-name">{data.name}</span>
        <span className="trust-yandex-badge-source">Яндекс Карты</span>
      </span>
      <span className="trust-yandex-badge-body">
        <span className="trust-yandex-badge-score">{data.rating}</span>
        <span className="trust-yandex-badge-meta">
          <span className="trust-yandex-badge-stars" aria-hidden="true">
            {renderStars(data.ratingValue)}
          </span>
          <span className="trust-yandex-badge-count">
            {data.reviewsLabel} • {data.ratingsLabel}
          </span>
        </span>
      </span>
    </a>
  );
}

/** Плашка рейтинга Яндекс.Карт — данные обновляются с сервера раз в 6 часов. */
export function TrustYandexBadge({
  className,
  initialData,
}: {
  className?: string;
  initialData?: YandexTrustBadgeData;
}) {
  const [data, setData] = useState(initialData ?? YANDEX_TRUST_BADGE_FALLBACK);

  useEffect(() => {
    setData(initialData ?? YANDEX_TRUST_BADGE_FALLBACK);
  }, [initialData]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/trust-badge")
      .then((response) => (response.ok ? response.json() : null))
      .then((json: YandexTrustBadgeData | null) => {
        if (!cancelled && json) setData(json);
      })
      .catch(() => {
        /* keep current data */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <TrustYandexBadgeView data={data} className={className} />;
}

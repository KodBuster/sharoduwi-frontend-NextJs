"use client";

import { useRef } from "react";
import { REVIEWS } from "@/lib/data";

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

export function ReviewsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const step = () => {
    const track = trackRef.current;
    if (!track) return 370;
    const c = track.querySelector(".review") as HTMLElement | null;
    return c ? c.offsetWidth + 20 : 370;
  };

  return (
    <section className="sec" id="reviews">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-tag">
            <span className="dot" /> Отзывы
          </div>
          <h2>Что пишут наши клиенты</h2>
        </div>
        <div className="reviews-wrap">
          <button
            className="rv-nav prev"
            id="rvPrev"
            aria-label="Предыдущий отзыв"
            type="button"
            onClick={() => trackRef.current?.scrollBy({ left: -step(), behavior: "smooth" })}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="rv-nav next"
            id="rvNext"
            aria-label="Следующий отзыв"
            type="button"
            onClick={() => trackRef.current?.scrollBy({ left: step(), behavior: "smooth" })}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="reviews" id="reviewsTrack" ref={trackRef}>
            {REVIEWS.map((r) => (
              <div className="review" key={r.name}>
                {r.photo ? (
                  <div className="rv-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.photo} alt="" loading="lazy" />
                  </div>
                ) : null}
                <div className="stars">★★★★★</div>
                <p>{r.text}</p>
                <div className="who">
                  <div className="ava" style={{ background: r.color }}>
                    {r.initial}
                  </div>
                  <div>
                    <b>{r.name}</b>
                    <span>{r.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="yandex-reviews reveal">
          <p className="yr-lead">Реальные отзывы покупателей — на Яндекс.Картах по обоим магазинам:</p>
          <div className="yr-widgets">
            {YANDEX_REVIEW_WIDGETS.map((widget) => (
              <YandexReviewsWidget key={widget.orgId} {...widget} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

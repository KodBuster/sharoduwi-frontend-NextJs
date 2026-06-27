"use client";

import { useRef } from "react";
import { REVIEWS } from "@/lib/data";

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
                <div className="rv-photo">
                  <span className="rv-ph">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <circle cx="12" cy="12.5" r="3.5" />
                    </svg>
                    Фото клиента
                  </span>
                </div>
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
          <div className="yr-btns">
            <a className="yandex-btn" href="#" target="_blank" rel="noopener noreferrer">
              <span className="yr-star">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />
                </svg>
              </span>
              Отзывы на Яндексе <b>· ул. Чкалова</b>
            </a>
            <a className="yandex-btn" href="#" target="_blank" rel="noopener noreferrer">
              <span className="yr-star">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />
                </svg>
              </span>
              Отзывы на Яндексе <b>· ТЦ «Фермер»</b>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

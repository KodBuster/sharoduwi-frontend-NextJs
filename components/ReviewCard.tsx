import type { REVIEWS } from "@/lib/data";

type Review = (typeof REVIEWS)[number];

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review review--card">
      {review.photo ? (
        <div className="rv-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={review.photo} alt="" loading="lazy" />
        </div>
      ) : null}
      <div className="stars" aria-label={`Оценка: ${review.rating} из 5`}>
        {"★".repeat(review.rating)}
      </div>
      <p>{review.text}</p>
      <div className="who">
        <div className="ava" style={{ background: review.color }}>
          {review.initial}
        </div>
        <div>
          <b>{review.name}</b>
          <span>{review.city}</span>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";

import { COLLECTIONS } from "@/lib/data";
import {
  FEATURED_COLLECTION_SLUGS,
  type DeliveryAreaConfig,
} from "@/lib/info-pages";

export function DeliveryPageContent({ config }: { config: DeliveryAreaConfig }) {
  const featuredCollections = FEATURED_COLLECTION_SLUGS.map((slug) =>
    COLLECTIONS.find((c) => c.slug === slug)
  ).filter(Boolean);

  return (
    <>
      <section className="sec info-page">
        <div className="wrap">
          <nav className="category-breadcrumb reveal" aria-label="Навигация">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <span>Доставка</span>
            <span aria-hidden="true">/</span>
            <span>{config.cityLabel}</span>
          </nav>

          <div className="info-hero reveal">
            <div className="sec-tag">
              <span className="dot" /> Доставка
            </div>
            <h1>{config.title}</h1>
            <p className="info-lead">{config.lead}</p>
          </div>
        </div>
      </section>

      <section className="sec info-page-section">
        <div className="wrap">
          <div className="info-split reveal">
            <div className="info-card info-card--wide">
              <h2>Куда привозим</h2>
              <ul className="info-list">
                {config.zones.map((zone) => (
                  <li key={zone}>{zone}</li>
                ))}
              </ul>
            </div>
            <div className="info-card info-card--wide">
              <h2>Самовывоз</h2>
              <p>{config.pickupNote}</p>
              <a
                href={config.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="info-link"
              >
                {config.mapLabel} →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec info-page-section">
        <div className="wrap">
          <div className="info-placeholder reveal">
            <h2>Стоимость и условия доставки</h2>
            <p>
              Актуальные тарифы, минимальная сумма заказа и интервалы доставки мы обновим на этой странице
              в ближайшее время. Пока что уточняйте стоимость при оформлении заказа — менеджер сразу
              подскажет варианты.
            </p>
            <div className="info-placeholder-box" aria-hidden="true">
              <span>Тарифы и условия — скоро здесь</span>
            </div>
            <p className="info-note">
              Напишите в{" "}
              <a href="https://max.ru/u/f9LHodD0cOJ0iFHpDtxRvHxZb55wWIT4L1UpmBingh61XxPU-GdBpm5h-ls">
                MAX
              </a>
              ,{" "}
              <a href="https://t.me/+79267086374">Telegram</a> или позвоните{" "}
              <a href="tel:+79267086374">+7 926 708-63-74</a> — ответим быстро.
            </p>
          </div>
        </div>
      </section>

      <section className="sec info-page-section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-tag">
              <span className="dot" /> Популярное
            </div>
            <h2>Что чаще заказывают с доставкой</h2>
            <p>Подборка коллекций — от облака под потолок до наборов на день рождения.</p>
          </div>
          <div className="info-chips reveal">
            {featuredCollections.map((collection) =>
              collection ? (
                <Link
                  key={collection.slug}
                  href={`/categories/${collection.slug}`}
                  className="chip"
                >
                  {collection.name}
                </Link>
              ) : null
            )}
            <Link href="/catalog" className="chip active">
              Весь каталог
            </Link>
          </div>
        </div>
      </section>

      <section className="sec info-page-section">
        <div className="wrap">
          <div className="info-steps reveal">
            <h2>Как заказать доставку</h2>
            <ol className="info-steps-list">
              <li>Выберите шары в каталоге или напишите нам — поможем с составом.</li>
              <li>Согласуем адрес, дату и время доставки в {config.cityLabel.toLowerCase()}.</li>
              <li>Соберём композицию, надуем гелием и привезём точно ко времени торжества.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="sec info-page-section">
        <div className="wrap">
          <div className="info-cta reveal">
            <h2>Заказать доставку в {config.cityLabel}</h2>
            <p>
              Также возим по соседним направлениям —{" "}
              {config.slug === "zhukovsky" ? (
                <Link href="/delivery/ramenskoe">доставка в Раменское и район</Link>
              ) : (
                <Link href="/delivery/zhukovsky">доставка по Жуковскому</Link>
              )}
              .
            </p>
            <div className="info-cta-actions">
              <Link href="/catalog" className="btn btn-primary">
                Выбрать шары
              </Link>
              <a href="tel:+79267086374" className="btn btn-ghost">
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

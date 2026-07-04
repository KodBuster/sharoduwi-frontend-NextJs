const STEPS = [
  {
    num: 1,
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </>
    ),
    title: "Выбираете",
    text: "Листаете каталог и добавляете понравившиеся шары в корзину.",
  },
  {
    num: 2,
    icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
    title: "Заказываете",
    text: "Оформляете заказ в корзине. В течение 10 минут с вами свяжется менеджер или высылаете понравившуюся композицию в удобном мессенджере: MAX, Telegram или WhatsApp.",
  },
  {
    num: 3,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    title: "Готовим",
    text: "Собираем композицию, надуваем гелием. Высылаем фото перед доставкой.",
  },
  {
    num: 4,
    icon: (
      <>
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
    title: "Привозим",
    text: "Доставляем по Москве и Московской области.",
  },
];

export function HowItWorks() {
  return (
    <section className="sec" id="how">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-tag">
            <span className="dot" /> Заказать просто
          </div>
          <h2>Как это работает</h2>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step reveal" data-d={s.num} key={s.num}>
              <div className="step-visual">
                <div className="ico">
                  <span className="num" aria-hidden="true">
                    {s.num}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {s.icon}
                  </svg>
                </div>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

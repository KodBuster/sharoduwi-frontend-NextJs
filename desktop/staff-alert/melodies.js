/** Каталог мелодий для tray-приложения Staff Alert (Web Audio). */
window.STAFF_ALERT_MELODIES = [
  {
    id: 0,
    name: "Сирена скорой",
    group: "Тревога",
    cycleMs: 1400,
    play(ctx, beep) {
      beep(920, 380, "sawtooth");
      beep(680, 380, "sawtooth", 400);
      beep(920, 380, "sawtooth", 800);
    },
  },
  {
    id: 1,
    name: "Пожарная",
    group: "Тревога",
    cycleMs: 1500,
    play(ctx, beep) {
      beep(520, 220, "triangle");
      beep(780, 220, "triangle", 240);
      beep(1040, 220, "triangle", 480);
      beep(1300, 320, "sawtooth", 720);
    },
  },
  {
    id: 2,
    name: "Красная тревога",
    group: "Тревога",
    cycleMs: 1300,
    play(ctx, beep) {
      [880, 660, 880, 660, 880].forEach((f, i) =>
        beep(f, 140, "square", i * 160, 0.85)
      );
      beep(440, 400, "sawtooth", 820, 0.7);
    },
  },
  {
    id: 3,
    name: "Скорый заказ",
    group: "Тревога",
    cycleMs: 1100,
    play(ctx, beep, kick) {
      kick(0, 60, 1);
      beep(1200, 120, "square", 80, 0.8);
      kick(280, 60, 0.9);
      beep(1200, 120, "square", 360, 0.8);
      kick(560, 60, 0.95);
      beep(1400, 200, "sawtooth", 640, 0.85);
    },
  },
  {
    id: 4,
    name: "Шаровой звон",
    group: "Праздник",
    cycleMs: 1200,
    play(ctx, beep) {
      beep(1568, 180, "sine", 0, 0.55);
      beep(2093, 120, "triangle", 120, 0.35);
      beep(880, 80, "sine", 200, 0.4);
      beep(1760, 100, "sine", 320, 0.3);
    },
  },
  {
    id: 5,
    name: "Фанфар",
    group: "Праздник",
    cycleMs: 1300,
    play(ctx, beep) {
      [523, 659, 784, 1047].forEach((f, i) =>
        beep(f, 160, "triangle", i * 130, 0.5)
      );
      beep(1318, 350, "sine", 550, 0.6);
    },
  },
  {
    id: 6,
    name: "Кассовый",
    group: "Праздник",
    cycleMs: 1000,
    play(ctx, beep) {
      beep(1800, 90, "sine", 0, 0.7);
      beep(2200, 90, "sine", 110, 0.65);
      beep(1800, 90, "sine", 220, 0.7);
      beep(2400, 140, "triangle", 330, 0.55);
    },
  },
  {
    id: 7,
    name: "Бас",
    group: "Мощные",
    cycleMs: 1400,
    play(ctx, beep) {
      const start = ctx.currentTime + 0.02;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, start);
      osc.frequency.exponentialRampToValueAtTime(32, start + 0.5);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(1, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.6);
      beep(1800, 150, "sawtooth", 480, 0.5);
    },
  },
  {
    id: 8,
    name: "Неон",
    group: "Мощные",
    cycleMs: 1100,
    play(ctx, beep) {
      [600, 900, 1200, 900, 600].forEach((f, i) =>
        beep(f, 70, "square", i * 95, 0.45)
      );
      beep(2000, 200, "sawtooth", 500, 0.55);
    },
  },
  {
    id: 9,
    name: "Сирена доставки",
    group: "Мощные",
    cycleMs: 1600,
    play(ctx, beep) {
      for (let i = 0; i < 4; i++) {
        const base = i * 360;
        beep(740, 170, "sawtooth", base, 0.55);
        beep(980, 170, "sawtooth", base + 180, 0.55);
      }
    },
  },
];

window.getStaffAlertMelody = function getStaffAlertMelody(id) {
  const list = window.STAFF_ALERT_MELODIES;
  const found = list.find((m) => m.id === Number(id));
  return found || list[0];
};

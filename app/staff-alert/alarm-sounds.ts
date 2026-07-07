export type AlarmSoundId = 0 | 1 | 2;

export const ALARM_SOUND_STORAGE_KEY = "staff-alert-sound";

export const ALARM_SOUNDS: ReadonlyArray<{
  id: AlarmSoundId;
  name: string;
  description: string;
  emoji: string;
}> = [
  {
    id: 0,
    name: "Сирена скорой",
    description: "Чередующиеся громкие тоны",
    emoji: "🚑",
  },
  {
    id: 1,
    name: "Резкий писк",
    description: "Прерывистый тревожный сигнал",
    emoji: "📣",
  },
  {
    id: 2,
    name: "Пожарная",
    description: "Нарастающая сирена",
    emoji: "🔥",
  },
];

export function isAlarmSoundId(value: number): value is AlarmSoundId {
  return value === 0 || value === 1 || value === 2;
}

export function readStoredAlarmSound(): AlarmSoundId {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(ALARM_SOUND_STORAGE_KEY);
  const parsed = raw === null ? 0 : Number(raw);
  return isAlarmSoundId(parsed) ? parsed : 0;
}

export function storeAlarmSound(id: AlarmSoundId): void {
  window.localStorage.setItem(ALARM_SOUND_STORAGE_KEY, String(id));
}

export function isWindowsDesktop(): boolean {
  if (typeof window === "undefined") return false;
  return /Windows/i.test(window.navigator.userAgent);
}

export function supportsStaffPush(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

type BeepFn = (
  freq: number,
  durationMs: number,
  type?: OscillatorType,
  delayMs?: number
) => void;

function createBeep(ctx: AudioContext): BeepFn {
  return (freq, durationMs, type = "square", delayMs = 0) => {
    const startAt = ctx.currentTime + delayMs / 1000;
    const endAt = startAt + durationMs / 1000;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    subOsc.type = type;
    osc.frequency.value = freq;
    subOsc.frequency.value = freq * 0.5;

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(1, startAt + 0.015);
    gain.gain.setValueAtTime(1, endAt - 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startAt);
    subOsc.start(startAt);
    osc.stop(endAt);
    subOsc.stop(endAt);
  };
}

export function playAlarmCycle(
  ctx: AudioContext,
  variant: AlarmSoundId,
  beep?: BeepFn
): void {
  const tone = beep ?? createBeep(ctx);

  if (variant === 0) {
    tone(920, 380, "sawtooth");
    tone(680, 380, "sawtooth", 400);
    tone(920, 380, "sawtooth", 800);
  } else if (variant === 1) {
    tone(1400, 160, "square");
    tone(1400, 160, "square", 190);
    tone(1400, 160, "square", 380);
    tone(1400, 220, "square", 570);
  } else {
    tone(520, 220, "triangle");
    tone(780, 220, "triangle", 240);
    tone(1040, 220, "triangle", 480);
    tone(1300, 320, "sawtooth", 720);
  }

  if ("vibrate" in navigator) {
    navigator.vibrate([400, 120, 400, 120, 500]);
  }
}

export function getAlarmCycleInterval(variant: AlarmSoundId): number {
  if (variant === 0) return 1400;
  if (variant === 1) return 1100;
  return 1500;
}

export function ensureAudioContext(
  current: AudioContext | null
): AudioContext {
  if (current) {
    void current.resume();
    return current;
  }

  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  const ctx = new Ctor();
  void ctx.resume();
  return ctx;
}

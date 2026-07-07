import { promises as fs } from "fs";
import path from "path";
import type { PushSubscription } from "web-push";

/**
 * Простое хранилище подписок в JSON-файле — БЕЗ базы данных и сторонних сервисов.
 *
 * ⚠️ ВАЖНО про хостинг:
 *  - На обычном VPS / собственном сервере / Docker с постоянным диском — работает идеально.
 *  - На serverless-платформах (Vercel, Netlify) файловая система эфемерная,
 *    поэтому подписки будут теряться. Для таких платформ замените функции ниже
 *    на запись в любой персистентный слой (Redis/Upstash, Postgres, KV и т.п.),
 *    а весь остальной код трогать не нужно — интерфейс сохраняется.
 *
 * Нам нужно всего 4 устройства, поэтому JSON-файла более чем достаточно.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "subscriptions.json");

async function readAll(): Promise<PushSubscription[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as PushSubscription[];
  } catch {
    // Файла ещё нет — значит подписок нет.
    return [];
  }
}

async function writeAll(subs: PushSubscription[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(subs, null, 2), "utf-8");
}

/** Добавить подписку (без дублей — сравниваем по endpoint). */
export async function addSubscription(sub: PushSubscription): Promise<number> {
  const subs = await readAll();
  const exists = subs.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subs.push(sub);
    await writeAll(subs);
  }
  return subs.length;
}

/** Получить все подписки. */
export async function getSubscriptions(): Promise<PushSubscription[]> {
  return readAll();
}

/** Удалить «мёртвую» подписку (например, если устройство отписалось / 410 Gone). */
export async function removeSubscription(endpoint: string): Promise<void> {
  const subs = await readAll();
  await writeAll(subs.filter((s) => s.endpoint !== endpoint));
}

import { promises as fs } from "fs";
import path from "path";
import type { PushSubscription } from "web-push";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "subscriptions.json");

async function readAll(): Promise<PushSubscription[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as PushSubscription[];
  } catch {
    return [];
  }
}

async function writeAll(subs: PushSubscription[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(subs, null, 2), "utf-8");
}

export async function addSubscription(sub: PushSubscription): Promise<number> {
  const subs = await readAll();
  const exists = subs.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subs.push(sub);
    await writeAll(subs);
  }
  return subs.length;
}

export async function getSubscriptions(): Promise<PushSubscription[]> {
  return readAll();
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const subs = await readAll();
  await writeAll(subs.filter((s) => s.endpoint !== endpoint));
}

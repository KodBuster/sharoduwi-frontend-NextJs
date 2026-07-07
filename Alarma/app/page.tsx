import Link from "next/link";

// Простая корневая страница — просто ссылка на /staff-alert.
// В твоём реальном сайте этот файл не нужен (у тебя уже есть главная).
export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
      <h1>🎈 ШАРОДУВЫ</h1>
      <p>
        Страница сигнала для сотрудников:{" "}
        <Link href="/staff-alert">/staff-alert</Link>
      </p>
    </main>
  );
}

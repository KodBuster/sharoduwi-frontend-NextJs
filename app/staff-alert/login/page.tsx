"use client";

import { FormEvent, useState } from "react";

function getRedirectTarget(): string {
  if (typeof window === "undefined") return "/staff-alert";
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  if (!redirect || !redirect.startsWith("/staff-alert")) {
    return "/staff-alert";
  }
  return redirect;
}

export default function StaffAlertLoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/staff-alert/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !json.ok) {
        throw new Error(json.error || "Не удалось войти");
      }

      window.location.assign(getRedirectTarget());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка входа");
      setLoading(false);
    }
  }

  return (
    <main className="staff-alert-login">
      <div className="staff-alert-balloons" aria-hidden>
        🎈🎈🎈
      </div>
      <h1 className="staff-alert-title">Вход для сотрудников</h1>
      <p className="staff-alert-subtitle">Страница сигналов о новых заказах</p>

      <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: 420 }}>
        <label htmlFor="staff-password" className="staff-alert-hint">
          Пароль
        </label>
        <input
          id="staff-password"
          className="staff-alert-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Введите пароль"
          required
        />
        <button
          type="submit"
          className="staff-alert-login-button"
          disabled={loading}
          style={{ marginTop: 12 }}
        >
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>

      {message && <p className="staff-alert-message">{message}</p>}
    </main>
  );
}

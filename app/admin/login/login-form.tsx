"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setErrorMessage(payload.message || "Login failed.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full bg-transparent border border-primary/35 px-4 py-3 text-base focus:outline-none focus:border-primary"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#d8c08f] text-[#1f2328] text-base px-8 py-4 rounded-none hover:bg-[#ead8b0] transition-all duration-300 font-bold shadow-[0_6px_20px_rgba(0,0,0,0.35)] uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Verifying..." : "Enter Admin"}
      </button>

      {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}
    </form>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import {
  ADMIN_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "../../../lib/admin-auth";
import { isDatabaseConfigured } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (!isDatabaseConfigured()) {
    return (
      <main className="min-h-screen px-6 md:px-12 py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6">
          Database Not Configured
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          Set <code>DATABASE_URL</code> first.
        </p>
      </main>
    );
  }

  if (!isAdminAuthConfigured()) {
    return (
      <main className="min-h-screen px-6 md:px-12 py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6">
          Admin Auth Not Configured
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code>{" "}
          in your environment variables first.
        </p>
      </main>
    );
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen px-6 md:px-12 py-24">
      <section className="max-w-xl mx-auto border border-primary/25 bg-background-elevated p-8 md:p-10">
        <p className="text-primary text-xs uppercase tracking-[0.3em] font-bold mb-4">
          Protected Access
        </p>
        <h1 className="text-4xl md:text-5xl font-bold uppercase mb-6">
          Admin Login
        </h1>
        <p className="text-slate-300 mb-8">
          Enter your admin password to access the upload console.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
